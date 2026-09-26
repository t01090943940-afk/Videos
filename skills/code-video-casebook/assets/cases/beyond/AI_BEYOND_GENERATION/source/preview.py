import sys,time
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np
from art import Art,ROOT,STORY
art=Art(1280,720)
start=time.time()
for i in range(15):
 t=time.time();a=art.render(i,1.15);im=Image.fromarray(a[:,:,[2,1,0]]);im.save(ROOT/'qa'/f'world_{i+1:02d}.png');print(i+1,round(time.time()-t,3),flush=True)
contact=Image.new('RGB',(1600,1000),'#13191e');d=ImageDraw.Draw(contact);f=ImageFont.truetype('/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf',19)
for i in range(15):
 im=Image.open(ROOT/'qa'/f'world_{i+1:02d}.png');im.thumbnail((512,288));x=16+(i%3)*533;y=12+(i//3)*198;im=im.resize((512,288)).crop((0,0,512,288));im.thumbnail((320,180))
 # 3 columns x 5 rows with 16:9 scene stills and their own frame.
 im=Image.open(ROOT/'qa'/f'world_{i+1:02d}.png').resize((340,191));
# Larger 5 x 3 sheet, preserving the entire image rather than cropping captions.
contact=Image.new('RGB',(1920,720),'#111922');d=ImageDraw.Draw(contact)
for i in range(15):
 x=(i%5)*384;y=(i//5)*240;im=Image.open(ROOT/'qa'/f'world_{i+1:02d}.png').resize((374,210));contact.paste(im,(x+5,y+5));d.text((x+10,y+217),f'{i+1:02d}  '+STORY['scenes'][i]['tag'].split(' / ')[0],font=f,fill='#e2edef')
contact.save(ROOT/'qa'/'contact_sheet.jpg',quality=94);print('total',time.time()-start)
