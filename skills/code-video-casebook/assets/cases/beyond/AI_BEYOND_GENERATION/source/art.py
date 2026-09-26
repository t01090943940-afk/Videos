"""Fifteen art-directed worlds. Vector scenes use native Cairo; 3D is native OpenGL.
All animation is deterministic and driven by a shared 128-BPM timeline.
"""
import json,math,os
from pathlib import Path
from functools import lru_cache
import numpy as np
import cairo
from PIL import Image,ImageDraw,ImageFont
from threeworlds import ThreeWorlds
ROOT=Path(__file__).resolve().parent.parent
STORY=json.loads((ROOT/'source'/'story.json').read_text())
W,H=1920,1080; B=60/128; SCENE=16*B
_SILENT=False
FONTS={'black':'/usr/share/fonts/opentype/inter/InterDisplay-Black.otf','bold':'/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf','regular':'/usr/share/fonts/opentype/inter/InterDisplay-Regular.otf','light':'/usr/share/fonts/opentype/inter/InterDisplay-Light.otf','italic':'/usr/share/fonts/opentype/inter/InterDisplay-BlackItalic.otf','mono':'/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf','cn':'/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc','cnreg':'/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','serif':'/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc','ink':'/usr/share/fonts/truetype/arphic-gkai00mp/gkai00mp.ttf'}
def clamp(x,a=0,b=1):return max(a,min(b,x))
def ease(x):x=clamp(x);return 1-(1-x)**3
def smooth(x):x=clamp(x);return x*x*(3-2*x)
def rgb(c):
 if isinstance(c,str):return tuple(int(c.lstrip('#')[j:j+2],16)/255 for j in (0,2,4))
 return tuple(c[:3])
def color(c,co,a=1):c.set_source_rgba(*rgb(co),a)
def rect(c,x,y,w,h,co,alpha=1,r=0):
 if w<=0 or h<=0:return
 color(c,co,alpha)
 if r<=0:c.rectangle(x,y,w,h)
 else:
  r=min(r,w/2,h/2);c.new_sub_path();c.arc(x+w-r,y+r,r,-math.pi/2,0);c.arc(x+w-r,y+h-r,r,0,math.pi/2);c.arc(x+r,y+h-r,r,math.pi/2,math.pi);c.arc(x+r,y+r,r,math.pi,1.5*math.pi);c.close_path()
 c.fill()
def circle(c,x,y,r,co=None,stroke=None,lw=2,alpha=1):
 c.new_path();c.arc(x,y,max(.01,r),0,math.tau)
 if co:color(c,co,alpha);c.fill_preserve()
 if stroke:color(c,stroke,alpha);c.set_line_width(lw);c.stroke()
 else:c.new_path()
def line(c,pts,co='#111111',lw=3,alpha=1,closed=False,dash=None):
 if not pts:return
 c.new_path();c.move_to(*pts[0])
 for p in pts[1:]:c.line_to(*p)
 if closed:c.close_path()
 c.set_line_width(lw);c.set_line_cap(cairo.LINE_CAP_ROUND);c.set_line_join(cairo.LINE_JOIN_ROUND);c.set_dash(dash or []);color(c,co,alpha);c.stroke();c.set_dash([])
def poly(c,pts,co,stroke=None,lw=2,alpha=1):
 c.new_path();c.move_to(*pts[0])
 for p in pts[1:]:c.line_to(*p)
 c.close_path();color(c,co,alpha);c.fill_preserve()
 if stroke:color(c,stroke,alpha);c.set_line_width(lw);c.stroke()
 else:c.new_path()
def arrow(c,a,b,co,lw=5,head=20,alpha=1):
 line(c,[a,b],co,lw,alpha);th=math.atan2(b[1]-a[1],b[0]-a[0]);p1=(b[0]-head*math.cos(th-.5),b[1]-head*math.sin(th-.5));p2=(b[0]-head*math.cos(th+.5),b[1]-head*math.sin(th+.5));line(c,[p1,b,p2],co,lw,alpha)
def shadow(c,x,y,w,h,alpha=.12):
 for k in range(10,0,-1):rect(c,x-k*2+10,y-k*2+16,w+k*4,h+k*4,'#15121E',alpha/17,18+k*2)

def surface_from_bgra(a):
 a=np.ascontiguousarray(a,dtype=np.uint8);s=cairo.ImageSurface.create_for_data(a,cairo.FORMAT_ARGB32,a.shape[1],a.shape[0],a.shape[1]*4);return s,a
