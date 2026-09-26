#!/usr/bin/env python3
"""60-second, deterministic 2D/2.5D code film; all artwork is procedural.
Run --stills for the shot sheet or --render for the final 60 fps picture.
"""
from __future__ import annotations
import os, math, json, sys, time, argparse, subprocess
from pathlib import Path
from functools import lru_cache
import numpy as np
import cairo
from PIL import Image, ImageDraw, ImageFont
import artwork as V
from artwork import (W,H,PI,TAU,INK,CREAM,GOLD,NIGHT,clamp,smooth,ease,lerp,
                     rect,line,poly,circle,ellipse,rr,glow,arc,curve,paint,text,
                     text_surface,col,pencil,roof,pavilion,lantern,person,table,
                     window,small_cake,tree,moon,background,stars,dust,town)
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'timeline.json').read_text())
SC=DATA['scenes']; TX=DATA['words']; WISHES=DATA['wishes']
FPS=60; DURATION=60; A=None
BRIGHT={3,4,5,7,8}
INK2='#42605a'; TEAL='#8cc4c5'; ROSE='#cc8c6b'

def init():
 global A
 if A is None:
  ts=time.time(); A=V.Assets(); V.A=A
  print('Artwork initialized %.2fs'%(time.time()-ts),file=sys.stderr,flush=True)

def tag(c,label,bright=False):
 co=INK if bright else GOLD
 line(c,[(112,97),(158,97)],co,2,.78)
 text(c,label,174,77,25,co,'sans',tracking=1,a=.90)

def reveal(c,s,x,y,size=70,color=CREAM,font='bold',u=1,delay=0,align='left'):
 # 8-14-frame entrances rather than long empty fades.
 q=clamp((u-delay+.06)/.24); dy=(1-ease(q))*27
 alpha=.30+.70*smooth(q)
 return text(c,s,x,y+dy,size,color,font,a=alpha,align=align)

def caption(c,s,u,bright=False,y=895,size=58):
 if not bright:
  g=cairo.LinearGradient(0,y-74,0,H)
  g.add_color_stop_rgba(0,.02,.055,.075,0)
  g.add_color_stop_rgba(.53,.02,.055,.075,.70)
  g.add_color_stop_rgba(1,.02,.055,.075,.88)
  c.set_source(g);c.rectangle(0,y-74,W,H-y+74);c.fill()
 reveal(c,s,W/2,y,size,INK if bright else CREAM,'serif',u,align='center')

def flakes(c,t,amount=45,bright=False):
 co=INK if bright else GOLD
 for i in range(amount):
  x=(i*173.73+t*(24+(i%5)*7))%(W+120)-60
  y=(i*101.91-t*(13+i%13))%(H+60)-30
  a=.12+.18*(.5+.5*math.sin(i+t*1.5))
  if i%6==0:
   c.save();c.translate(x,y);c.rotate(t*.6+i)
   ellipse(c,0,0,5.5,2,co,a);c.restore()
  else:circle(c,x,y,1.2+i%3*.5,co,a)

def rim(c,t,bright=False):
 co=INK if bright else GOLD
 line(c,[(80,106),(80,52),(139,52)],co,1,.32)
 line(c,[(1780,1025),(1840,1025),(1840,970)],co,1,.32)
 line(c,[(113,1030),(1762,1030)],co,1,.12)
 line(c,[(113,1030),(113+1649*clamp(t/60),1030)],co,2,.65)
 text(c,TX['footer'],114,985,18,co,'sans',a=.6,tracking=1)
 text(c,'A SHARED MOON  /  60',1787,985,16,co,'sans',align='right',a=.53,tracking=1)

def cam(c,cx,cy,zoom,dx=0,dy=0):
 c.translate(cx+dx,cy+dy);c.scale(zoom,zoom);c.translate(-cx,-cy)

def steam(c,x,y,t,s=1):
 for j in range(3):
  q=(t*.48+j/3)%1;xx=x+(j-1)*14*s;yy=y-q*100*s
  curve(c,[(xx,yy),(xx-25*s,yy-30*s),(xx+24*s,yy-60*s),(xx+3*s,yy-94*s)],CREAM,2*s,.18*math.sin(q*PI))

def room(c,t,u,final=False):
 background(c);stars(c,t,.85)
 c.save();cam(c,1030,500,1.04+.20*(1-ease(u/(2.1 if not final else 4.5))),-u*3,0)
 moon(c,1435+math.sin(t*.35)*9,309,215,1)
 paint(c,A.city,-185-u*11,207,2290,915,.68)
 for k in range(16):
  yy=678+k*17;xx=(k*173+t*63)%2000
  line(c,[(xx,yy),(xx+34,yy-2)],GOLD,1.5,.13)
 rect(c,0,0,140,H,'#151e22',.96)
 rect(c,1735,0,185,H,'#131e25',.93)
 rect(c,135,0,27,998,'#9e7b4b',.95)
 rect(c,1736,0,22,999,'#886b46',.9)
 rect(c,153,703,1600,18,'#ad8a56',.8)
 rect(c,156,969,1604,27,'#977040',.95)
 for x in [660,1155]:rect(c,x,0,9,708,'#a7b9b3',.34)
 glow(c,460,890,730,'#efba72',.26)
 poly(c,[(0,882),(690,752),(1210,1080),(0,1080)],'#805b39')
 line(c,[(0,882),(690,752),(1210,1080)],'#d4a970',3,.7)
 ellipse(c,340,904,194,48,'#282c28',.4)
 ellipse(c,333,881,190,52,'#e1d2b5')
 c.save();c.translate(333,852);c.rotate(-.04+math.sin(u*.4)*.015)
 paint(c,A.cake,-154,-154,308,308);c.restore()
 ellipse(c,677,907,72,19,'#293227',.45)
 rr(c,628,799,99,95,17,'#d5cfb5');ellipse(c,678,800,49,14,'#f3e7cd')
 ellipse(c,678,800,39,9,'#7c5d3c');ellipse(c,737,841,26,29,'#d5cfb5',1,10)
 steam(c,680,779,t,1.4)
 c.save();c.translate(1780,100);c.rotate(math.sin(t*.7)*.013);paint(c,A.branch,-417,-136,674,840,.82);c.restore()
 flakes(c,t,34)
 c.restore()

