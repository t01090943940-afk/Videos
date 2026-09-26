"""Master timeline: one beat grid drives picture, music and sound design.

BPM = 128.571428..  ->  1 beat = 28 frames @60fps = 22400 samples @48k.
All cuts are expressed in beats, so every cut lands on an exact frame.
"""
import os

# ---- paths (packaging edit: originally hard-coded /home/claude/av/...)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_DIR = os.path.join(ROOT, 'fonts')
BUILD = os.environ.get('AOI_BUILD', os.path.join(ROOT, 'build'))
os.makedirs(BUILD, exist_ok=True)

FPS = 60
SR = 48000
FPB = 28                      # frames per beat
SPB = 22400                   # samples per beat
BPM = 60.0 * FPS / FPB        # 128.5714
BEAT = FPB / FPS              # 0.46667 s
END_BEAT = 198                # 48 bars of music + held end card
N_FRAMES = END_BEAT * FPB     # 5544 frames = 92.4 s
W, H = 1920, 1080

# ---------------------------------------------------------------- sections
SECTIONS = [  # (start_beat, end_beat, name)
    (0, 16, 'intro'), (16, 48, 'verse'), (48, 64, 'build1'), (64, 96, 'drop1'),
    (96, 112, 'break'), (112, 128, 'build2'), (128, 176, 'drop2'), (176, 198, 'outro'),
]
CHAPTERS = [
    (0, '00', 'PROLOGUE'), (16, '01', 'ORIGINS'), (48, '01', 'ORIGINS'),
    (64, '02', 'HOW IT THINKS'), (96, '03', 'SCALE'), (112, '03', 'SCALE'),
    (128, '04', 'WHAT IT CAN DO'), (176, '05', 'YOU'),
]


def section_at(b):
    for s, e, n in SECTIONS:
        if s <= b < e:
            return n
    return 'outro'


# ---------------------------------------------------------------- typing
INTRO_PROMPT = 'Can machines think?'
INTRO_TYPE_START = 1.0       # beat
INTRO_TYPE_RATE = 5.0        # chars per beat
OUTRO_PROMPT = 'What will you build?'
OUTRO_TYPE_START = 178.5
OUTRO_TYPE_RATE = 6.0

# ---------------------------------------------------------------- shots
S = []


def shot(b0, b1, scene, **kw):
    S.append(dict(b0=b0, b1=b1, scene=scene, **kw))


# PROLOGUE
shot(0, 8, 'terminal_intro')
shot(8, 16, 'year_1950')

# ORIGINS — one milestone per bar; the year slams in and flies to the corner
shot(16, 20, 'ai_points', year='1956')
shot(20, 24, 'perceptron', year='1958')
shot(24, 28, 'backprop', year='1986')
shot(28, 32, 'chess', year='1997')
shot(32, 36, 'imagenet', year='2012')
shot(36, 40, 'go', year='2016')
shot(40, 44, 'transformer', year='2017')
shot(44, 48, 'params', year='2020')

# BUILD 1 — cuts accelerate 4 -> 2 -> 1 -> 1/2 beat
shot(48, 52, 'chat', year='2022')
shot(52, 54, 'tunnel_word', word='IT READS', hue=0)
shot(54, 56, 'tunnel_word', word='IT WRITES', hue=1)
shot(56, 57, 'tunnel_word', word='IT SEES', hue=2)
shot(57, 58, 'tunnel_word', word='IT CODES', hue=0)
shot(58, 59, 'tunnel_word', word='IT TALKS', hue=1)
shot(59, 60, 'tunnel_word', word='IT REASONS', hue=2)
for i, wd in enumerate(['BUT', 'HOW', 'DOES', 'IT', 'REALLY', 'THINK']):
    shot(60 + i * 0.5, 60.5 + i * 0.5, 'tunnel_word', word=wd, hue=i % 3, fast=True)
shot(63, 64, 'question_hold', text='HOW DOES IT THINK?')

# DROP 1 — HOW IT THINKS
shot(64, 66, 'impact_title', text='HOW IT THINKS', sub='HOW A LANGUAGE MODEL WORKS')
shot(66, 68, 'tokens_split')
shot(68, 70, 'token_ids')
shot(70, 72, 'token_fact')
shot(72, 76, 'embed_orbit')
shot(76, 78, 'embed_zoom')
shot(78, 80, 'embed_math')
shot(80, 84, 'attention_arcs')
shot(84, 86, 'attention_matrix')
shot(86, 88, 'multihead')
shot(88, 90, 'predict_bars')
shot(90, 92, 'deepnet3d')
for k in range(4):
    shot(92 + k, 93 + k, 'autoregress', k=k)

# BREAK — SCALE
shot(96, 104, 'brain_sphere')
shot(104, 112, 'compute_chart')

