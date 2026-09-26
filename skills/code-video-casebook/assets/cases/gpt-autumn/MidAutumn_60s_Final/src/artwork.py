#!/usr/bin/env python3
"""Deterministic, layered Cairo code-film. No video footage or generative images."""
from __future__ import annotations
import os, sys, math, json, time, subprocess, argparse
from pathlib import Path
from functools import lru_cache
import numpy as np
import cairo
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import gaussian_filter

ROOT=Path(__file__).resolve().parents[1]
W,H=1920,1080
FPS=60
DURATION=60
PI=math.pi
TAU=2*PI
rng=np.random.default_rng(9252026)
SERIF=os.environ.get('MOON_SERIF','/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc')
SANS=os.environ.get('MOON_SANS','/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')
BOLD=os.environ.get('MOON_BOLD','/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc')
INK='#283a3d'; CREAM='#f3ead5'; GOLD='#e5bc76'; MUTED='#9cacae'; NIGHT='#08131f'
TEXT={'reunion':'\u56e2\u5706'}
def clamp(x,a=0.,b=1.): return max(a,min(b,x))
def smooth(x): x=clamp(x); return x*x*(3-2*x)
def ease(x): return 1-(1-clamp(x))**3
def lerp(a,b,t): return a+(b-a)*t
def rgb(c):
 if isinstance(c,tuple): return tuple(v/255 if v>1 else v for v in c)
 c=c.lstrip('#'); return tuple(int(c[i:i+2],16)/255 for i in (0,2,4))
def col(ctx,c,a=1): ctx.set_source_rgba(*rgb(c),clamp(a))
def rect(ctx,x,y,w,h,c,a=1): col(ctx,c,a); ctx.rectangle(x,y,w,h); ctx.fill()
def line(ctx,pts,c=CREAM,width=2,a=1,close=False):
 if len(pts)<2:return
 ctx.new_path(); ctx.move_to(*pts[0])
 for p in pts[1:]:ctx.line_to(*p)
 if close:ctx.close_path()
 col(ctx,c,a); ctx.set_line_width(width);ctx.set_line_cap(cairo.LINE_CAP_ROUND);ctx.set_line_join(cairo.LINE_JOIN_ROUND);ctx.stroke()
def poly(ctx,pts,c,a=1):
 ctx.new_path();ctx.move_to(*pts[0])
 for p in pts[1:]:ctx.line_to(*p)
 ctx.close_path();col(ctx,c,a);ctx.fill()
def circle(ctx,x,y,r,c,a=1,stroke=0):
 if r<=0:return
 ctx.new_path();ctx.arc(x,y,r,0,TAU);col(ctx,c,a)
 if stroke:ctx.set_line_width(stroke);ctx.stroke()
 else:ctx.fill()
def ellipse(ctx,x,y,rx,ry,c,a=1,stroke=0):
 ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);circle(ctx,0,0,1,c,a,stroke/max(rx,ry));ctx.restore()
def rr(ctx,x,y,w,h,r,c,a=1,stroke=0):
 ctx.new_path();r=min(r,w/2,h/2)
 for xx,yy,start in [(x+w-r,y+r,-PI/2),(x+w-r,y+h-r,0),(x+r,y+h-r,PI/2),(x+r,y+r,PI)]:
  ctx.arc(xx,yy,r,start,start+PI/2)
 ctx.close_path();col(ctx,c,a)
 if stroke:ctx.set_line_width(stroke);ctx.stroke()
 else:ctx.fill()
def glow(ctx,x,y,r,c=GOLD,a=.25):
 grad=cairo.RadialGradient(x,y,0,x,y,r);cr=rgb(c)
 grad.add_color_stop_rgba(0,*cr,a);grad.add_color_stop_rgba(.28,*cr,a*.45);grad.add_color_stop_rgba(1,*cr,0)
 ctx.set_source(grad);ctx.rectangle(x-r,y-r,2*r,2*r);ctx.fill()
