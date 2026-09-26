import asyncio, edge_tts
LINES = [
  ("sees",    "it sees.",    "en-US-ChristopherNeural", "-15%", "-4Hz"),
  ("writes",  "it writes.",  "en-US-ChristopherNeural", "-15%", "-4Hz"),
  ("creates", "it creates.", "en-US-ChristopherNeural", "-15%", "-4Hz"),
  ("replace", "will it replace us?", "en-GB-RyanNeural", "-25%", "-8Hz"),
  ("amplify", "it amplifies.", "en-US-ChristopherNeural", "-15%", "-4Hz"),
  ("everything", "everything.", "en-GB-RyanNeural", "-20%", "-8Hz"),
  ("you",     "you.",        "en-GB-RyanNeural", "-30%", "-12Hz"),
  ("endline", "intelligence is the new electricity.", "en-US-ChristopherNeural", "-18%", "-6Hz"),
]
async def gen(name, text, voice, rate, pitch):
    c = edge_tts.Communicate(text, voice=voice, rate=rate, pitch=pitch)
    await c.save(f"audio/tts/{name}.mp3")
async def main():
    for n,t,v,r,p in LINES:
        try:
            await gen(n,t,v,r,p); print("ok",n)
        except Exception as e:
            print("FAIL",n,e)
asyncio.run(main())