# BUILD 2
shot(112, 116, 'question_changed', v=0)
shot(116, 120, 'question_changed', v=1)
shot(120, 121, 'grid_word', word='NOT', v=0)
shot(121, 122, 'grid_word', word='“CAN IT', v=1)
shot(122, 123, 'grid_word', word='THINK?”', v=2)
shot(123, 124, 'grid_word', word='BUT', v=0)
for i, wd in enumerate(['WHAT', 'CAN', 'IT', 'DO']):
    shot(124 + i * 0.5, 124.5 + i * 0.5, 'grid_word', word=wd, v=(i + 1) % 3, fast=True)
for i in range(4):
    shot(126 + i * 0.25, 126.25 + i * 0.25, 'icon_flash', k=i)
shot(127, 128, 'question_hold', text='WHAT CAN IT DO?')

# DROP 2 — WHAT IT CAN DO
shot(128, 130, 'code_editor', label='IT WRITES CODE')
shot(130, 132, 'tests_pass', label='IT TESTS IT')
shot(132, 134, 'vision_city', label='IT SEES')
shot(134, 136, 'speech_wave', label='IT LISTENS & SPEAKS')
shot(136, 140, 'protein', label='IT FOLDS PROTEINS')
shot(140, 144, 'nobel', label='NOBEL 2024')
shot(144, 148, 'diffusion', label='IT IMAGINES')
shot(148, 152, 'agents', label='IT ACTS')
shot(152, 156, 'globe', label='EVERYWHERE')
RECAP = [('brain_sphere', 'LEARN'), ('embed_orbit', 'BUILD'),
         ('tunnel_word', 'CREATE'), ('attention_arcs', 'DISCOVER')]
for i, (sc, wd) in enumerate(RECAP):
    shot(156 + i, 157 + i, 'recap', base=sc, word=wd, k=i)
SWITCH_WORDS = ['HEAL', 'TEACH', 'TRANSLATE', 'EXPLORE', 'DESIGN', 'COMPOSE', 'SIMULATE',
                'PREDICT', 'CODE', 'CURE', 'INVENT', 'ASK', 'BUILD', 'SHIP', 'LEARN', 'DREAM']
for i, wd in enumerate(SWITCH_WORDS):
    shot(160 + i * 0.5, 160.5 + i * 0.5, 'switch_word', word=wd, k=i)
for i, y in enumerate(['1950', '1986', '2017', 'NOW']):
    shot(168 + i, 169 + i, 'year_recap', year=y, k=i)
for i in range(16):
    shot(172 + i * 0.25, 172.25 + i * 0.25, 'stutter', k=i)

# OUTRO
shot(176, 184, 'terminal_outro')
shot(184, END_BEAT, 'end_card')

SHOTS = S

# ---------------------------------------------------------------- subtitles
SUBS = [
    (0.5, 16, '1950 — Alan Turing asks: “Can machines think?”', '1950年，艾伦·图灵提问：“机器能思考吗？”'),
    (16, 20, '1956 — Dartmouth: AI becomes a field.', '1956年，达特茅斯会议：AI成为一门学科。'),
    (20, 24, '1958 — The Perceptron learns from examples.', '1958年，感知机学会从样本中学习。'),
    (24, 28, '1986 — Backprop: networks learn from mistakes.', '1986年，反向传播：网络从错误中学习。'),
    (28, 32, '1997 — Deep Blue beats Kasparov at chess.', '1997年，“深蓝”击败国际象棋冠军卡斯帕罗夫。'),
    (32, 36, '2012 — AlexNet: ImageNet error 26% → 15%.', '2012年，AlexNet：ImageNet错误率26%→15%。'),
    (36, 40, '2016 — AlphaGo beats Lee Sedol 4–1.', '2016年，AlphaGo以4:1战胜李世石。'),
    (40, 44, '2017 — The Transformer is born.', '2017年，Transformer诞生。'),
    (44, 48, '2020 — GPT-3: 175 billion parameters.', '2020年，GPT-3：1750亿参数。'),
    (48, 52, '2022 — ChatGPT: ~100M users in 2 months (est.)', '2022年，ChatGPT两个月用户约1亿（估算）。'),
    (52, 60, 'It reads. It writes. It sees. It codes.', '它会读、会写、会看、会编程。'),
    (60, 64, 'But how does it actually think?', '但它究竟是怎么“思考”的？'),
    (66, 72, '① Text is chopped into tokens — numbers the model can read.', '① 文本被切成token——模型能读懂的数字。'),
    (72, 80, '② Each token becomes a vector. Meaning becomes geometry.', '② 每个token都变成一个向量，意义变成了几何。'),
    (80, 88, '③ Attention: every word looks at every other word for context.', '③ 注意力：每个词都会关注其他所有词，寻找上下文。'),
    (88, 96, '④ Predict the next token. Then the next. Again and again.', '④ 预测下一个token，再下一个，周而复始。'),
    (96, 104, 'More data. More compute. New abilities emerge.', '更多数据，更多算力，新的能力不断涌现。'),
    (104, 112, 'Frontier training compute has grown about 4–5× per year.', '前沿模型的训练算力，大约每年增长4到5倍。'),
    (112, 120, 'So the question has changed.', '于是，问题变了。'),
    (120, 128, 'Not “Can it think?” — but “What can it do?”', '不再是“它能思考吗？”，而是“它能做什么？”'),
    (128, 136, 'It writes and tests code. It sees. It listens and speaks.', '它能写代码、跑测试，能看，能听，也能说。'),
    (136, 140, 'AlphaFold: 200M+ protein structures predicted.', 'AlphaFold：已预测超过2亿种蛋白质结构。'),
    (140, 144, '2024 — Two Nobel Prizes honor AI breakthroughs.', '2024年，两项诺贝尔奖授予AI相关突破。'),
    (144, 148, 'Diffusion models turn pure noise into images.', '扩散模型能把纯噪声变成图像。'),
    (148, 152, 'Agents plan, use tools, and finish multi-step tasks.', '智能体会规划、调用工具，完成多步骤任务。'),
    (152, 160, 'In labs, classrooms, hospitals and studios — everywhere.', '在实验室、课堂、医院和工作室——无处不在。'),
    (160, 176, 'AI amplifies whoever uses it.', 'AI会放大每一个使用它的人。'),
    (176, 184, 'The question is no longer “Can machines think?”', '问题不再是“机器能思考吗？”'),
]