@lru_cache(maxsize=1200)
def type_surface(s,size,co,font='black',outline=0):
 if any(ord(x)>255 for x in s) and font not in ['serif','ink','cnreg','cn','mono']:font='cn'
 f=ImageFont.truetype(FONTS[font],int(size));box=f.getbbox(s,stroke_width=outline);w=max(1,box[2]-box[0]+4);h=max(1,box[3]-box[1]+4)
 im=Image.new('RGBA',(w,h));d=ImageDraw.Draw(im);cc=tuple(int(x*255) for x in rgb(co))+(255,)
 if outline:d.text((2-box[0],2-box[1]),s,font=f,fill=(0,0,0,0),stroke_width=outline,stroke_fill=cc)
 else:d.text((2-box[0],2-box[1]),s,font=f,fill=cc)
 a=np.array(im);a[:,:,:3]=((a[:,:,:3].astype(np.uint16)*a[:,:,3:4])//255).astype(np.uint8);a=a[:,:,[2,1,0,3]].copy();surf,arr=surface_from_bgra(a);return surf,arr,w,h

def text(c,s,x,y,size=50,co='#111111',font='black',anchor='lt',alpha=1,angle=0,maxw=None,outline=0):
 if _SILENT and str(s) not in ['?','RAM','ARCHIVE','DELETE']:return (0,0)
 surf,arr,w,h=type_surface(str(s),int(size),co,font,outline);sc=min(1,maxw/w) if maxw else 1
 c.save();c.translate(x,y);c.rotate(angle);c.scale(sc,sc)
 if anchor.startswith('c'):c.translate(-w/2,0)
 elif anchor.startswith('r'):c.translate(-w,0)
 if anchor.endswith('m'):c.translate(0,-h/2)
 elif anchor.endswith('b'):c.translate(0,-h)
 c.set_source_surface(surf,0,0);c.paint_with_alpha(clamp(alpha));c.restore();return w*sc,h*sc

def placed_surface(c,surf,x,y,w,h,alpha=1):
 c.save();c.translate(x,y);c.scale(w/surf.get_width(),h/surf.get_height());c.set_source_surface(surf,0,0);c.paint_with_alpha(alpha);c.restore()

class Art:
 def __init__(self,w=1920,h=1080):
  self.w,self.h=w,h;self.three=None;self.thumb=[];self._texture={}
  for i in range(15):
   p=ROOT/'qa'/f'world_{i+1:02d}.png'
   if p.exists():self.thumb.append(cairo.ImageSurface.create_from_png(str(p)))
 def canvas(self,bg='#FFFFFF',arr=None,w=None,h=None):
  w=w or self.w;h=h or self.h
  if arr is None:
   surf=cairo.ImageSurface(cairo.FORMAT_ARGB32,w,h);a=None
  else:surf,a=surface_from_bgra(arr)
  c=cairo.Context(surf);c.scale(w/W,h/H)
  if arr is None:rect(c,0,0,W,H,bg)
  return surf,c,a
 def grain(self,c,alpha=.06):
  if 'grain' not in self._texture:
   rng=np.random.default_rng(32);n=rng.integers(0,255,(128,128),np.uint8);a=np.repeat(n[:,:,None],4,2);a[:,:,3]=255;s,arr=surface_from_bgra(a);self._texture['grain']=(s,arr)
  p=cairo.SurfacePattern(self._texture['grain'][0]);p.set_extend(cairo.EXTEND_REPEAT);c.set_source(p);c.paint_with_alpha(alpha)
 def tag(self,c,info,co='#111111',x=90,y=55):
  text(c,info['tag'],x,y,23,co,'mono');text(c,'BEYOND GENERATION',1830,y,20,co,'mono',anchor='rt')
 def caption(self,c,info,co='#111111',bg=None,t=1):
  alpha=smooth((t-.2)/.26)
  if bg:rect(c,70,920,1780,102,bg,.90,r=0)
  text(c,info['caption'],960,946,37,co,'cnreg',anchor='ct',alpha=alpha,maxw=1710)
 def subtitle_key(self,c,info,x,y,co='#111111',size=34):text(c,info['key'],x,y,size,co,'cnreg')
 def sketchline(self,c,pts,t,lw=3,alpha=1):
  for j in range(2):
   pp=[(x+1.3*math.sin(k*1.7+j*2+t*1.1),y+1.2*math.cos(k*1.3+j+t)) for k,(x,y) in enumerate(pts)];line(c,pp,'#1F2224',lw if j==0 else .8,alpha*(1 if j==0 else .45))
 def hand(self,c,t,info):
  self.grain(c,.055);self.tag(c,info,'#272724');beat=t/B;shot=min(3,int(beat/4));pulse=math.exp(-(beat%1)*9)
  text(c,'ASK',85,142,250,'#1F2224','black',outline=3)
  text(c,'BETTER.',95,404,128,'#1F2224','black',outline=2)
  text(c,info['title'],98,589,72,'#202522','cn',outline=1)
  self.subtitle_key(c,info,102,700,'#3C413E',31)
  cx,cy=1350,485;rr=238+3*pulse
  c.save();c.translate(cx,cy);c.rotate(.05*math.sin(t*.5))
  # Hand-drawn spherical lattice, not a flat icon.
  for j in range(-7,8):
   yy=j/8;rad=rr*math.sqrt(max(0,1-yy*yy));pts=[]
   for k in range(80):a=k/79*math.tau;pts.append((rad*math.cos(a),yy*rr+rad*.20*math.sin(a)))
   self.sketchline(c,pts,t,1.1,.55)
  for j in range(9):
   a=j*math.pi/9+t*.18;pts=[(rr*math.cos(k/99*math.tau)*math.cos(a),rr*math.sin(k/99*math.tau)) for k in range(100)];self.sketchline(c,pts,t,1.3,.6)
  c.restore()
  circle(c,cx,cy,rr+26,stroke='#242625',lw=2)
  text(c,'?',cx,cy-150,290,'#1B211E','bold',anchor='ct',outline=3)
  # Three clear task constraints drawn onto the page.
  labels=['GOAL','CONSTRAINT','DONE?'];coords=[(1090,802),(1345,802),(1625,802)]
  for j,(x,y) in enumerate(coords):
   box=[(x-98,y-37),(x+101,y-40),(x+100,y+36),(x-100,y+38),(x-98,y-37)]
   self.sketchline(c,box,t,2.2);text(c,labels[j],x,y-16,26,'#232823','mono',anchor='ct')
   self.sketchline(c,[(cx+(j-1)*140,740),(x,y-42)],t,1.8)
  self.sketchline(c,[(670,676),(795,676),(865,560),(1050,560)],t,3)
  arrow(c,(983,560),(1050,560),'#2C302B',3,20)
  for j in range(11):
   a=j*math.tau/11+t*.11;x=cx+(rr+50)*math.cos(a);y=cy+(rr+50)*math.sin(a);self.sketchline(c,[(x,y),(x+20*math.cos(a),y+20*math.sin(a))],t,2)
  self.caption(c,info,t=t)
 def editorial(self,c,t,info):
  rect(c,0,0,W,H,'#FFE449');self.grain(c,.045);self.tag(c,info)
  shot=min(3,int(t/(4*B)));u=(t%(4*B))/(4*B)
  text(c,'SOURCE',85,143,200,'#181A19','black');text(c,'CHECK.',88,361,197,'#181A19','black')
  rect(c,92,596,650,104,'#1A1C1A');text(c,info['title'],116,615,63,'#FFE64D','cn',maxw=595)
  text(c,'NO SOURCE. NO CERTAINTY.',100,749,29,'#282823','mono')
  # Newsroom paper: a cut silhouette, grid globe and marked evidence.
  c.save();c.translate(1320,508);c.rotate(-.064+.012*math.sin(t*.6));c.scale(1+.018*u,1+.018*u)
  shadow(c,-390,-342,766,716,.19)
  rng=np.random.default_rng(3);pts=[(-392,-345),(378,-345)]+[(378+rng.uniform(-7,7),-345+k*45) for k in range(17)]+[(-392,375)]+[(-392+rng.uniform(-5,5),375-k*45) for k in range(17)]
  poly(c,pts,'#F6F2E7')
  rect(c,-348,-294,684,41,'#22231F');text(c,'PRIMARY DOCUMENT / 001',-325,-286,24,'#FAF6E9','mono')
  # An original halftone globe, used as a visual metaphor rather than a factual map.
  gx,gy=0,-28;r=183
  circle(c,gx,gy,r,'#D2D1C5',stroke='#242723',lw=2)
  for j in range(-5,6):
   y=j*r/6;rx=math.sqrt(max(0,r*r-y*y));line(c,[(-rx,y+gy),(rx,y+gy)],'#393C34',1.2,.65)
  for j in range(-4,5):
   c.save();c.translate(gx,gy);c.scale(max(.08,abs(j)/4),1);circle(c,0,0,r,stroke='#484B43',lw=1);c.restore()
  # Geometric land-like patches are explicitly illustrative, not cartographic data.
  patches=[[(-115,-126),(-43,-141),(5,-99),(-20,-63),(-91,-58),(-134,-96)],[(-45,-28),(24,-18),(51,29),(14,76),(-1,141),(-39,104),(-68,22)],[(45,-91),(107,-122),(163,-43),(106,-9),(80,42),(25,1)]]
  for pp in patches:poly(c,[(x,y+gy) for x,y in pp],'#33382F')
  for y in range(-180,149,10):
   for x in range(-180,181,10):
    if x*x+y*y<r*r:circle(c,x,y+gy,1.1,'#EFEBDD',alpha=.28)
  for j in range(3):rect(c,-335,214+j*33,400-j*66,10,'#A9AA9B')
  rect(c,-336,206+shot%3*33,440,28,'#FFE145',.60)
  text(c,'TRACE THE CLAIM.',-335,319,31,'#242721','bold')
  c.restore()
  c.save();c.translate(1666,763);c.rotate(-.14);rect(c,-128,-43,256,86,'#272B24');text(c,'VERIFY',0,-24,44,'#F9F3DD','bold',anchor='ct');c.restore()
  arrow(c,(820,687),(979,621),'#1F241C',7,30)
  self.caption(c,info,t=t)
 def svg(self,c,t,info):
  rect(c,0,0,W,H,'#F4F1E9');self.tag(c,info,'#123EBC');beat=t/B;shot=min(3,int(beat/4));u=(beat%4)/4;p=math.exp(-(beat%1)*9)
  rect(c,0,115,650,760,'#214DD5');text(c,'MAKE',68,169,147,'#F8F4E8');text(c,'IT',66,333,210,'#F8F4E8');text(c,'REAL.',68,551,143,'#FFD352')
  text(c,info['title'],720,147,67,'#193DAB','cn');text(c,'tool.execute(input)',725,250,34,'#244DCA','mono')
  # Strictly flat paths and fills: a rotating gear, a socket and an execution route.
  cx,cy=1090,539;r=172+2*p;pts=[]
  for j in range(96):
   a=j/96*math.tau+t*.32;rad=r if j%8 in [0,1,6,7] else r+31;pts.append((cx+rad*math.cos(a),cy+rad*math.sin(a)))
  poly(c,pts,'#F36537');circle(c,cx,cy,97,'#F4F1E9');circle(c,cx,cy,40,'#214DD5')
  # Thick Bezier route is drawn as SVG-style vector geometry.
  c.new_path();c.move_to(711,758);c.curve_to(861,758,818,544,916,540);color(c,'#244DCE');c.set_line_width(20);c.stroke()
  c.new_path();c.move_to(1289,541);c.curve_to(1457,541,1433,752,1580,752);color(c,'#244DCE');c.set_line_width(20);c.stroke()
  rect(c,1495,401,279,213,'#FFD352',r=40);rect(c,1553,447,163,114,'#F4F1E9',r=13)
  line(c,[(1581,497),(1617,534),(1690,465)],'#214DD5',18)
  for j in range(3):
   x=740+j*53+((beat%1)*40);circle(c,x,758,11,'#F36537')
  arrow(c,(1390,345),(1510,345),'#244DCE',13,36)
  text(c,'INPUT',703,818,25,'#224FCB','mono');text(c,'TOOL',1038,818,25,'#224FCB','mono');text(c,'VERIFIED OUTPUT',1510,818,25,'#224FCB','mono')
  self.caption(c,info,'#213B80',t=t)
 def pixel(self,c,t,info):
  rect(c,0,0,W,H,'#0C152C');beat=t/B;shot=min(3,int(beat/4));u=(beat%4)/4
  # Drawn at quarter resolution by render(), then nearest-neighbour expanded.
  for j in range(60):
   x=(j*137+43)%W;y=(j*71+19)%780;rect(c,x,y,4 if j%4 else 8,4 if j%4 else 8,'#2E5E71')
  self.tag(c,info,'#89E8CA');text(c,'MEMORY',88,159,150,'#F8F0B5','mono');text(c,info['title'],94,328,65,'#82EDD0','cn');text(c,'SAVE ONLY WHAT MATTERS',94,429,29,'#AED9D4','mono')
  for x in range(-100,2020,80):
   xx=x-int(u*80)%80;rect(c,xx,828,76,42,'#477B86');rect(c,xx,832,76,8,'#8AD7B7');rect(c,xx,878,76,30,'#274451')
  for j,label in enumerate(['RAM','ARCHIVE','DELETE']):
   xx=830+j*305;rect(c,xx,302,262,310,'#254051');rect(c,xx+12,314,238,286,'#142338');rect(c,xx+23,332,216,48,'#75DCA5' if j==shot%3 else '#42798B');text(c,label,xx+131,343,29,'#0C152C','mono',anchor='ct')
   for k in range(3):
    yy=413+k*56;on=(k+j+shot)%4!=0;rect(c,xx+46,yy,166,30,'#F4C568' if on else '#233C4C')
    for q in range(7):rect(c,xx+52+q*23,yy-8,9,8,'#D5ECAF');rect(c,xx+52+q*23,yy+30,9,8,'#D5ECAF')
  # A hand-designed, coherent sprite with a two-pose gait.
  sprite=['...XXXXXX...','..XXXXXXXX..','..XOOXXOOX..','..XOOXXOOX..','..XXXXXXXX..','...XWWWWX...','....XXXX....','..YYYYYYYY..','.YYYYYYYYYY.','YY.YYYYYY.YY','YY.YYYYYY.YY','...YYYYYY...','...ZZ..ZZ...','...ZZ..ZZ...','..ZZZ..ZZZ..']
  pal={'X':'#EAA75A','O':'#172534','W':'#FCF1C5','Y':'#77D9B0','Z':'#527CC2'};sx=338+shot*74+u*65;sy=575-int(abs(math.sin(beat*math.pi))*10)
  for yy,row in enumerate(sprite):
   for xx,ch in enumerate(row):
    if ch!='.':rect(c,sx+xx*15+(4 if yy>12 and int(beat*2)%2 else 0),sy+yy*15,15,15,pal[ch])
  for j in range(4):rect(c,690+j*65,689+math.sin(beat+j)*13,26,26,'#F6D06A')
  self.caption(c,info,'#CFEADE',t=t)
 def comic(self,c,t,info):
  rect(c,0,0,W,H,'#F0C638');self.tag(c,info);beat=t/B;shot=min(3,int(beat/4));p=math.exp(-(beat%1)*8)
  # All halftone dots are clipped to their own panels.
  panels=[[(55,137),(643,115),(633,888),(63,892)],[(672,117),(1267,143),(1210,889),(650,888)],[(1293,142),(1863,113),(1860,889),(1238,889)]]
  cols=['#4CABC3','#F3EBDD','#DA5552']
  for k,pts in enumerate(panels):
   poly(c,pts,cols[k],stroke='#17222A',lw=10);c.save();c.new_path();c.move_to(*pts[0]);[c.line_to(*p0) for p0 in pts[1:]];c.close_path();c.clip()
   for y in range(145,900,23):
    for x in range(55+k*598,653+k*598,23):circle(c,x,y,2.4,'#152534',alpha=.19)
   c.restore()
  # Three propositions, not three variants of a generic card layout.
  for j,(cx,cy) in enumerate([(342,656),(958,687),(1554,692)]):
   circle(c,cx,cy,125,'#F6D797',stroke='#17222A',lw=10)
   rect(c,cx-99,cy-70,198,89,'#F8EED9',r=25)
   for s in [-1,1]:circle(c,cx+s*41,cy-24,13,'#182634')
   if j==0:line(c,[(cx-43,cy+49),(cx,cy+72),(cx+43,cy+46)],'#1B2630',8)
   elif j==1:circle(c,cx,cy+62,24,stroke='#1B2630',lw=7)
   else:line(c,[(cx-37,cy+66),(cx+37,cy+66)],'#1B2630',8)
  words=[('SURE?',342,234),('PROOF?',961,231),('CHECK!',1568,218)]
  for j,(word,x,y) in enumerate(words):
   c.save();c.translate(x,y);c.rotate((-.075,.06,-.04)[j]);poly(c,[(-220,-48),(198,-67),(228,74),(28,93),(-49,138),(-56,88),(-215,81)],'#FCF5DC',stroke='#16212D',lw=8);text(c,word,0,-29,78,'#182531','italic',anchor='ct');c.restore()
  # A bold correction stamp arrives on the third beat and holds for reading.
  stamp=ease((t-.5)/.25);c.save();c.translate(970,481);c.rotate(-.07);c.scale(1+.035*p,1+.035*p);rect(c,-552,-60,1104,130,'#F5CA3C');line(c,[(-552,-60),(552,-60),(552,70),(-552,70)],'#172331',9,closed=True);text(c,info['title'],0,-37,87,'#172331','cn',anchor='ct',alpha=stamp);c.restore()
  self.caption(c,info,'#101B27','#F5EFDA',t)
 def blueprint(self,c,t,info):
  rect(c,0,0,W,H,'#06324B');beat=t/B;shot=min(3,int(beat/4));u=(beat%4)/4
  for x in range(0,W,24):line(c,[(x,0),(x,H)],'#66C5CE',1,.09 if x%120 else .21)
  for y in range(0,H,24):line(c,[(0,y),(W,y)],'#66C5CE',1,.09 if y%120 else .21)
  self.tag(c,info,'#A8F4DF');text(c,'TEST.',94,155,157,'#B7F4E1','bold');text(c,"DON'T",95,336,123,'#B7F4E1','light');text(c,'GUESS.',94,486,129,'#B7F4E1','bold');text(c,info['title'],99,674,65,'#A8F4DF','cn')
  cx,cy=1339,555;ang=.30+t*.065
  def proj(v):
   x,y,z=v;xx=x*math.cos(ang)-z*math.sin(ang);zz=x*math.sin(ang)+z*math.cos(ang);return (cx+xx*150,cy-y*145+zz*67)
  def wirebox(y,sx,sy,sz,bright=False):
   vs=[(x*sx,y+yy*sy,z*sz) for x in [-1,1] for yy in [-1,1] for z in [-1,1]];pp=[proj(v) for v in vs]
   for j in range(8):
    for k in range(j+1,8):
     if sum(vs[j][d]!=vs[k][d] for d in range(3))==1:line(c,[pp[j],pp[k]],'#C7FFEB' if bright else '#52B7BD',3 if bright else 1.8,.95)
   return pp
  gap=.15+.45*smooth(u)
  for j in range(4):wirebox((j-1.5)*(.9+gap),1.6,.19,1.08,j==shot)
  # Processor pins and exploded assembly guides.
  for s in [-1,1]:
   for j in range(7):line(c,[proj((s*1.6,-1.8,-.9+j*.3)),proj((s*2,-1.8,-.9+j*.3))],'#87DDD4',2)
  for x,z in [(-1.6,-1.08),(1.6,1.08),(-1.6,1.08),(1.6,-1.08)]:line(c,[proj((x,-2.8,z)),proj((x,2.8,z))],'#74D4D1',1.4,.55,dash=[9,8])
  for j,label in enumerate(['INPUT','RULES','TEST','OUTPUT']):
   yy=229+j*159;line(c,[(1650,yy),(1720,yy),(1750,yy-25)],'#82DCD2',2);text(c,label,1761,yy-39,25,'#BFFAEA','mono',maxw=135)
  line(c,[(951,822),(1662,822)],'#A3E9DD',2);line(c,[(950,805),(950,839)],'#A3E9DD',2);line(c,[(1662,805),(1662,839)],'#A3E9DD',2);text(c,'VERIFY THE FINAL STATE',1310,842,23,'#A4DBD6','mono',anchor='ct')
  code='assert output.valid\nassert constraints_met'
  for j,s in enumerate(code.split('\n')):text(c,s[:int(50*clamp(t-.5))],100,787+j*42,27,'#6DD7CA','mono')
  self.caption(c,info,'#BCECDD',t=t)
 def swiss(self,c,t,info):
  rect(c,0,0,W,H,'#EFEDE5');beat=t/B;shot=min(3,int(beat/4));u=(beat%4)/4;p=math.exp(-(beat%1)*10)
  self.tag(c,info,'#181B1C');rect(c,1298,108,540,779,'#E94735')
  # The permissions themselves are the animated objects.
  words=['READ','WRITE','DELETE'];ys=[136,371,607]
  for j,(word,y) in enumerate(zip(words,ys)):
   active=(shot%3)==j;co='#171C20' if active else '#BDBEB5';off=(1-ease((t-j*.08)/.4))*-150
   text(c,word,82+off,y,228,'#E44532' if active and j>0 else co,'black',maxw=1160)
   if not active and j>0:rect(c,95,y+110,1080,12,'#171C20',.65)
  # A large mechanical lock, without ornamental HUD clutter.
  c.save();c.translate(1567,442);c.scale(1+.018*p,1+.018*p)
  c.new_path();c.arc(0,-18,114,math.pi,math.tau);c.line_to(114,70);c.move_to(-114,-18);c.line_to(-114,70);color(c,'#F3F0E7');c.set_line_width(33);c.stroke()
  rect(c,-148,47,296,238,'#F4F0E6',r=8);circle(c,0,137,28,'#E44834');rect(c,-12,140,24,75,'#E44834');c.restore()
  text(c,info['title'],1560,172,67,'#F9F4E8','cn',anchor='ct');text(c,'ONLY WHAT',1565,759,35,'#F7F2E6','bold',anchor='ct');text(c,'IS NEEDED.',1565,806,35,'#F7F2E6','bold',anchor='ct')
  self.caption(c,info,'#1E2528',t=t)
 def paper(self,c,t,info):
  rect(c,0,0,W,H,'#EBDFCC');self.grain(c,.034);self.tag(c,info,'#5B5248');beat=t/B;shot=min(3,int(beat/4));u=(beat%4)/4
  # Layered cut-paper valleys with real separate shadows.
  for j,(yy,co) in enumerate([(738,'#D3C4AA'),(826,'#B4C7B5'),(898,'#819C97')]):
   pts=[(-10,H),(W+10,H),(W+10,yy)]+[(W-k*90,yy-70*math.sin(k*.34+j+t*.015)-j*9) for k in range(23)]+[(-10,yy)]
   poly(c,[(x+8,y+13) for x,y in pts],'#6D6252',alpha=.10);poly(c,pts,co)
  text(c,'HUMAN',93,151,127,'#324C4A','black');text(c,'IN THE LOOP.',96,299,90,'#324C4A','bold');text(c,info['title'],98,461,71,'#324C4A','cn',maxw=930)
  text(c,info['key'],101,565,36,'#5E7167','cnreg')
  # The approval slips have individual folded corners and cast shadows.
  labels=['PAUSE','REVIEW','UNDO'];centers=[(1180,300),(1530,454),(1140,639)]
  for j,(x,y) in enumerate(centers):
   active=shot%3==j;dy=-14*math.sin(t*.8+j);c.save();c.translate(x,y+dy);c.rotate([-.07,.075,-.035][j]);shadow(c,-168,-82,338,165,.17);poly(c,[(-168,-82),(121,-82),(169,-34),(169,83),(-168,83)],'#FCF6E6');poly(c,[(121,-82),(121,-33),(169,-34)],'#DED0B8');text(c,labels[j],0,-30,44,'#D3673D' if active else '#52635C','bold',anchor='ct');c.restore()
  # A cut-paper human, with a clear arm-to-control gesture.
  x,y=1530,700;shadow(c,x-62,y-38,175,206,.1);poly(c,[(x-47,y-49),(x+82,y-38),(x+103,y+194),(x-93,y+194)],'#CB683F');circle(c,x+12,y-115,65,'#DCA87E');poly(c,[(x-50,y-128),(x-36,y-178),(x+40,y-189),(x+80,y-132),(x+16,y-149)],'#344A46')
  # Upper arm and forearm meet at a visible joint instead of passing through the torso.
  handx=x-169-20*math.sin(t*.8);handy=y-56-10*math.cos(t)
  line(c,[(x-44,y-10),(x-105,y+19),(handx,handy)],'#BF5E3A',48);circle(c,handx,handy,25,'#DCA87E')
  line(c,[(x-20,y+192),(x-28,y+233)],'#344E4D',36);line(c,[(x+54,y+191),(x+77,y+231)],'#344E4D',36)
  # Origami decision arrow, moving on a shallow foreground plane.
  px=785+30*math.sin(t);py=768+20*math.sin(t*.7);poly(c,[(px-130,py),(px+138,py-58),(px+26,py+75),(px-5,py+8)],'#F8F0DB');poly(c,[(px-5,py+8),(px+138,py-58),(px+26,py+75)],'#D9C9A8');poly(c,[(px-130,py),(px-5,py+8),(px+138,py-58)],'#FFFAEB')
  self.caption(c,info,'#FAF3E3','#405D58',t)
 def ink(self,c,t,info):
  rect(c,0,0,W,H,'#F1EFE5');self.grain(c,.065);self.tag(c,info,'#4D514D');beat=t/B;shot=min(3,int(beat/4));u=(beat%4)/4
  # Transparent ink washes and a pressure-modulated open enso.
  for j in range(5):
   base=755+j*32;pts=[(0,1080),(1920,1080),(1920,base)]
   for k in range(40,-1,-1):
    x=k*48;y=base-100*(math.sin(k*.18+j*.5)**4)-53*math.sin(k*.37+j);pts.append((x,y))
   pts.append((0,1080));poly(c,pts,'#5B6761',alpha=.045+j*.018)
  cx,cy=756,481;r=235
  for layer in range(6):
   pts=[]
   for k in range(190):
    a=.18+k/189*(math.tau-.55);rad=r+layer*2+3*math.sin(a*17+layer*.7)+math.sin(a*33)*2;pts.append((cx+rad*math.cos(a),cy+rad*.99*math.sin(a)))
   for k in range(len(pts)-1):
    f=k/(len(pts)-1);width=(20+26*math.sin(math.pi*f)**.8)*(1 if layer<2 else .18);line(c,[pts[k],pts[k+1]],'#273530',width,.17 if layer<2 else .06)
  # Sweeping brush filament in the open ring, with enough negative space to read.
  for j in range(30):
   a=j*2.399;rad=18+j*6.9;xx=cx+rad*math.cos(a);yy=cy+rad*math.sin(a);circle(c,xx,yy,1+j%3,'#2B3530',alpha=.16)
  # Vertical calligraphy is deliberately separated into two columns.
  words=info['title'].replace('\uff0c','|').split('|');cols=[1490,1325]
  for col,s in enumerate(words[:2]):
   for k,ch in enumerate(s):text(c,ch,cols[col],230+k*157,132,'#273C35','ink',anchor='ct')
  text(c,info['key'],753,433,67,'#283B33','ink',anchor='ct',maxw=390)
  rect(c,1607,695,79,139,'#A84935',.91);text(c,'?',1646,725,81,'#F4E9D6','serif',anchor='ct')
  text(c,'MAKE ROOM FOR UNCERTAINTY.',141,820,29,'#52615A','mono')
  self.caption(c,info,'#354B42',t=t)
 def overlays3d(self,c,t,info,i):
  shot=min(3,int(t/(4*B)));u=(t%(4*B))/(4*B);alpha=smooth((t-.15)/.25)
  if i==1:
   self.tag(c,info,'#143F45');rect(c,79,136,649,97,'#0F3B48',.90);text(c,info['title'],101,153,66,'#F7EAC3','cn',alpha=alpha);text(c,'PLAN > BUILD > CHECK',89,266,28,'#16444B','mono');self.caption(c,info,'#F9F0D4','#153B46',t)
   for j,s in enumerate(['PLAN','BUILD','CHECK']):rect(c,104+j*188,809,166,47,'#193C42',.93);text(c,s,187+j*188,819,25,'#F8D582','mono',anchor='ct')
  elif i==2:
   self.tag(c,info,'#47394E');text(c,'CONTEXT',90,162,128,'#403447','bold',alpha=alpha,maxw=770);text(c,'MATTERS.',90,309,127,'#403447','bold',alpha=alpha,maxw=770);text(c,info['title'],96,495,72,'#493C4A','cn',alpha=alpha);text(c,info['key'],102,609,33,'#655263','cnreg');self.caption(c,info,'#4F3B4B','#EBDAE4',t)
  elif i==11:
   self.tag(c,info,'#70EADA');text(c,'ACT.',89,163,116,'#BCFFEA','black');text(c,'CHECK.',89,291,105,'#BCFFEA','black');text(c,'ADAPT.',90,412,108,'#BCFFEA','black');text(c,info['title'],93,641,64,'#BFF4E4','cn');self.caption(c,info,'#BFEFDB','#061C2A',t)
   for j,s in enumerate(['PLAN','ACT','CHECK']):text(c,s,1151+j*226,828,26,'#79F4DD','mono',anchor='ct')
  elif i==12:
   self.tag(c,info,'#93A6B4');text(c,'MORE',91,158,171,'#ECF2F3','black',alpha=alpha);text(c,'IS NOT',94,344,118,'#A9BCC6','light',alpha=alpha);text(c,'BETTER.',92,482,136,'#EFF5F6','black',alpha=alpha);text(c,info['title'],97,694,61,'#B5C6CD','cn');self.caption(c,info,'#BCCCD0',t=t)
   for j,s in enumerate(['QUALITY','LATENCY','COST']):line(c,[(1270,792+j*31),(1390,792+j*31)],'#4B717A',2);text(c,s,1410,778+j*31,19,'#738F9D','mono')
  elif i==13:
   self.tag(c,info,'#9DC7D8');text(c,'SYSTEMS',960,154,143,'#A3DCED','light',anchor='ct',outline=1);text(c,info['title'],960,326,64,'#D3F6F3','cn',anchor='ct');self.caption(c,info,'#C6E5E4',t=t)
   for j,s in enumerate(['TASK','TRACE','OUTCOME']):text(c,s,642+j*314,826,27,'#91C6D5','mono',anchor='ct')
  elif i==14:
   self.tag(c,info,'#28404F');text(c,'YOUR',92,165,146,'#243B4B','bold');text(c,'MOVE.',91,330,162,'#243B4B','bold');text(c,info['title'],99,571,70,'#2B4452','cn',maxw=846);text(c,'TOOLS EXPAND POSSIBILITY.',103,704,29,'#435E6B','mono');self.caption(c,info,'#294553','#E3ECEC',t)
 def intro(self,t,outro=False):
  surf,c,a=self.canvas('#090E14');beat=t/B
  # Full-bleed thumbnail wall introduces/recalls the actual fifteen rendered styles.
  if self.thumb:
   for j,s in enumerate(self.thumb):
    x=(j%5)*384;y=(j//5)*360;z=1+.025*math.sin(t*.8+j);placed_surface(c,s,x-(z-1)*192,y-(z-1)*180,384*z,360*z,.45 if not outro else .30)
   rect(c,0,0,W,H,'#050B11',.62 if not outro else .72)
  else:
   for j in range(22):
    cx=960+math.sin(j*.7+t*.15)*240;cy=540;rr=180+j*38;circle(c,cx,cy,rr,stroke='#173745',lw=1.2,alpha=.5)
  rect(c,79,57,12,23,'#FE6A40');text(c,'FIFTEEN WORLDS / ONE PRINCIPLE',109,55,23,'#C5D6D8','mono')
  text(c,'128 BPM',1830,55,23,'#EFD3B4','mono',anchor='rt')
  if not outro:
   if beat<2:
    text(c,'AI',960,185,512,'#F4F0E5','black',anchor='ct');text(c,'BEYOND THE PROMPT',960,758,38,'#FA7449','mono',anchor='ct')
   else:
    kick=1+.04*math.exp(-((beat-2)%1)*10);c.save();c.translate(960,458);c.scale(kick,kick);text(c,'BEYOND',0,-241,216,'#F8F2E7','black',anchor='ct');text(c,'GENERATION',0,-1,188,'#F7F0E5','black',anchor='ct',maxw=1720);c.restore()
    text(c,STORY['title'],960,724,96,'#FF744C','cn',anchor='ct');text(c,STORY['subtitle'],960,893,37,'#CBDCDB','cnreg',anchor='ct')
   for j in range(15):rect(c,487+j*64,1021,49,6,'#F5754B' if j<int(t/3.75*15) else '#33444B')
  else:
   text(c,STORY['ending'],960,284,118,'#F7F0E4','cn',anchor='ct',maxw=1740)
   text(c,'BUILD WITH INTENT.',960,478,104,'#F27951','black',anchor='ct')
   text(c,'15 WORLDS  /  128 BPM  /  ORIGINAL CODE ANIMATION',960,689,27,'#B5CACB','mono',anchor='ct')
   text(c,'SCORE & SOUND DESIGN: ORIGINAL SYNTHESIS',960,777,24,'#829BA4','mono',anchor='ct')
   text(c,'RESEARCH: ANTHROPIC + OPENAI / SOURCES IN PROJECT',960,822,23,'#829BA4','mono',anchor='ct')
   text(c,'BEYOND GENERATION',960,1009,20,'#66818C','mono',anchor='ct')
  surf.flush();return np.frombuffer(surf.get_data(),np.uint8).reshape(self.h,self.w,4).copy()

 def directed_cut(self,arr,i,t):
  beat=t/B;shot=min(3,int(beat/4));u=(beat%4)/4
  if beat>=14:shot=1+int(beat*2)%2
  if shot not in [1,2]:return arr
  settings={0:('#F3F1E9','#243029',1340,490,1.65,2.06),3:('#FFE449','#171C18',1320,475,1.62,1.96),4:('#F4F1E9','#2245C3',1250,535,1.57,2.03),5:('#0C152C','#B8EDD7',1290,467,1.50,1.87),6:('#F0C638','#17222A',965,523,1.19,1.76),7:('#06324B','#B2EBDB',1338,475,1.59,1.94),8:('#EFEDE5','#171C20',1510,472,1.63,2.04),9:('#EBDFCC','#3D574F',1340,470,1.49,1.84),10:('#F1EFE5','#33463D',775,470,1.24,1.48)}
  if i not in settings:return arr
  bg,fg,cx,cy,z1,z2=settings[i];z=(z1 if shot==1 else z2)+u*.045+.015*math.exp(-(beat%1)*10)
  cx=clamp(cx,W/(2*z),W-W/(2*z));cy=clamp(cy,H/(2*z),H-H/(2*z))
  surf,c,a=self.canvas(bg);src,aa=surface_from_bgra(arr)
  c.save();c.translate(W/2-z*cx,H/2-z*cy);c.scale(z*W/self.w,z*H/self.h);c.set_source_surface(src,0,0);c.get_source().set_filter(cairo.FILTER_BILINEAR);c.paint();c.restore()
  # Dedicated header/footer zones preserve the reading area through punch-ins.
  rect(c,0,0,W,111,bg);rect(c,0,789,W,291,bg)
  self.tag(c,STORY['scenes'][i],fg)
  text(c,STORY['scenes'][i]['title'],88,817,65,fg,'cn')
  text(c,STORY['scenes'][i]['key'],1830,837,31,fg,'cnreg',anchor='rt',maxw=850)
  line(c,[(90,909),(1830,909)],fg,1,.25)
  self.caption(c,STORY['scenes'][i],fg,t=t)
  surf.flush();return np.frombuffer(surf.get_data(),np.uint8).reshape(self.h,self.w,4).copy()
 def render(self,i,t):
  global _SILENT
  beat=t/B;shot=min(3,int(beat/4));shot=(1+int(beat*2)%2) if beat>=14 else shot
  _SILENT=i in [0,3,4,5,6,7,8,9,10] and shot in [1,2]
  info=STORY['scenes'][i]; t=max(0,min(SCENE-.001,t))
  if i in [1,2,11,12,13,14]:
   if self.three is None:self.three=ThreeWorlds(self.w,self.h)
   arr=self.three.render(i,t);surf,c,a=self.canvas(arr=arr);self.overlays3d(c,t,info,i)
  elif i==5:
   surf,c,a=self.canvas(w=self.w//4,h=self.h//4);self.pixel(c,t,info);surf.flush();small=np.frombuffer(surf.get_data(),np.uint8).reshape(self.h//4,self.w//4,4).copy();_SILENT=False;return self.directed_cut(np.repeat(np.repeat(small,4,0),4,1),i,t)
  else:
   surf,c,a=self.canvas('#F3F1E9' if i==0 else '#FFFFFF');{0:self.hand,3:self.editorial,4:self.svg,6:self.comic,7:self.blueprint,8:self.swiss,9:self.paper,10:self.ink}[i](c,t,info)
  surf.flush();out=np.frombuffer(surf.get_data(),np.uint8).reshape(self.h,self.w,4).copy();_SILENT=False;return self.directed_cut(out,i,t)

# Hard shape masks replace crossfades: foreground text never ghosts over another world.
def transition(previous,current,p,style):
 h,w=current.shape[:2];s,a=surface_from_bgra(previous.copy());c=cairo.Context(s);c.scale(w/W,h/H);p=clamp(p);mode=style%8
 c.new_path()
 if mode==0:
  r=p*1260;c.arc(960,540,r,0,math.tau)
 elif mode==1:
  x=-900+p*3600;c.move_to(-1,-1);c.line_to(x,-1);c.line_to(x-700,H+1);c.line_to(-1,H+1);c.close_path()
 elif mode==2:
  for j in range(10):
   q=clamp(p*1.3-j*.033);c.rectangle(j*192,0,192,H*q)
 elif mode==3:
  x=p*(W+100)-50;c.move_to(-1,-1);c.line_to(x,-1)
  for j in range(1,29):c.line_to(x+11*math.sin(j*4.8),j*40)
  c.line_to(-1,H+1);c.close_path()
 elif mode==4:
  for y in range(12):
   for x in range(20):
    threshold=((x*37+y*61)%97)/97
    if p>=threshold:c.rectangle(x*96,y*90,97,91)
 elif mode==5:
  for j in range(12):
   yy=j*90;ww=clamp(p*1.4-(j%3)*.15)*W;c.rectangle(0 if j%2==0 else W-ww,yy,ww,91)
 elif mode==6:
  c.move_to(960,540)
  for j in range(100):
   a=j/99*math.tau;r=(1+.06*math.sin(a*11)+.045*math.cos(a*7))*p*1250;c.line_to(960+math.cos(a)*r,540+math.sin(a)*r)
  c.close_path()
 else:
  q=ease(p);c.rectangle(W*(1-q)/2,H*(1-q)/2,W*q,H*q)
 c.clip();cur,aa=surface_from_bgra(current);c.save();c.scale(W/w,H/h);c.set_source_surface(cur,0,0);c.paint();c.restore();s.flush();return np.frombuffer(s.get_data(),np.uint8).reshape(h,w,4).copy()
