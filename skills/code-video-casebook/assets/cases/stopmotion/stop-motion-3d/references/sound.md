# Sound：从画面数据派生的声音

`scripts/audio.py`（numpy + scipy，零采样，确定性）。

```bash
python3 $S/scripts/audio.py --meta out/meta.json --inspect out/qc/inspect.json \
    --episode src/episode/episode.json --out out/audio [--sound sound.json] [--lufs -16]
```
产出：`mix.wav`（48k 浮点立体声）、`stems/{room,music,foley,fx}.wav`、`cues.json`（每个声音事件的时间和原因）、`loudness.json`。

## 目录
1. 分层与加入顺序
2. 音乐：每个画风一种乐器
3. Foley：姿态到位 + 事件
4. 转场 FX：声音领先画面
5. 静默是标点
6. 响度
7. 定制（sound.json）
8. 配音（VO）

---

## 1. 分层

```
room(环境) → foley(接触) → fx(转场/签名) → music → 有意的静默
```
- **room**：布朗噪声低通 + 空气嘶声；夜景画风（comic）换低频城市嗡声。永远不是数字零。
- 每个 stem 单独输出，后期可以只改一层。

## 2. 音乐

- 96 BPM → 一小节 2.5s；样片每个画风段 7.5s = 3 小节，**所有画风切换都落在小节线上**。设计新片时让段落长度是小节的整数倍（或者改 bpm 去适配）。
- 和弦 C–G–Am–F 一小节一个。
- 乐器族（`look_instrument`）：

| 画风 | 乐器族 | 织体 |
|---|---|---|
| diorama | musicbox | 八音盒琶音 + pad |
| block | chip | 25% 方波琶音 + 方波贝斯 + 8bit 鼓 |
| clay | marimba | 马林巴切分 + 木鱼 |
| vox | pizz | Karplus-Strong 拨弦 + 二四拍拍手 |
| sketch | piano | 稀疏钢琴 |
| comic | synth | 锯齿贝斯 + 16 分琶音 + 四拍底鼓 + 军鼓 |
| watercolor | bells | FM 钟琴 + pad |

- 结尾 bands：每揭开一条分屏，响一个该画风乐器的音（上行音阶）+ 该画风的签名音效。
- 音乐总线过一个卷积混响（1.8s），全片再过一个很短的共享房间混响，让 Foley 和音乐在同一个空间里。

## 3. Foley

**姿态到位**（从 inspect 的 sig 派生：`a>b` 变成 `b>b` 的那一帧）：

| 姿态 | 声音 |
|---|---|
| type_a / type_b | 键盘敲击（高频噪声 + 低频壳体，随机化） |
| hit_enter | 回车大键（更低、更重 + 170Hz 咚） |
| draw_a/b/c | 铅笔沙沙（带调幅的高频噪声） |
| tap | 触控笔点击 |
| fist_pump | 合成器短音 |
| cheer | "啵" |

焦点角色（本镜头有 acting 的）增益 1.0；全景里的其他人 0.22；特写镜头里画外的人 0.18——背景有生命但不抢。

**事件**（从 meta.events）：`hold.mug` → 瓷器轻碰/放下闷响；`hold.sheet` → 纸声；`hold.can` → 金属轻碰；`rin.pour` true→false 之间 = 水流床 + 气泡；`plant.watered` → 上行钟琴闪光。

## 4. 转场 FX

- wipe 的 whoosh：STFT 频带扫描噪声，**从镜头起点前 0.33s 开始**，峰值在 wipe 中点——声音领先画面 0.3–0.6s 是剪辑的通用规律，观众会感到画面"被声音拉过去"。
- 每个画风一个签名音（wipe 60% 处）：方块=金币、黏土=噗叽弹、Vox=剪刀+纸、线稿=铅笔一划、漫画=电子 zap、水彩=水滴。

## 5. 静默是标点

片尾标题前 0.8s → 0.3s 音乐全停，room 减半、Foley ×0.25，然后在标题出现前 0.3s 落终止和弦（pad + 钟 + 钢琴 + 底鼓）。静默必须设计在 cue 里，不是空档。

## 6. 响度

1. 混音 → ffmpeg loudnorm 测量 → 线性增益到目标（默认 −16 LUFS，60s 网络短片）→ 4× 过采样前瞻限幅器 −2.0 dBTP。
2. **AAC 编码会抬高真峰值**（实测可从 −1.5 抬到 0）：finalize 断言的是 MP4 里 AAC 的真峰值 ≤ −1.0 dBTP。
3. 安静开场的长片（180s）不要用动态 loudnorm，会把环境声抬得不成比例；用恒定增益。长片母带目标 ≈ −18 LUFS / −3.2 dBTP。

## 7. 定制（sound.json）

覆盖 `DEFAULTS` 的任意键：
```json
{ "bpm": 90, "progression": ["Am","F","C","G"],
  "look_instrument": {"clay": "piano"},
  "pose_foley": {"walk_a": "key", "walk_b": "key"},
  "event_foley": {"door.open": {"true": "paper"}},
  "night_looks": ["comic", "block"],
  "lead": 0.4, "silence": [-1.0, -0.3] }
```
新的 foley 类型在 `foley()` 里加一个分支（每种 5–15 行 DSP）。

## 8. 配音（VO）

需要旁白时：先生成 VO（任意 TTS），**实测时长写回镜头**（VO 时长 < 镜头时长 − 起点 − 0.2s，否则提速或加长镜头），VO 作为第五个 stem 混入；音乐在 VO 下 ducking −8dB；字幕由 VO 时间生成，相邻字幕 `end = min(end, 下一条 start)`。