def intro(c,t,u):
 room(c,t,u)
 tag(c,SC[0]['sub'])
 reveal(c,SC[0]['top'][:3],224,350,77,u=u)
 reveal(c,SC[0]['top'][3:],210,467,108,u=u,delay=.08)
 text(c,'THE MOON RETURNS. SO DO OUR THOUGHTS.',225,635,20,GOLD,'sans',tracking=1.1,a=.8)

def busy(c,t,u):
 background(c);stars(c,t,.4)
 moon(c,1540,269,185,.78)
 paint(c,A.city,-250-(u*104)%520,170,2610,990,.84)
 paint(c,A.city,-130+(u*66)%300,438,2130,790,.20)
 for i in range(65):
  yy=235+i*11;xx=(i*137-u*(380+i*31))%2650-370
  line(c,[(xx,yy),(xx+78+i*3,yy-10)],GOLD,1.4+i%3,.10+(i%6)*.035)
 for i in range(5):
  x=95+i*360-u*(12+i*4);y=189+55*math.sin(i*1.3+u*1.6)
  c.save();c.translate(x,y);c.transform(cairo.Matrix(1,.038*(-1)**i,-.12,1,0,0))
  rr(c,0,0,310,162,16,'#263e4e',.93);rr(c,0,0,310,162,16,TEAL,.48,1.5)
  labels=['08:30','10:45','14:00','18:20','23:59']
  text(c,labels[i],22,18,49,CREAM,'sans')
  for j in range(3):rect(c,23,99+j*13,245-j*48,3,TEAL,.3)
  circle(c,279,28,5,GOLD,.9);c.restore()
 cx,cy=960,583;r=211
 glow(c,cx,cy,380,TEAL,.15)
 for j in range(60):
  a=j*TAU/60;rrr=r+(j%5==0)*12
  line(c,[(cx+math.cos(a)*r,cy+math.sin(a)*r),(cx+math.cos(a)*(rrr+5),cy+math.sin(a)*(rrr+5))],CREAM,2,.55)
 arc(c,cx,cy,r-15,-PI/2,-PI/2+TAU*((u*.74)%1),GOLD,6,.92)
 for length,speed in [(170,5.8),(107,2.1)]:
  aa=u*speed
  line(c,[(cx,cy),(cx+math.sin(aa)*length,cy-math.cos(aa)*length)],GOLD,5,.9)
 circle(c,cx,cy,9,CREAM)
 caption(c,SC[1]['top'] if u<1.65 else SC[1]['sub'],u if u<1.65 else u-1.65,size=65)
 tag(c,'NOW / 24 HOURS, ALWAYS RUNNING')

def question(c,t,u):
 background(c);paint(c,A.city,-125,496,2100,670,.18)
 moon(c,1405,498,296,.59)
 for k in range(3):
  r=296+(u*95+k*56)%190
  circle(c,1405,498,r,GOLD,max(0,.32-(r-296)/700),1.3)
 reveal(c,SC[2]['top'],161,297,97,u=u)
 reveal(c,SC[2]['sub'],148,449,159,u=u,delay=.08)
 line(c,[(174,708),(727,708)],GOLD,2,.8)
 text(c,'DO YOU REMEMBER?',173,746,24,GOLD,'sans',tracking=3,a=.84)
 tag(c,TX['pause'])
 flakes(c,t,28)

def courtyard_art(c,t,u):
 c.save();cam(c,930,495,1.16,-u*12,-20)
 pencil(c,[(251,770),(251,245),(1110,245),(1110,775)],2.8,.7)
 roof(c,160,253,1048,185,INK,False,.83)
 for k in range(4):
  x=312+k*82;pencil(c,[(x,340),(x,706)],1.2,.36)
 for k in range(6):pencil(c,[(312,354+k*65),(597,354+k*65)],1.2,.36)
 window(c,719,336,282,318,False)
 circle(c,861,431,83,'#d8bb80',.63)
 table(c,798,714,1.22,True)
 person(c,546,713,1.0,'#52695e','sit',u*2.5)
 c.save();c.translate(1034,713);c.scale(-1,1);person(c,0,0,1.0,'#8c7b64','sit',u*2.5+.4);c.restore()
 person(c,795,834,.68,'#b49972','stand',u*3)
 q=(u*.56)%1;xx=lerp(639,927,q);yy=675-56*math.sin(q*PI)
 small_cake(c,xx,yy,28)
 curve(c,[(634,707),(686,667),(708,668),(738+q*60,668)],'#52695e',7,.6)
 tree(c,1375,817,1.40,True)
 for k in range(9):pencil(c,[(70,845+k*4),(1770,845+k*4)],.8,.16)
 lantern(c,1103,297,.94,u*2,.86)
 paint(c,A.branch,1240,20,690,818,.88)
 c.restore()

def memory(c,t,u):
 background(c,True);courtyard_art(c,t,u)
 tag(c,TX['remember']+' / A MOONCAKE TO SHARE',True)
 s=SC[3]['top']+SC[3]['sub']
 caption(c,s,u,True,899,58)
 flakes(c,t,20,True)

def cake_sectors(c,x,y,r,spread,rotation=0,alpha=1):
 for k in range(4):
  a=k*PI/2+rotation;mid=a+PI/4
  c.save();c.translate(x+math.cos(mid)*spread,y+math.sin(mid)*spread);c.rotate(rotation)
  c.new_path();c.move_to(0,0);c.arc(0,0,r*1.05,k*PI/2,(k+1)*PI/2);c.close_path();c.clip()
  paint(c,A.cake,-r,-r,r*2,r*2,alpha);c.restore()