def arc(ctx,x,y,r,start,end,c=GOLD,width=2,a=1):
 ctx.new_path();ctx.arc(x,y,r,start,end);col(ctx,c,a);ctx.set_line_width(width);ctx.set_line_cap(cairo.LINE_CAP_ROUND);ctx.stroke()
def curve(ctx,p,c,width=2,a=1):
 ctx.new_path();ctx.move_to(*p[0]);ctx.curve_to(*(p[1]+p[2]+p[3]));col(ctx,c,a);ctx.set_line_width(width);ctx.set_line_cap(cairo.LINE_CAP_ROUND);ctx.stroke()

def surface_from_pil(im):
 im=im.convert('RGBA');arr=np.array(im,dtype=np.uint8)
 alpha=arr[:,:,3:4].astype(np.uint16)
 arr[:,:,:3]=(arr[:,:,:3].astype(np.uint16)*alpha//255).astype(np.uint8)
 bgra=np.ascontiguousarray(arr[:,:,[2,1,0,3]])
 return cairo.ImageSurface.create_for_data(bgra,cairo.FORMAT_ARGB32,im.width,im.height)

def paint(ctx,s,x=0,y=0,w=None,h=None,a=1):
 if a<=0:return
 ctx.save();ctx.translate(x,y)
 if w is not None:ctx.scale(w/s.get_width(), (h if h is not None else w*s.get_height()/s.get_width())/s.get_height())
 ctx.set_source_surface(s);ctx.paint_with_alpha(clamp(a));ctx.restore()

@lru_cache(maxsize=1024)
def text_surface(txt,size,color=CREAM,font='serif',tracking=0):
 path={'serif':SERIF,'sans':SANS,'bold':BOLD}.get(font,SANS)
 idx=2 if path.endswith('.ttc') else 0
 f=ImageFont.truetype(path,int(size),index=idx)
 width=math.ceil(f.getlength(txt)+max(0,len(txt)-1)*tracking)+12
 im=Image.new('RGBA',(max(width,1),int(size*1.7)+10))
 d=ImageDraw.Draw(im)
 if tracking:
  pos=6
  for ch in txt:d.text((pos,5),ch,font=f,fill=color,anchor='lt');pos+=f.getlength(ch)+tracking
 else:d.text((6,5),txt,font=f,fill=color,anchor='lt')
 box=im.getbbox()
 if box:im=im.crop((0,0,im.width,max(box[3]+6,int(size*1.05))))
 return surface_from_pil(im)

def text(ctx,txt,x,y,size=50,c=CREAM,font='serif',a=1,align='left',tracking=0,scale=1):
 s=text_surface(txt,int(size),c,font,tracking);w=s.get_width()*scale
 if align=='center':x-=w/2
 if align=='right':x-=w
 paint(ctx,s,x,y,w,s.get_height()*scale,a)
 return w

def caption(ctx,lines,u,bright=False,y=836,size=49,x=960,delay=.12,align='center'):
 alpha=smooth((u-delay)/.34)
 c=INK if bright else CREAM
 # Deliberate lower-third typography, not a subtitle box.
 for i,txt in enumerate(lines):
  text(ctx,txt,x,y+i*(size+20)+(1-ease((u-delay)/.6))*15,size,c,a=alpha,align=align)

def eyebrow(ctx,txt,bright=False,x=130,y=136):
 c=INK if bright else GOLD
 line(ctx,[(x,y+13),(x+36,y+13)],c,2,.65)
 text(ctx,txt,x+52,y,21,c,'sans',tracking=1)

def footer(ctx,idx,bright=False):
 c=INK if bright else CREAM
 text(ctx,'MOON / A SHARED NIGHT',130,1001,16,c,'sans',a=.45,tracking=2)
 text(ctx,f'{idx+1:02d} / 20',1790,1001,16,c,'sans',a=.4,align='right',tracking=1)

class Assets:
 def __init__(self):
  self.paper=self.make_paper();self.night=self.make_night();self.moon=self.make_moon();self.grain=self.make_grain()
  self.hills=[self.make_hill(i) for i in range(4)]
  self.stars=np.column_stack((rng.uniform(40,W-40,230),rng.uniform(70,800,230),rng.uniform(.65,1.9,230),rng.uniform(0,TAU,230)))
  self.dust=np.column_stack((rng.uniform(0,W,80),rng.uniform(0,H,80),rng.uniform(.6,2.3,80),rng.uniform(0,TAU,80)))
  self.city=self.make_city();self.cake=self.make_cake();self.branch=self.make_branch()
 def make_paper(self):
  n=rng.normal(0,1,(H,W)).astype(np.float32)
  n=n*1.1+gaussian_filter(n,11)*7
  y,x=np.mgrid[:H,:W];v=-4*((x-W*.48)**2/(W*.8)**2+(y-H*.45)**2/H**2)
  a=np.stack([np.clip(base+n+v,0,255) for base in (239,235,221)],-1).astype(np.uint8)
  return surface_from_pil(Image.fromarray(a))
 def make_night(self):
  y,x=np.mgrid[:H,:W];haze=np.exp(-((y-H*.88)/(H*.38))**2-((x-W*.55)/(W*.8))**2)
  n=rng.normal(0,.65,(H,W));v=((x-W/2)/(W/2))**2+((y-H/2)/H)**2
  a=np.stack([np.clip(b+k*haze+n-4*v,0,255) for b,k in [(8,14),(19,23),(32,26)]],-1).astype(np.uint8)
  return surface_from_pil(Image.fromarray(a))
 def make_grain(self):
  a=rng.integers(0,255,(270,480),dtype=np.uint8)
  im=Image.fromarray(a).convert('RGBA');im.putalpha(Image.new('L',im.size,14));return surface_from_pil(im)
 def make_moon(self):
  n=900;y,x=np.mgrid[:n,:n];xx=(x-n/2)/(n*.492);yy=(y-n/2)/(n*.492);rrr=xx*xx+yy*yy
  mask=rrr<=1
  noise=np.zeros((n,n),np.float32)
  for sigma,amp in [(35,13),(12,7),(3,3),(1,.9)]:
   k=gaussian_filter(rng.normal(0,1,(n,n)).astype(np.float32),sigma)
   noise+=k/(k.std()+1e-5)*amp
  for cx,cy,r,amp in [(-.34,-.2,.27,-28),(.22,-.39,.27,-24),(.08,.03,.3,-25),(-.5,.37,.22,-20),(.38,.35,.2,-12)]:
   noise+=amp*np.exp(-((xx-cx)**2+(yy-cy)**2)/(r*r))
  for i in range(65):
   cx,cy=rng.uniform(-.9,.9,2);r=rng.uniform(.008,.065);d=np.sqrt((xx-cx)**2+(yy-cy)**2)
   noise+=8*np.exp(-((d-r)/(r*.18))**2)-9*np.exp(-(d/(r*.85))**4)
  shade=np.sqrt(np.clip(1-rrr,0,1));lum=np.clip(211+noise+shade*21-xx*12-yy*8,70,251)
  a=np.zeros((n,n,4),np.uint8)
  for k,f in enumerate([1,.93,.78]):a[:,:,k]=(lum*f).astype(np.uint8)
  a[:,:,3]=(np.clip((1-np.sqrt(rrr))*n*.5,0,1)*255).astype(np.uint8)
  return surface_from_pil(Image.fromarray(a))
 def make_hill(self,j):
  ww,hh=2400,850;im=Image.new('RGBA',(ww,hh));d=ImageDraw.Draw(im)
  rs=np.random.default_rng(725+j);xx=np.arange(ww);wave=np.zeros(ww)
  for freq,amp in [(420,80),(130,37),(45,11)]:
   q=gaussian_filter(rs.normal(size=ww),freq/4);wave+=q/q.std()*amp
  wave+=100*np.sin(xx/ww*PI*2+j)
  raw=220+wave+j*50
  yy=100+(raw-raw.min())/(raw.max()-raw.min())*405
  color=[(90,125,122,60),(73,107,103,82),(39,82,77,120),(30,60,56,210)][j]
  pts=list(zip(xx.tolist(),yy.tolist()))+[(ww,hh),(0,hh)];d.polygon(pts,fill=color)
  # Subtle ink fibres stay fixed between frames.
  arr=np.array(im);grain=gaussian_filter(rs.random((hh,ww)).astype(np.float32),2)
  depth=np.clip(np.arange(hh)[:,None]-yy[None,:],0,None)
  decay=np.exp(-depth/183)
  opacity=gaussian_filter(arr[:,:,3].astype(np.float32),1.0)
  arr[:,:,3]=(opacity*(.58+.65*grain)*decay).clip(0,255).astype(np.uint8)
  return surface_from_pil(Image.fromarray(arr))
 def make_city(self):
  s=cairo.ImageSurface(cairo.FORMAT_ARGB32,2400,900);c=cairo.Context(s);rs=np.random.default_rng(48)
  for layer in range(3):
   n=28 if layer==0 else 21
   for i in range(n):
    x=i*2400/n+rs.uniform(-20,20);ww=rs.uniform(48,115);hh=rs.uniform(130,420)*(1+layer*.15);y=820-hh+layer*28;dd=14+layer*7
    front=['#263b4c','#192d3d','#101e2a'][layer];side=['#334853','#243943','#172b34'][layer]
    poly(c,[(x,y),(x+ww,y),(x+ww,y+hh),(x,y+hh)],front)
    poly(c,[(x+ww,y),(x+ww+dd,y-dd),(x+ww+dd,y+hh-dd),(x+ww,y+hh)],side)
    poly(c,[(x,y),(x+dd,y-dd),(x+ww+dd,y-dd),(x+ww,y)],'#3a4850',.6)
    for iy in range(int(hh/23)-1):
     for ix in range(int(ww/17)-1):
      if rs.random()<.40:
       rect(c,x+10+ix*17,y+12+iy*23,5,8,'#e8bd79',rs.uniform(.18,.82))
    if i%7==0:line(c,[(x+ww/2,y),(x+ww/2,y-44)],'#617177',1,.7)
  return s
 def make_cake(self):
  s=cairo.ImageSurface(cairo.FORMAT_ARGB32,600,600);c=cairo.Context(s)
  for i in range(24):
   a=i*TAU/24;circle(c,300+218*math.cos(a),300+218*math.sin(a),39,'#a56f36')
  circle(c,300,300,230,'#c9924f');circle(c,300,292,216,'#d9ac68');circle(c,300,292,199,'#b47b3a',1,5)
  circle(c,300,292,182,'#ead097',.6,3)
  for i in range(16):
   a=i*TAU/16
   c.save();c.translate(300,292);c.rotate(a)
   c.new_path();c.move_to(88,0);c.curve_to(146,-38,188,-25,169,0);c.curve_to(188,25,146,38,88,0);col(c,'#a97132',.85);c.set_line_width(4);c.stroke();c.restore()
  circle(c,300,292,88,'#ae7131',1,5);circle(c,300,292,77,'#edcc89',.7,3)
  text(c,TEXT['reunion'],300,256,56,'#925c29','bold',align='center')
  return s
 def make_branch(self):
  s=cairo.ImageSurface(cairo.FORMAT_ARGB32,750,900);c=cairo.Context(s);rs=np.random.default_rng(5)
  def branch(x,y,l,a,depth):
   ex=x+l*math.cos(a);ey=y+l*math.sin(a)
   curve(c,[(x,y),(lerp(x,ex,.45)-10,y-10),(lerp(x,ex,.75),lerp(y,ey,.75)),(ex,ey)],'#796548',max(1,depth*1.5),.85)
   if depth:
    for k in range(2):branch(ex,ey,l*.66,a+(-.58 if k==0 else .54)+rs.uniform(-.12,.12),depth-1)
   else:
    for i in range(5):
     xx=ex+rs.uniform(-20,20);yy=ey+rs.uniform(-20,20)
     for a2 in range(4):circle(c,xx+4*math.cos(a2*PI/2),yy+4*math.sin(a2*PI/2),3.5,'#e2bd70',.7)
    c.save();c.translate(ex,ey);c.rotate(a);ellipse(c,-12,-14,22,6,'#7c8c68',.72);c.restore()
  branch(750,40,215,PI*.84,5)
  return s
A=None

def background(ctx,bright=False): paint(ctx,A.paper if bright else A.night)
def stars(ctx,t,a=1):
 for x,y,r,ph in A.stars:circle(ctx,x,y,r,CREAM,a*(.22+.25*(.5+.5*math.sin(t*.6+ph))))
def dust(ctx,t,a=.4,color=GOLD):
 for x,y,r,ph in A.dust:
  xx=(x+math.sin(t*.18+ph)*30+t*2)%W;yy=(y-t*(3+r))%H
  circle(ctx,xx,yy,r,color,a*(.3+.5*(math.sin(ph+t*.24)*.5+.5)))
def moon(ctx,x,y,r,a=1,halo=True):
 if halo:glow(ctx,x,y,r*2.7,GOLD,.17*a)
 paint(ctx,A.moon,x-r,y-r,2*r,2*r,a)
def ruled(ctx,c=INK,a=.11):
 for y in range(200,950,54):line(ctx,[(80,y),(1840,y)],c,1,a)
def pencil(ctx,pts,width=2,a=1,c=INK,close=False):
 line(ctx,pts,c,width,a,close)
 pts2=[(x+math.sin(i*2.2+x*.01)*2.2,y+math.cos(i*1.4+y*.01)*1.7) for i,(x,y) in enumerate(pts)]
 line(ctx,pts2,c,max(.7,width*.48),a*.3,close)
def tree(ctx,x,y,s=1,ink=False):
 ctx.save();ctx.translate(x,y);ctx.scale(s,s)
 c='#263e39' if ink else '#52665a'
 curve(ctx,[(0,0),(25,-95),(-20,-240),(40,-340)],c,15,.8)
 for k in range(9):
  yy=-90-k*25;xx=math.sin(k*1.7)*25;sgn=(-1)**k
  curve(ctx,[(xx,yy),(xx+sgn*45,yy-15),(sgn*70,yy-55),(sgn*(95+k*3),yy-70)],c,max(1,5-k*.3),.7)
  for j in range(6):
   cx=sgn*(60+j*13)+xx*.2;cy=yy-50+math.sin(j*2+k)*24
   ellipse(ctx,cx,cy,34,16,c,.20 if ink else .12)
 ctx.restore()
def roof(ctx,x,y,w,h,c,fill=True,a=1):
 ctx.new_path();ctx.move_to(x,y);ctx.curve_to(x+w*.22,y+h*.24,x+w*.4,y-h*.7,x+w*.5,y-h)
 ctx.curve_to(x+w*.6,y-h*.7,x+w*.78,y+h*.24,x+w,y)
 ctx.curve_to(x+w*.83,y+h*.37,x+w*.65,y+h*.33,x+w*.5,y+h*.28)
 ctx.curve_to(x+w*.35,y+h*.33,x+w*.17,y+h*.37,x,y);ctx.close_path();col(ctx,c,a)
 if fill:ctx.fill()
 else:ctx.set_line_width(2);ctx.stroke()
 for k in range(1,13):
  xx=x+w*k/13;line(ctx,[(xx,y+6),(lerp(xx,x+w/2,.11),y-10-h*(1-abs(k/6.5-1))*.7)],c,1,a*.42)
def pavilion(ctx,x,y,s=1,c=INK,filled=False):
 ctx.save();ctx.translate(x,y);ctx.scale(s,s)
 roof(ctx,-185,-200,370,80,c,filled)
 for xx in [-130,130]:
  if filled:rect(ctx,xx-6,-183,12,177,c,.88)
  else:pencil(ctx,[(xx-6,-183),(xx+6,-183),(xx+6,-8),(xx-6,-8)],1.7,.8,c,True)
 line(ctx,[(-155,0),(155,0)],c,5,.8)
 line(ctx,[(-150,-55),(150,-55)],c,2,.75)
 for xx in range(-145,150,30):line(ctx,[(xx,-53),(xx,-6)],c,1.5,.7)
 for k in range(3):line(ctx,[(-165-k*14,k*9),(165+k*14,k*9)],c,2,.65)
 ctx.restore()
def lantern(ctx,x,y,s=1,t=0,a=1):
 ctx.save();ctx.translate(x,y);ctx.rotate(math.sin(t*1.7+x)*.045);ctx.scale(s,s)
 line(ctx,[(0,-35),(0,-5)],GOLD,1,.7*a);glow(ctx,0,20,85,'#ebb876',.18*a)
 ellipse(ctx,0,20,26,35,'#d89a5b',.82*a)
 for xx in [-13,0,13]:ellipse(ctx,xx*.35,20,22-abs(xx)*.5,34,'#ffe4ad',.23*a,1)
 line(ctx,[(-15,-14),(15,-14)],'#6b4b31',4,a);line(ctx,[(-15,54),(15,54)],'#6b4b31',4,a)
 line(ctx,[(0,54),(0,77)],GOLD,2,.8*a);ctx.restore()
def person(ctx,x,y,s=1,c='#273c3c',pose='stand',t=0):
 ctx.save();ctx.translate(x,y);ctx.scale(s,s)
 bob=math.sin(t*2)*1.3
 ellipse(ctx,0,-115+bob,16,19,c)
 ctx.new_path();ctx.move_to(-13,-92+bob);ctx.curve_to(-29,-79,-31,-43,-25,-24);ctx.curve_to(-10,-18,10,-19,25,-24);ctx.curve_to(30,-45,22,-88,10,-92+bob);ctx.close_path();col(ctx,c);ctx.fill()
 if pose=='sit':
  curve(ctx,[(-15,-26),(-10,-6),(18,-8),(28,0)],c,12)
  line(ctx,[(26,0),(26,41)],c,11)
  curve(ctx,[(18,-72),(43,-55),(43,-52),(63,-61)],c,9)
 elif pose=='walk':
  a=math.sin(t*5)*18
  line(ctx,[(-12,-24),(-10+a,17),(-19+a,53)],c,11)
  line(ctx,[(12,-24),(10-a,17),(22-a,53)],c,11)
  line(ctx,[(-20,-80),(-37-a*.4,-40)],c,8)
  line(ctx,[(20,-80),(37+a*.4,-40)],c,8)
 elif pose=='phone':
  line(ctx,[(-10,-24),(-12,42)],c,12);line(ctx,[(12,-24),(14,42)],c,12)
  curve(ctx,[(20,-80),(34,-62),(36,-54),(47,-78)],c,8)
  rr(ctx,39,-96,17,29,3,GOLD,.8)
 else:
  line(ctx,[(-10,-24),(-12,42)],c,12);line(ctx,[(12,-24),(14,42)],c,12)
  line(ctx,[(-19,-80),(-32,-37)],c,8);line(ctx,[(19,-80),(34,-44)],c,8)
 ctx.restore()
def small_cake(ctx,x,y,r=34):paint(ctx,A.cake,x-r,y-r,r*2,r*2)
def table(ctx,x,y,s=1,bright=False):
 ctx.save();ctx.translate(x,y);ctx.scale(s,s)
 c='#997546' if bright else '#8d6641'
 line(ctx,[(-132,5),(-144,162)],c,13);line(ctx,[(132,5),(146,162)],c,13)
 ellipse(ctx,0,5,208,57,'#533e2e',.5);ellipse(ctx,0,-4,210,56,c)
 ellipse(ctx,0,-12,199,48,'#b18b57' if bright else '#ba9660')
 ellipse(ctx,8,-19,73,23,'#e5d6b6');small_cake(ctx,-10,-23,24);small_cake(ctx,34,-23,20)
 for xx in [-123,122]:
  ellipse(ctx,xx,-18,18,8,'#e9dfc6');rect(ctx,xx-15,-19,30,22,'#d6ccb6');ellipse(ctx,xx,2,15,6,'#c8bda5')
 ctx.restore()
def window(ctx,x,y,w,h,lit=True):
 rr(ctx,x,y,w,h,w*.48,'#b99968' if lit else '#263642',.78)
 rr(ctx,x+13,y+13,w-26,h-26,w*.43,'#20323c',1)
 if lit:
  g=cairo.LinearGradient(0,y,0,y+h);g.add_color_stop_rgb(0,.06,.15,.20);g.add_color_stop_rgb(1,.40,.33,.22)
  ctx.save();rr(ctx,x+13,y+13,w-26,h-26,w*.43,'#20323c');ctx.restore()
 line(ctx,[(x+w/2,y+16),(x+w/2,y+h)],'#7e6d52',6,.9)
 line(ctx,[(x+15,y+h*.55),(x+w-15,y+h*.55)],'#7e6d52',6,.9)


def town(ctx,t,xoff=0,ybase=741,scale=1,ink=True):
 ctx.save();ctx.translate(xoff,ybase);ctx.scale(scale,scale)
 c='#28534f' if ink else GOLD
 for i in range(9):
  x=135+i*170;h=70+(i%3)*17
  rect(ctx,x,-h,132,h,c,.75)
  roof(ctx,x-15,-h-5,163,47,c,True,.85)
  for k in range(3):
   rect(ctx,x+19+k*31,-h+21,13,24,'#eedeb1',.57)
   line(ctx,[(x+25+k*31,-h+21),(x+25+k*31,-h+45)],c,1,.75)
  if i%2==0:lantern(ctx,x+134,-h+20,.33,t,.7)
  if i%3==1:
   rect(ctx,x+21,-h-52,88,46,c,.82)
   roof(ctx,x+5,-h-55,119,34,c,True,.9)
   for k in range(3):rect(ctx,x+32+k*24,-h-37,11,17,'#eedeb1',.57)
   line(ctx,[(x+8,-h+2),(x+122,-h+2)],c,4,.8)
 # Arched stone bridge and river boat.
 ctx.new_path();ctx.move_to(657,23);ctx.curve_to(730,-82,842,-82,922,23);ctx.line_to(883,23);ctx.curve_to(824,-40,749,-40,696,23);ctx.close_path();col(ctx,c,.86);ctx.fill()
 for xx in range(682,900,26):
  yy=-math.sin((xx-658)/265*PI)*66+10;line(ctx,[(xx,yy),(xx,yy-20)],c,2,.65)
 curve(ctx,[(676,-4),(730,-90),(849,-90),(905,-4)],c,2,.8)
 ctx.restore()


def history_tile(ctx,k,x,y,w,h,t):
 ctx.save();rr(ctx,x,y,w,h,8,CREAM if k<2 else '#16303b');ctx.rectangle(x+3,y+3,w-6,h-6);ctx.clip()
 ctx.translate(x,y);ctx.scale(w/480,h/300)
 if k==0:
  circle(ctx,355,92,45,INK,.55,2)
  for j in range(12):line(ctx,[(25+j*13,275),(27+j*13,195+math.sin(j)*25)],INK,1,.6)
  pavilion(ctx,210,256,.45,INK,False)
 elif k==1:
  for j in range(3):paint(ctx,A.hills[j],-160,-20+j*27,720,400,.6)
  circle(ctx,353,85,43,'#d9c799',.6);pavilion(ctx,195,244,.42,INK,True)
 elif k==2:
  circle(ctx,350,84,42,GOLD,.8,1);pavilion(ctx,195,247,.5,GOLD,False)
 else:
  paint(ctx,A.city,-70,0,670,315,.8);circle(ctx,350,82,40,GOLD,.9)
 ctx.restore()