# ---------------------------------------------------------------- sound design cues
# (beat, kind, params)
SFX = []


def sfx(b, kind, **kw):
    SFX.append((b, kind, kw))


def _typing(start, rate, text, seed):
    for i, ch in enumerate(text):
        sfx(start + i / rate, 'key', space=(ch == ' '), seed=seed + i)
    sfx(start + len(text) / rate + 0.25, 'enter')


_typing(INTRO_TYPE_START, INTRO_TYPE_RATE, INTRO_PROMPT, 100)
sfx(8, 'hit_soft')
sfx(12, 'swell_rev', length=4)
for b in range(16, 48, 4):
    sfx(b, 'data_hit')
    sfx(b + 0.3, 'whoosh', length=0.6, pan=0.6)
sfx(48, 'data_hit')
for b in [52, 54, 56, 57, 58, 59]:
    sfx(b, 'swish', length=0.35)
for i in range(6):
    sfx(60 + 0.5 * i, 'glitch', length=0.12, seed=i)
sfx(63.0, 'sub_drop_in')
for i, d in enumerate([0, 0.5, 1.0, 1.5]):
    sfx(66 + d, 'blip', f=900 + 200 * i)
for i in range(8):
    sfx(68 + i * 0.25, 'tick', f=2400 + 150 * i)
sfx(72, 'whoosh', length=1.2, pan=-0.7)
sfx(78, 'blip', f=1400)
sfx(78.5, 'blip', f=1700)
sfx(79, 'blip', f=2000)
sfx(80, 'whoosh', length=0.8, pan=0.5)
for i in range(4):
    sfx(92 + i, 'data_hit')
sfx(98, 'swell', length=6)
sfx(104, 'whoosh', length=1.5, pan=0.0)
for b in [120, 121, 122, 123]:
    sfx(b, 'swish', length=0.3)
for i in range(4):
    sfx(124 + 0.5 * i, 'glitch', length=0.1, seed=10 + i)
for i in range(4):
    sfx(126 + 0.25 * i, 'glitch', length=0.08, seed=20 + i)
sfx(127.0, 'sub_drop_in')
for b in [130, 132, 134, 136, 140, 144, 148, 152]:
    sfx(b, 'whoosh', length=0.5, pan=(-0.6 if b % 4 else 0.6))
for i in range(12):
    sfx(128.1 + i * 0.13, 'key', space=False, seed=300 + i)
sfx(131.0, 'success')
sfx(140, 'shimmer')
for i in range(4):
    sfx(156 + i, 'data_hit')
for i in range(16):
    sfx(160 + 0.5 * i, 'swish', length=0.18)
for i in range(4):
    sfx(168 + i, 'glitch', length=0.2, seed=40 + i)
for i in range(16):
    sfx(172 + 0.25 * i, 'glitch', length=0.06, seed=60 + i)
sfx(176, 'hit_soft')
sfx(177.2, 'zap')
_typing(OUTRO_TYPE_START, OUTRO_TYPE_RATE, OUTRO_PROMPT, 500)
sfx(184, 'shimmer')


def validate():
    t = 0
    for s in SHOTS:
        assert abs(s['b0'] - t) < 1e-9, ('gap/overlap at', t, s)
        assert s['b1'] > s['b0']
        f0, f1 = s['b0'] * FPB, s['b1'] * FPB
        assert abs(f0 - round(f0)) < 1e-9 and abs(f1 - round(f1)) < 1e-9, s
        t = s['b1']
    assert abs(t - END_BEAT) < 1e-9
    return len(SHOTS)


if __name__ == '__main__':
    print('shots', validate(), 'frames', N_FRAMES, 'dur', N_FRAMES / FPS, 'bpm', BPM)