def rewind(c,t,u):
 background(c,True)
 cx,cy=1300,465;r=260+u*42
 c.save();c.translate(cx,cy);c.rotate(-u*2.2);paint(c,A.cake,-r,-r,r*2,r*2);c.restore()
 for j in range(4):
  rr0=315+j*31;rot=-u*(1.8+j*.23)
  arc(c,cx,cy,rr0,rot+j,rot+j+4.55,INK,1.4,.35)
  for k in range(16):
   aa=k*TAU/16+rot
   line(c,[(cx+math.cos(aa)*rr0,cy+math.sin(aa)*rr0),(cx+math.cos(aa)*(rr0+9),cy+math.sin(aa)*(rr0+9))],INK,1.2,.35)
 labels=[TX['today'],TX['ming'],TX['song'],TX['tang'],TX['ancient']]
 for k,ss in enumerate(labels):
  aa=-.7+k*TAU/5-u*1.6
  xx=cx+math.cos(aa)*426;yy=cy+math.sin(aa)*426
  text(c,ss,xx,yy,28,INK,'sans',align='center',a=.82)
 reveal(c,SC[4]['top'],138,357,75,INK,u=u)
 reveal(c,SC[4]['sub'],144,486,48,INK,'serif',u=u,delay=.06)
 tag(c,'REWIND / '+TX['thousand'],True)
 line(c,[(145,650),(775,650)],INK,2,.25)
 for k in range(15):circle(c,150+k*43,650,3+(k==int(u*9)%15)*4,INK,.65)

def ancient(c,t,u):
 background(c,True)
 c.save();cam(c,1050,525,1.08,-u*14,0)
 circle(c,1450,355,206,'#d9c596',.47)
 arc(c,1450,355,212,-PI/2,-PI/2+TAU*min(1,.25+u*1.8),INK,2,.72)
 for j in range(6):
  yy=600+j*37
  pencil(c,[(x,yy+math.sin(x/230+j+u*.6)*19) for x in range(0,1980,27)],1,.18)
 for i in range(48):
  x=30+i*17.5;y=805;hh=98+68*(.5+.5*math.sin(i*2.3));sw=math.sin(t*2+i*.35)*13
  curve(c,[(x,y),(x-9,y-hh*.4),(x+sw,y-hh*.8),(x+sw+9,y-hh)],INK,1.6,.63)
  for k in range(6):
   yy=y-hh+k*10
   pencil(c,[(x+sw+8,yy),(x+sw-10,yy-14)],1.2,.55)
   pencil(c,[(x+sw+8,yy),(x+sw+25,yy-16)],1.2,.55)
 pencil(c,[(1010,661),(1475,661),(1500,685),(986,685),(1010,661)],2.5,.83)
 for x in [1025,1434]:pencil(c,[(x,685),(x-8,810)],3,.75)
 for xx in [1120,1380]:
  ellipse(c,xx,643,60,15,INK,.6,2)
  for j in range(3):circle(c,xx-29+j*28,630-(j%2)*12,17,INK,.7,1.5)
 pencil(c,[(1250,640),(1250,541)],1.6,.8)
 curve(c,[(1250,543),(1230+math.sin(t*3)*10,513),(1280,489),(1254,464)],INK,1.3,.45)
 person(c,906,755,1.15,'#6c7b69','stand',u*2)
 c.restore()
 tag(c,SC[5]['sub'],True)
 reveal(c,SC[5]['sub'],148,200,94,INK,u=u)
 text(c,'AUTUMN OFFERINGS / THE ROOTS OF A FESTIVAL',157,337,19,INK,'sans',a=.55,tracking=1)
 for k in range(6):
  x=183+k*85;y=453
  circle(c,x,y,24,INK,.12)
  arc(c,x,y,26,-PI/2,-PI/2+TAU*clamp((u+.10-k*.13)/.30),INK,1.5,.48)
  circle(c,x,y,3,INK,.16)
  if k<5:line(c,[(x+31,y),(x+53,y)],INK,1,.23)
 circle(c,183+clamp(u/2.3)*425,453,5,'#ad8950',.85)
 caption(c,SC[5]['top'],u,True,900,60)
 flakes(c,t,20,True)

def tang(c,t,u):
 background(c);stars(c,t,.9)
 c.save();cam(c,1030,500,1.06,-u*14,0)
 moon(c,1470,337,232)
 # Stable full silhouette underneath a fast metallic tracing pass.
 c.save();c.push_group();pavilion(c,627,731,1.95,GOLD,False);pp=c.pop_group();c.set_source(pp);c.paint_with_alpha(.28);c.restore()
 c.save();c.rectangle(100,120,1100*ease((u+.06)/.90),780);c.clip();pavilion(c,627,731,1.95,GOLD,False);c.restore()
 for k in range(22):
  xx=170+k*44;line(c,[(xx,766),(xx,834)],GOLD,1.5,.44)
 line(c,[(147,764),(1170,764)],GOLD,3,.7)
 line(c,[(147,835),(1170,835)],GOLD,3,.7)
 person(c,737,733,.88,'#e1cc99','stand',u*2)
 lantern(c,371,406,1.12,u*2);lantern(c,885,406,1.12,u*2+.6)
 tree(c,1780,841,1.3)
 for k in range(12):
  x=55+k*159+math.sin(k+u)*20;y=110+(k*113)%628-u*43
  lantern(c,x,y,.16+(k%3)*.06,u,.42)
 for k in range(8):
  y=791+k*15
  curve(c,[(1070,y),(1370,y-32+math.sin(u*2)*15),(1690,y+10),(1960,y-13)],TEAL,1,.16)
 c.restore()
 tag(c,SC[6]['sub'])
 reveal(c,TX['tang'],134,189,91,GOLD,u=u)
 caption(c,SC[6]['top'],u,False,899,63)
 flakes(c,t,42)

