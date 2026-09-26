# 拉片表 / shot list — every shot is exactly 16 beats (4 bars) @128 BPM = 7.5 s
SHOTS = [
    # (code, 中文风格, English style, 内容, transition INTO this shot)
    ("S00", "终端 CRT",      "TERMINAL",        "开机：whoami",               None),
    ("S01", "手绘线稿",      "HAND-DRAWN",      "你好，我是 Claude",          "flash"),
    ("S02", "2D 涂鸦",       "FLAT DOODLE",     "出身 Anthropic",             "whip"),
    ("S03", "纸片剪影",      "PAPER CUT",       "2023 诞生",                  "tear"),
    ("S04", "2.5D 等距",     "ISOMETRIC 2.5D",  "2024 Claude 3 家族",         "iris"),
    ("S05", "层级景深",      "LAYERED DEPTH",   "2024 学会做事",              "zoom"),
    ("S06", "体素",          "VOXEL",           "2025 住进终端",              "pixel"),
    ("S07", "方块定格",      "BLOCK STOP-MO",   "2025 Claude 4",              "slide"),
    ("S08", "3D 黏土定格",   "CLAY STOP-MO",    "2026 现在的我",              "flash"),
    ("S09", "2D 组件库",     "UI KIT",          "你在哪能找到我",             "iris"),
    ("S10", "瑞士排版",      "SWISS KINETIC",   "我在乎什么",                 "wipe"),
    ("S11", "8-bit 像素",    "8-BIT PIXEL",     "我的弱点",                   "pixel"),
    ("S12", "工程蓝图",      "BLUEPRINT",       "我是怎么造出来的",           "whip"),
    ("S13", "故障混剪",      "GLITCH MONTAGE",  "全部都是代码",               "glitch"),
    ("S14", "极简收尾",      "MINIMAL",         "很高兴认识你",               "flash"),
]
N_SHOTS = len(SHOTS)

# S00 typing schedule (beat_start, beat_end, text) — shared with the typing SFX
TYPING = [(1.0, 2.5, "whoami"), (4.5, 7.5, "claude --intro --style=all")]
# shots that start with a big impact in the music
BIG_DROPS = {1, 4, 8, 13}