def song(c,t,u):
 background(c,True)
 moon(c,1490-u*11,310,199,.72,False)
 for j in range(4):
  paint(c,A.hills[j],-295-u*(42+j*27),290+j*15,2620,891,.66+j*.07)
 town(c,t*2,-88-u*26,736,1.16,True)
 for i in range(40):
  xx=(i*129-u*(27+i%7*6))%2050-90;yy=775+(i%8)*13
  line(c,[(xx,yy),(xx+62+(i%3)*24,yy)],INK2,1.2,.23)
 bx=1350-u*61
 poly(c,[(bx,861),(bx+142,861),(bx+113,882),(bx+28,882)],'#285148',.95)
 curve(c,[(bx+22,859),(bx+34,808),(bx+97,808),(bx+112,859)],'#285148',4,.85)
 person(c,bx+120,843,.3,'#29473f','stand',t*2)
 line(c,[(bx+126,818),(bx+160+math.sin(u*4)*14,879)],'#29473f',2,.8)
 tag(c,SC[7]['sub'],True)
 reveal(c,SC[7]['top'][:6],148,189,74,INK,'serif',u=u)
 reveal(c,SC[7]['top'][6:],148,302,84,INK,'serif',u=u,delay=.08)
 text(c,SC[7]['note'],158,427,29,INK,'sans',a=.87)
 text(c,'A WISH THAT CROSSED A THOUSAND YEARS',159,483,18,INK,'sans',a=.54,tracking=1)


def ming(c,t,u):
 background(c,True)
 for j in range(3):paint(c,A.hills[j],-150-u*(5+j*5),340+j*40,2250,805,.20)
 paint(c,A.branch,1380-u*10,-30,710,850,.80)
 x,y=1280,480;r=298
 ellipse(c,x,y+235,419,64,INK,.11)
 ellipse(c,x,y+70,360,315,'#aab498',.33)
 ellipse(c,x,y+28,346,294,'#f1e6ce')
 for j in range(3):circle(c,x,y,331+j*16,'#b59a68',.3,1.5)
 spread=59*smooth((u-.55)/1.4)
 cake_sectors(c,x,y,r,spread,-.10+u*.21)
 for k in range(24):
  aa=k*TAU/24+u*.2
  circle(c,x+math.cos(aa)*395,y+math.sin(aa)*341,2+(k%4==0)*2,'#b29661',.44)
 reveal(c,TX['reunion'],134,291,182,INK,u=u)
 reveal(c,SC[8]['sub'],152,529,41,INK,'serif',u=u)
 text(c,'A CIRCLE, SHARED.',156,609,22,INK,'sans',a=.6,tracking=2.5)
 tag(c,SC[8]['sub'],True)
 caption(c,SC[8]['top'],u,True,902,57)
 flakes(c,t,24,True)

def mosaic(c,t,u):
 background(c);stars(c,t,.7)
 join=smooth((u-1.13)/1.27)
 for k in range(4):
  bx=252+(k%2)*730;by=139+(k//2)*362
  sc=1-.88*join;ww=686*sc;hh=331*sc
  x=lerp(bx,960-ww/2,join);y=lerp(by,450-hh/2,join)
  c.save();c.translate(x+ww/2,y+hh/2);c.rotate((1-join)*math.sin(u*1.4+k)*.028)
  V.history_tile(c,k,-ww/2,-hh/2,ww,hh,t*2)
  rr(c,-ww/2,-hh/2,ww,hh,8,GOLD,.75,2);c.restore()
 if join>.12:moon(c,960,455,295,clamp((join-.12)/.70))
 arc(c,960,456,369,-u*1.6,-u*1.6+PI*1.55,GOLD,3,.54)
 caption(c,SC[9]['top'],u,False,903,59)
 tag(c,'FOUR MATERIALS / ONE THOUSAND YEARS')
 flakes(c,t,40)

def windows_moon(c,t,u):
 background(c);stars(c,t,.95)
 mx=lerp(960,1380,ease(u/.7));my=465;r=312+u*6
 moon(c,mx,my,r,.87)
 c.save();circle(c,mx,my,r-8,CREAM,0);c.arc(mx,my,r-10,0,TAU);c.clip()
 for j in range(23):
  for k in range(29):
   xx=mx+(k-14)*23;yy=my+(j-11)*26
   a=.18+.46*(.5+.5*math.sin(j*1.6+k*2.4+u*3.7))
   rr(c,xx-5,yy-8,10,16,1,'#fff2cb',a)
 c.restore()
 paint(c,A.city,-170-u*28,573,2360,620,.64)
 for j in range(3):
  aa=u*.55+j*2.1;arc(c,mx,my,r+35+j*20,aa,aa+2.0,GOLD,1.4,.35)
 reveal(c,SC[10]['top'][:5],137,330,80,u=u)
 reveal(c,SC[10]['top'][5:],132,451,117,u=u,delay=.08)
 text(c,'THE WAY WE MEET CHANGES. THE WISH DOES NOT.',146,631,18,GOLD,'sans',a=.8,tracking=.7)
 tag(c,SC[10]['sub'])
 flakes(c,t,62)

def bitten_cake(c,x,y,r,bite=False,rotation=0):
 c.save();c.translate(x,y);c.rotate(rotation)
 if bite:
  c.set_fill_rule(cairo.FILL_RULE_EVEN_ODD)
  c.rectangle(-r*1.1,-r*1.1,r*2.2,r*2.2)
  c.new_sub_path();c.arc(r*.68,-r*.63,r*.47,0,TAU);c.clip()
 paint(c,A.cake,-r,-r,r*2,r*2)
 c.restore()

def avatar(c,x,y,s,t,older=False,eating=True,phase=0):
 c.save();c.translate(x,y);c.scale(s,s)
 bob=math.sin(t*3+phase)*2.7;c.translate(0,bob)
 skin='#e4bb90' if not older else '#d9ae84'
 hair='#303332' if not older else '#7c8173'
 shirt='#47656b' if not older else '#a66550'
 # Soft shadow, cloth seam, collar, ear and hair details.
 ellipse(c,7,237,109,35,'#1b3034',.16)
 rr(c,-86,74,173,212,47,shirt)
 curve(c,[(-72,110),(-58,184),(-71,229),(-73,281)],'#cfb792',2,.3)
 poly(c,[(-33,80),(0,112),(34,80),(22,69),(-22,69)],'#efe0c5',.96)
 rr(c,-21,41,42,46,14,skin)
 ellipse(c,-57,6,15,22,skin);ellipse(c,57,6,15,22,skin)
 ellipse(c,0,-1,62,77,hair)
 ellipse(c,0,7,55,64,skin)
 # A swept fringe rather than a featureless silhouette.
 c.new_path();c.move_to(-57,-12);c.curve_to(-68,-90,70,-85,59,-1)
 c.curve_to(41,-6,24,-40,4,-45);c.curve_to(-9,-13,-42,-8,-57,-12);col(c,hair);c.fill()
 if older:
  for j in range(4):curve(c,[(-42+j*18,-38),(-33+j*15,-53),(-12+j*12,-54),(5+j*11,-39)],'#c1c2aa',2,.65)
 cycle=(t*.50+phase)%1
 reach=smooth(cycle/.25)*(1-smooth((cycle-.47)/.28)) if eating else .08
 chew=reach>.70
 for xx in [-22,23]:
  if chew:
   curve(c,[(xx-8,1),(xx-4,-5),(xx+5,-5),(xx+8,1)],'#343c37',3.3,.9)
  else:
   ellipse(c,xx,-1,3.2,4.7,'#343c37')
   curve(c,[(xx-8,-14),(xx-2,-17),(xx+4,-17),(xx+8,-14)],hair,2,.7)
 curve(c,[(-3,5),(-5,13),(-1,17),(5,16)],'#b88664',2,.7)
 curve(c,[(-12,29),(-6,35),(7,35),(13,28)],'#8e5848',2.5,.95)
 ellipse(c,-32,20,12,5,'#d8967d',.4);ellipse(c,33,20,12,5,'#d8967d',.4)
 # Left arm rests on the table; right hand raises a real cake to the mouth.
 curve(c,[(-66,109),(-103,158),(-105,205),(-50,219)],shirt,33)
 circle(c,-47,219,16,skin)
 hx=lerp(87,25,reach);hy=lerp(173,32,reach)
 curve(c,[(70,109),(116,132),(119,193),(hx,hy)],shirt,31)
 circle(c,hx,hy,17,skin)
 bitten_cake(c,hx-5,hy-8,31,cycle>.36,.08-reach*.35)
 line(c,[(hx+8,hy+8),(hx+15,hy)],'#c38e6c',2,.65)
 c.restore()

def screen_content(c,w,h,t,kind=0,eating=True):
 warm=kind==0
 rect(c,0,0,w,h,'#bc9a68' if warm else '#304b5e')
 if warm:
  # Warm living room with moonlit window and plant.
  rect(c,0,h*.72,w,h*.28,'#877257')
  window(c,w*.68,73,w*.25,h*.37,True)
  moon(c,w*.805,h*.24,w*.062,.83,False)
  tree(c,w*.10,h*.66,w/920,True)
  rect(c,0,62,w,5,'#ddc697',.5)
 else:
  moon(c,w*.79,h*.25,w*.105,.95)
  for k in range(6):
   xx=k*w/5;hh=95+(k%3)*48
   rect(c,xx,h*.69-hh,w*.16,hh,'#1c3547',.9)
   for j in range(3):rect(c,xx+15+j*15,h*.69-hh+24,6,11,GOLD,.65)
  line(c,[(0,h*.53),(w,h*.53)],TEAL,2,.35)
 if warm:
  avatar(c,w*.31,h*.355,w/610*.78,t,True,eating,.0)
  avatar(c,w*.69,h*.37,w/610*.74,t+.10,False,eating,.09)
 else:avatar(c,w*.49,h*.37,w/610*1.01,t,False,eating,.08)
 # Both cakes remain grounded in visible hands and plates.
 ellipse(c,w*.5,h*.87,w*.57,h*.15,'#ae8658')
 ellipse(c,w*.5,h*.84,w*.56,h*.12,'#dfbd87')
 for xx in [.24,.75]:
  ellipse(c,w*xx,h*.835,w*.10,h*.023,'#f0dfbe')
  small_cake(c,w*xx,h*.816,w*.047)
 steam(c,w*.18,h*.74,t,.65)
 rect(c,0,0,w,64,NIGHT,.15)
 circle(c,26,30,5,'#baddba')
 text(c,TX['call'],43,15,21,CREAM,'sans',a=.96)
 text(c,TX['home'] if warm else TX['here'],w-25,16,21,CREAM,'sans',align='right',a=.92)
 rect(c,0,h-55,w,55,NIGHT,.75)
 for j in range(3):circle(c,w*.5+(j-1)*59,h-29,17,'#bd7963' if j==1 else '#c5cbb9',.95)
 curve(c,[(w/2-7,h-29),(w/2-3,h-34),(w/2+4,h-34),(w/2+8,h-29)],CREAM,3,.96)


def video_card(c,x,y,w,h,t,kind=0,tilt=0,scale=1,eating=True):
 c.save();c.translate(x+w/2,y+h/2);c.rotate(tilt);c.transform(cairo.Matrix(scale,0,-tilt*.5,scale,0,0));c.translate(-w/2,-h/2)
 glow(c,w*.5,h*.5,w*.88,TEAL if kind else GOLD,.13)
 rr(c,11,15,w,h,28,'#040c11',.75)
 rr(c,0,0,w,h,28,'#6f8b90');rr(c,3,3,w-6,h-6,27,'#112736')
 c.save()
 c.new_path()
 for xx,yy,a in [(w-31,31,-PI/2),(w-31,h-31,0),(31,h-31,PI/2),(31,31,PI)]:c.arc(xx,yy,22,a,a+PI/2)
 c.close_path();c.clip();c.translate(9,9);screen_content(c,w-18,h-18,t,kind,eating);c.restore()
 rr(c,0,0,w,h,28,CREAM,.38,1.7)
 c.restore()

def connection(c,t,x1,y1,x2,y2):
 p=[(x1,y1),(x1+(x2-x1)*.28,y1-110),(x1+(x2-x1)*.7,y2-90),(x2,y2)]
 curve(c,p,GOLD,2,.55)
 for k in range(14):
  a=(t*.50+k/14)%1
  xx=(1-a)**3*p[0][0]+3*(1-a)**2*a*p[1][0]+3*(1-a)*a*a*p[2][0]+a**3*p[3][0]
  yy=(1-a)**3*p[0][1]+3*(1-a)**2*a*p[1][1]+3*(1-a)*a*a*p[2][1]+a**3*p[3][1]
  circle(c,xx,yy,3+(k%3==0),GOLD,.9)


def call_scene(c,t,u,eat=False):
 background(c);stars(c,t,.7)
 moon(c,960,286,191,.49)
 for j in range(5):ellipse(c,960,880+j*15,825+j*25,76+j*11,TEAL,.11,1.4)
 b=math.sin(u*1.9)*10;openq=ease(u/.5)
 video_card(c,145-(1-openq)*110,196+b,682,628,t,0,-.045+.018*math.sin(u*1.2),1,True)
 video_card(c,1093+(1-openq)*110,193-b,682,628,t+.16,1,.045-.018*math.sin(u*1.2),1,True)
 connection(c,t,826,449,1098,449)
 for j in range(3):
  circle(c,960,488,42+j*11+10*math.sin(u*2),GOLD,.15,1)
 small_cake(c,960,488,45)
 tag(c,TX['share'] if eat else 'NOW / SAME MOON, SAME MOMENT')
 caption(c,SC[12 if eat else 11]['top'],u,False,901,62)
 flakes(c,t,35)


def eat_macro(c,t,u):
 background(c);stars(c,t,.6)
 moon(c,960,238,176,.5)
 # A motivated close-up: from the whole call to the shared act of eating.
 for k in range(2):
  x=74 if k==0 else 995
  c.save();c.rectangle(x,173,850,658);c.clip()
  rect(c,x,173,850,658,'#b7976c' if k==0 else '#304b5c')
  if k==0:
   window(c,x+590,205,179,254,True)
   moon(c,x+680,287,48,.75,False)
   tree(c,x+99,695,.8,True)
  else:
   moon(c,x+663,278,86,.9)
   for j in range(5):
    xx=x+j*186;hh=152+(j%3)*54
    rect(c,xx,692-hh,137,hh,'#213744',.88)
    for jj in range(3):rect(c,xx+27+jj*27,720-hh,8,15,GOLD,.55)
  avatar(c,x+419,392,1.77,t+(k*.16),k==0,True,.04*k)
  ellipse(c,x+425,838,560,116,'#ac8459')
  ellipse(c,x+425,817,554,98,'#d8b780')
  for xx in [x+194,x+646]:
   ellipse(c,xx,805,94,24,'#f3e2bd');small_cake(c,xx,785,48)
  c.restore()
  rr(c,x,173,850,658,18,GOLD if k==0 else TEAL,.67,2)
  text(c,TX['home'] if k==0 else TX['here'],x+32,197,25,CREAM,'sans',a=.98)
  circle(c,x+813,215,6,'#b7dfbe')
 glow(c,960,504,114,GOLD,.2)
 connection(c,t,926,515,993,515)
 tag(c,TX['share'])
 caption(c,SC[12]['top'],u,False,903,67)
 flakes(c,t,22)


def shared(c,t,u):
 background(c);stars(c,t,.8)
 moon(c,960,487,243,.32)
 video_card(c,162-u*7,309,574,487,t,0,-.04)
 video_card(c,1185+u*7,309,574,487,t+.12,1,.04)
 connection(c,t,735,535,1187,535)
 ellipse(c,960,840,966,151,'#8a6444',.70)
 ellipse(c,960,814,937,140,'#c5a06b',.92)
 for xx in [565,1340]:
  ellipse(c,xx,801,117,28,'#eee0bc');small_cake(c,xx,773,65)
 circle(c,957,810,118,'#e9d7af',.85)
 cake_sectors(c,957,800,85,16+5*math.sin(u*2),u*.15)
 reveal(c,SC[13]['top'],960,121,72,u=u,align='center')
 reveal(c,SC[13]['sub'],960,215,83,u=u,delay=.05,align='center')
 flakes(c,t,40)


def night_windows(c,t,u):
 background(c);stars(c,t,.8)
 paint(c,A.city,-240-u*22,517,2440,675,.38)
 for k in range(46):
  xx=(k*139+t*12)%1940;yy=146+(k*83)%650
  rr(c,xx,yy,8+(k%4)*3,13+(k%3)*4,1,GOLD,.04+.05*math.sin(t*1.7+k)**2)


def heart(c,t,u,warm=False):
 night_windows(c,t,u);mx,my=1380,485;r=292
 glow(c,mx,my,598,GOLD,.25 if warm else .15)
 start=-PI*.37;end=PI*1.34
 arc(c,mx,my,r,start,end,GOLD,4,.88)
 arc(c,mx,my,r+17,start+.12,end-.1,TEAL,1,.33)
 aa=u*.55
 arc(c,mx,my,r+42,aa,aa+1.55,GOLD,1.5,.36)
 if not warm:
  moon(c,mx,my,r-16,.28,False)
  person(c,mx-160,my+132,.55,'#e0c898','phone',t*2)
  person(c,mx+162,my+131,.55,'#e0c898','phone',t*2+.5)
  reveal(c,SC[14]['top'],145,259,67,u=u)
  reveal(c,TX['reunion'],129,379,140,u=u,delay=.06)
  reveal(c,SC[14]['sub'][3:],145,582,73,u=u,delay=.1)
 else:
  reveal(c,SC[15]['top'],145,287,69,u=u)
  reveal(c,SC[15]['sub'],130,434,112,u=u,delay=.08)
  text(c,TX['hold'],150,632,31,GOLD,'serif',a=.85)
  target=-PI*.51;px=mx+r*math.cos(target);py=my+r*math.sin(target)
  for j in range(78):
   aa=j*2.39996+u*.22;rr0=47+math.sqrt(j)*27
   q=(u*.30+j*.037)%1
   x=lerp(mx+math.cos(aa)*rr0,px,q);y=lerp(my+math.sin(aa)*rr0*.84,py,q)
   circle(c,x,y,1.7+(j%3)*.7,GOLD,.2+.55*q)
   if j%7==0:curve(c,[(mx+math.cos(aa)*r,my+math.sin(aa)*r),(mx-70,my-120),(mx+40,my-130),(px,py)],GOLD,1,.11)
  glow(c,px,py,120,GOLD,.61);circle(c,px,py,7,'#fff2c8')
  person(c,mx-96,my+167,.68,'#dcca9c','phone',t*2)
  person(c,mx+90,my+167,.68,'#dcca9c','phone',t*2+.5)
  line(c,[(mx-46,my+125),(mx+40,my+124)],GOLD,2,.53)
 tag(c,'WHAT REUNION REALLY MEANS')
 flakes(c,t,48)


def study(c,t,u):
 night_windows(c,t,u)
 moon(c,1502,230,155,.94)
 for j in range(22):
  en=ease((u+.15-j*.035)/.44)
  x=834+j*35+(1-en)*210;y=870-j*28+(1-en)*100
  w=207
  poly(c,[(x,y),(x+w,y-26),(x+w+58,y+9),(x+58,y+35)],'#ede3c9',.45+j*.021)
  poly(c,[(x+58,y+35),(x+w+58,y+9),(x+w+58,y+23),(x+58,y+49)],'#93aeb0',.43)
  line(c,[(x+12,y+1),(x+175,y-19)],CREAM,1.4,.40)
  if j%3==0:line(c,[(x+53,y+8),(x+173,y-7)],INK,1,.28)
 st=4+u*4.8;xx=834+st*35+127;yy=870-st*28-14
 person(c,xx,yy,.56,'#243b45','walk',t*3)
 for j in range(18):
  q=(u*.43+j*.14)%1;x=875+j*43+60*math.sin(q*PI);y=735-j*24-q*195
  c.save();c.translate(x,y);c.rotate(-.18+math.sin(u*1.8+j)*.29)
  poly(c,[(-17,-27),(20,-27),(24,29),(-17,29)],CREAM,.22+j*.019)
  for k in range(3):line(c,[(-10,-9+k*8),(12,-9+k*8)],INK,1.2,.45)
  c.restore()
 reveal(c,SC[16]['top'],139,320,68,u=u)
 reveal(c,SC[16]['sub'][:5],139,447,87,u=u,delay=.05)
 reveal(c,SC[16]['sub'][5:],139,562,87,u=u,delay=.1)
 tag(c,TX['exam'])
 text(c,'TO EVERY STUDENT / KEEP YOUR LIGHT',151,713,20,GOLD,'sans',a=.82,tracking=1)
 flakes(c,t,39)


def science(c,t,u):
 night_windows(c,t,u);cx,cy=1390,490
 for j in range(5):
  c.save();c.translate(cx,cy);c.rotate(-.83+j*.59+u*.19);c.scale(1,.38+j*.045)
  arc(c,0,0,245+j*23,0,TAU,TEAL,2,.45)
  for k in range(4):
   aa=u*(1.5+j*.11)+k*TAU/4+j
   circle(c,math.cos(aa)*(245+j*23),math.sin(aa)*(245+j*23),5,GOLD,.92)
  c.restore()
 glow(c,cx,cy,246,GOLD,.31);circle(c,cx,cy,30,CREAM,.91)
 pts=[]
 for j in range(67):
  aa=j*2.399+u*.25;rr0=25+math.sqrt(j)*24
  xx=cx+math.cos(aa)*rr0;yy=cy+math.sin(aa)*rr0*.78
  pts.append((xx,yy));circle(c,xx,yy,2+(j%3)*.6,CREAM,.63)
  if j>0 and j%2:line(c,[pts[j-1],pts[j]],TEAL,1.3,.29)
 for k in range(24):
  xx=1040+k*31;line(c,[(xx,824),(xx,814-(k%4==0)*12)],TEAL,1.3,.6)
 reveal(c,SC[17]['top'],139,330,74,u=u)
 reveal(c,SC[17]['sub'][:5],139,463,87,u=u,delay=.05)
 reveal(c,SC[17]['sub'][5:],139,578,87,u=u,delay=.1)
 tag(c,'TO EVERY RESEARCHER / FOLLOW THE QUESTION')
 text(c,TX['research'],cx,868,26,GOLD,'sans',a=.83,align='center')
 flakes(c,t,40)


def poetry(c,t,u):
 background(c);stars(c,t,.9)
 moon(c,960,494,251,.36);glow(c,960,510,810,GOLD,.18)
 # A moving perspective wall. Rows use fixed lanes, avoiding popping labels.
 for row in range(10):
  y=115+row*86+9*math.sin(u*.8+row*.7)
  front=(row%3)/2;sz=26+int(front*10)
  speed=(32+row%4*11)*(-1 if row%2 else 1)
  for k in range(8):
   idx=(row*7+k)%len(WISHES);s=WISHES[idx]
   x=((k*335+row*127+u*speed)%2680)-320
   a=(.31+front*.48)*clamp((x+120)/180)*clamp((1940-x)/180)
   # Preserve the central reading aperture, while allowing text to pass behind it.
   if 366<y<654:
    dist=abs(x-960)
    a*=smooth((dist-400)/190)
   if a>.015:
    text(c,s,x,y,sz,GOLD if (k+row)%4==0 else CREAM,'sans',a=a,align='center')
 for j in range(4):ellipse(c,960,510,813+j*43,342+j*26,GOLD,.055,1.3)
 first=u<2.0;txt=SC[18]['top'] if first else SC[18]['sub']
 uu=u if first else u-2
 reveal(c,txt,960,453,76,u=uu,align='center')
 text(c,TX['bless'],960,356,42,GOLD,'serif',align='center',a=.94)
 text(c,'MAY EVERY JOURNEY FIND ITS LIGHT',960,595,21,GOLD,'sans',a=.84,align='center',tracking=2)
 flakes(c,t,62)


def invitation(c,t,u):
 background(c);stars(c,t,.8);moon(c,964,341,217,.40)
 video_card(c,224,128,600,576,t,0,-.038+u*.006)
 video_card(c,1098,128,600,576,t+.12,1,.038-u*.006)
 connection(c,t,825,409,1100,409)
 small_cake(c,963,456,67+math.sin(u*2)*3)
 reveal(c,SC[19]['top'],960,760,72,u=u,align='center')
 reveal(c,SC[19]['sub'],960,856,88,u=u,delay=.06,align='center')
 flakes(c,t,40)


def finale(c,t,u):
 room(c,t,u,True)
 # A luminous arc completes its movement; the text remains until frame 3599.
 arc(c,1435,309,244,-PI/2,-PI/2+TAU*clamp(.35+u*.30),GOLD,2,.75)
 for k in range(42):
  aa=k*2.399;rr0=230+(u*37+k*11)%226
  x=1435+math.cos(aa+u*.12)*rr0;y=309+math.sin(aa+u*.12)*rr0*.85
  circle(c,x,y,1.4+(k%3)*.7,GOLD,.36*(1-(rr0-230)/250))
 reveal(c,SC[20]['top'],223,320,151,u=u)
 reveal(c,SC[20]['sub'],229,534,56,u=u,delay=.06)
 text(c,TX['final'],234,639,40,GOLD,'serif',a=.93)
 tag(c,'TONIGHT / WE SHARE THE SAME MOON')
 text(c,DATA['title'],1470,886,28,CREAM,'serif',align='center',a=.94)

FUNCS=[intro,busy,question,memory,rewind,ancient,tang,song,ming,mosaic,windows_moon,
       lambda c,t,u:call_scene(c,t,u,False),eat_macro,shared,
       lambda c,t,u:heart(c,t,u,False),lambda c,t,u:heart(c,t,u,True),study,science,poetry,invitation,finale]


def scene_index(t):
 for i,s in enumerate(SC):
  if s['start']<=t<s['end']:return i
 return len(SC)-1

def plain(c,t,i=None):
 if i is None:i=scene_index(t)
 FUNCS[i](c,t,t-SC[i]['start'])
 rim(c,t,i in BRIGHT)

@lru_cache(maxsize=24)
def previous(i):
 s=cairo.ImageSurface(cairo.FORMAT_ARGB32,W,H);c=cairo.Context(s)
 plain(c,SC[i]['start']-1/FPS,i-1)
 return s

# Fast material wipes, not a dissolve between two simultaneously legible captions.
WIPES={3:'diagonal',4:'radial',5:'diagonal',6:'diagonal',7:'diagonal',8:'radial',9:'diagonal',10:'radial',13:'radial',16:'diagonal',17:'diagonal',18:'radial',19:'diagonal',20:'radial'}

def render_frame(c,t):
 i=scene_index(t);u=t-SC[i]['start'];d=.22 if i not in [4,8,10,20] else .27
 if i in WIPES and u<d:
  paint(c,previous(i));p=ease(u/d)
  c.save()
  if WIPES[i]=='radial':
   c.arc(1120,500,15+p*2250,0,TAU);c.clip()
  else:
   edge=-550+p*3100
   c.move_to(-100,-100);c.line_to(edge+350,-100);c.line_to(edge-150,H+100);c.line_to(-100,H+100);c.close_path();c.clip()
  plain(c,t,i);c.restore()
 else:plain(c,t,i)


def stills():
 init();qs=ROOT/'qa';qs.mkdir(exist_ok=True)
 times=[s['start']+min((s['end']-s['start'])*.53,1.8) for s in SC]
 thumbs=[]
 font=ImageFont.truetype(V.SANS,24,index=2)
 for i,t in enumerate(times):
  s=cairo.ImageSurface(cairo.FORMAT_ARGB32,W,H);c=cairo.Context(s);render_frame(c,t)
  fp=qs/f'shot_{i+1:02d}.png';s.write_to_png(str(fp))
  im=Image.open(fp).convert('RGB');im.thumbnail((640,360))
  card=Image.new('RGB',(640,399),'#091825');card.paste(im,(0,0))
  dr=ImageDraw.Draw(card);dr.text((12,367),f'{i+1:02d}  '+SC[i]['name'],font=font,fill='#edd3a4')
  thumbs.append(card)
 sheet=Image.new('RGB',(1920,399*7),'#091825')
 for i,im in enumerate(thumbs):sheet.paste(im,((i%3)*640,(i//3)*399))
 sheet.save(qs/'storyboard_60s.jpg',quality=92)
 print('Stills complete',flush=True)


def render(start,end,out,crf=18):
 init();out=Path(out);out.parent.mkdir(parents=True,exist_ok=True)
 s=cairo.ImageSurface(cairo.FORMAT_ARGB32,W,H);c=cairo.Context(s)
 c.set_antialias(cairo.ANTIALIAS_BEST)
 cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','bgra','-video_size','1920x1080','-framerate',str(FPS),'-i','-','-an','-c:v','libx264','-preset','fast','-crf',str(crf),'-pix_fmt','yuv420p','-threads','1','-g','120','-movflags','+faststart',str(out)]
 p=subprocess.Popen(cmd,stdin=subprocess.PIPE);ts=time.time()
 a=round(start*FPS);b=round(end*FPS)
 try:
  for n in range(a,b):
   render_frame(c,n/FPS);s.flush();p.stdin.write(s.get_data())
   if (n-a)%240==0:print('%s %.2f/%.2fs | %.1f fps'%(out.name,n/FPS,end,(n-a+1)/(time.time()-ts)),file=sys.stderr,flush=True)
  p.stdin.close();ret=p.wait()
  if ret:raise RuntimeError('Encoder failed: %s'%ret)
 except BaseException:
  p.kill();raise
 print('COMPLETE',out,'in',round(time.time()-ts,1),'seconds',file=sys.stderr,flush=True)

if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--stills',action='store_true');p.add_argument('--start',type=float,default=0);p.add_argument('--end',type=float,default=60);p.add_argument('--out',default=str(ROOT/'render'/'picture.mp4'));p.add_argument('--crf',type=int,default=18)
 args=p.parse_args()
 if args.stills:stills()
 else:render(args.start,args.end,args.out,args.crf)
