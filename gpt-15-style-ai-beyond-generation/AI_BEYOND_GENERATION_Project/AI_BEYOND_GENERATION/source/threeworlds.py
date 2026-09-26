"""Six spatial worlds: real geometry, animated cameras and material-specific staging."""
import math
import numpy as np
from nativegl import GL, model, cube_data
B=60/128
def shot_id(t):
 b=t/B
 return (2+int(b*2)%2) if b>=14 else min(3,int(b/4))

def smooth(x):x=max(0,min(1,x));return x*x*(3-2*x)

class ThreeWorlds:
 def __init__(self,w=1920,h=1080):
  self.gl=GL(w,h);self.ready=set();self.rng=np.random.default_rng(821)
 def obj(self,name,pos=(0,0,0),scale=(1,1,1),rot=(0,0,0),mode=0,col=(1,1,1)):
  return(self.gl.mesh(name),model(pos,scale,rot),mode,col)
 def init_mc(self):
  data=[];rng=np.random.default_rng(71)
  # A constructed floating island: separate grass, soil and stone layers.
  for x in range(-9,10):
   for z in range(-7,8):
    r=(x/9)**2+(z/7)**2
    if r>1+.05*math.sin(x*3+z):continue
    y=.15+.25*(int(rng.integers(0,3)) if abs(x)>4 or abs(z)>4 else 0)
    data.append(cube_data((x*.6,y-.25,z*.6),(.6,.55,.6),(.27+.06*rng.random(),.54+.12*rng.random(),.23)))
    depth=1.2*(1-r)+.25
    data.append(cube_data((x*.6,y-.65-depth/2,z*.6),(.6,depth,.6),(.37,.25,.18)))
  # Cubical trees, stairs and distant clouds; all original meshes.
  for tx,tz in [(-3,1.5),(3.5,-2),(-3.7,-2.4),(2.5,2.5)]:
   data.append(cube_data((tx,1.15,tz),(.35,1.9,.35),(.33,.22,.12)))
   for dx,dy,dz,sc in [(0,2,0,(1.5,.8,1.5)),(.25,2.6,0,(1.05,.7,1.1)),(-.3,2.25,.35,(1.0,.75,1.))]:data.append(cube_data((tx+dx,dy,tz+dz),sc,(.13,.39,.19)))
  for k in range(8):data.append(cube_data((-2.1+k*.6,.45,1),(.52,.25,.52),(.88,.61,.16)))
  # Solid arch with a genuine open center.
  for xx in [-1.25,1.25]:data.append(cube_data((xx,2.0,-1.0),(.4,3.5,.55),(.17,.13,.30)))
  data.append(cube_data((0,3.75,-1),(2.9,.4,.55),(.17,.13,.30)))
  for xx in [-1.01,1.01]:data.append(cube_data((xx,2,-.68),(.07,3,.06),(.45,.35,.98)))
  self.gl.mesh('island',np.vstack(data))
  self.ready.add('mc')
 def mc(self,t):
  if 'mc' not in self.ready:self.init_mc()
  shot=shot_id(t);u=(t%(4*B))/(4*B);p=math.exp(-((t/B)%1)*9)
  poses=[(8.5,7.1,11.5),(-7,5.5,10),(4.1,3.6,7.6),(8.2,8.2,9.3)]
  e=np.array(poses[shot]);theta=.07*(u-.5);e[[0,2]]=np.array([[math.cos(theta),-math.sin(theta)],[math.sin(theta),math.cos(theta)]])@e[[0,2]]
  objs=[self.obj('island',mode=1)]
  # Blocks assemble on beats rather than drifting through each other.
  for i in range(5):
   for j in range(1+i%3):
    dest=(2.4+i*.28,.7+j*.55,-.3+i*.22)
    drop=max(0,1-smooth((t/B-i*.8-j*.3)/.75))*4
    objs.append(self.obj('cube',(dest[0],dest[1]+drop,dest[2]),(.48,.48,.48),mode=1,col=(.26,.61,.86)))
  # Block-built actor walking along the visible gold path.
  x=-1.8+3.6*(.5-.5*math.cos(t*.8));y=.77+.05*abs(math.sin(t*5));z=1.04;walk=math.sin(t*6)*.25
  objs.extend([self.obj('cube',(x,y+.6,z),(.56,.65,.35),mode=1,col=(.08,.56,.60)),self.obj('cube',(x,y+1.14,z),(.48,.48,.48),mode=1,col=(.79,.57,.4))])
  for side in [-1,1]:
   objs.append(self.obj('cube',(x+side*.16,y+.08,z),(.23,.56,.25),(side*walk,0,0),1,(.12,.2,.4)))
   objs.append(self.obj('cube',(x+side*.43,y+.63,z),(.18,.57,.23),(-side*walk,0,0),1,(.72,.48,.32)))
   objs.append(self.obj('cube',(x+side*.10,y+1.18,z+.245),(.065,.065,.025),mode=0,col=(.06,.06,.08)))
  # Small colored signal packets pass through the arch without occupying the frame.
  for j in range(9):
   a=j*2.399+t*.7;objs.append(self.obj('cube',(.73*math.cos(a),2+.85*math.sin(a),-1),(.12,.12,.12),(t,t*.6,0),5,(.15,.52,.8)))
  for x,y,z,s in [(-8,7,-9,2),(5,8,-11,2.7),(10,7,0,1.7)]:objs.append(self.obj('cube',(x,y,z),(s, .65,s*.7),mode=0,col=(.91,.95,1)))
  return self.gl.render(objs,tuple(e),(0,1.0,0),40-p*.4,top=(.38,.67,.87),bottom=(.75,.88,.90),light=(-8,14,10),time=t)
 def clay(self,t):
  qt=math.floor(t*12)/12;shot=shot_id(t);u=(t%(4*B))/(4*B)
  objs=[self.obj('cube',(0,-1.38,0),(200,.3,200),mode=2,col=(.69,.57,.72))]
  bob=.06*math.sin(qt*5); base=np.array([.5,bob,0]);rot=.12*math.sin(qt*.8)
  def part(name,pos,sc,col,rr=(0,0,0)):
   pos=np.array(pos);pos[0]+=.5;pos[1]+=bob;objs.append(self.obj(name,tuple(pos),sc,rr,2,col))
  part('round',(0,.13,0),(.82,.96,.53),(.45,.59,.79))
  part('round',(0,1.95,0),(1.13,.86,.77),(.96,.54,.21))
  part('round',(0,1.84,.70),(.84,.53,.13),(.98,.70,.38))
  for s in [-1,1]:
   part('sphere',(s*.36,2,.83),(.235,.28,.115),(.96,.95,.87))
   part('sphere',(s*.36+.025*math.sin(qt),1.995,.933),(.09,.13,.065),(.08,.10,.15))
   part('sphere',(s*.34,2.04,.978),(.029,.043,.025),(.98,.97,.94))
   part('round',(s*.47,-.91,.03),(.30,.33,.41),(.97,.54,.21))
   # Arms stay outside the torso silhouette; discrete pose changes suggest hand animation.
   a=.22*math.sin(qt*2.1+s)+s*.35
   part('sphere',(s*1.06,.29,.02),(.28,.64,.28),(.42,.54,.73),(0,0,s*.48+a*.24))
   part('sphere',(s*1.35,-.15+.10*math.sin(qt*2),.05),(.29,.29,.29),(.98,.63,.31))
  part('round',(0,1.55,.875),(.25,.037,.055),(.4,.17,.11))
  part('cube',(0,2.96,0),(.055,.48,.055),(.40,.48,.68))
  part('sphere',(0,3.23,0),(.17,.17,.17),(.79,.32,.41))
  # Clay contextual objects arranged with genuine depth and clear separation.
  palette=[(.78,.3,.39),(.36,.70,.52),(.71,.72,.36),(.52,.43,.75)]
  for j in range(4):
   a=j*math.pi/2+qt*.18;cx=.5+2.65*math.cos(a);cz=1.3*math.sin(a);cy=.8+.8*math.sin(a+.5)
   objs.append(self.obj('round',(cx,cy,cz),(.43,.43,.16),(0,-a*.4,math.sin(qt+j)*.09),2,palette[j]))
   objs.append(self.obj('round',(cx,cy,cz+.18),(.22,.065,.024),mode=2,col=(.96,.91,.82)))
  e=[(5.6,3.7,10.8),(3.4,2.7,9.7),(4.8,4.9,9.8),(5.4,3.4,11)][shot];e=(e[0]+u*.35,e[1],e[2])
  return self.gl.render(objs,e,(-.7,.82,0),36,top=(.81,.73,.83),bottom=(.71,.59,.73),light=(-4,9,8),time=t)
 def cyber(self,t):
  shot=shot_id(t);u=(t%(4*B))/(4*B);pulse=math.exp(-((t/B)%1)*9)
  objs=[self.obj('cube',(0,-.27,-5),(45,.2,90),mode=6,col=(.012,.025,.042))]
  for side in [-1,1]:
   for j in range(13):
    h=2.2+(j*7%5)*.8;z=7-j*3.7;x=side*(4.5+(j%3)*.4)
    objs.append(self.obj('cube',(x,h/2-.16,z),(1.8,h,1.9),mode=0,col=(.017,.018,.038)))
    for dx in [-.89,.89]:objs.append(self.obj('cube',(x+dx,h/2,z+.965),(.025,h,.025),mode=5,col=(.015,.19,.30) if j%2 else (.28,.025,.25)))
    for y in [h*.25,h*.55,h*.8]:objs.append(self.obj('cube',(x,y,z+1), (1.65,.025,.025),mode=5,col=(.03,.22,.33)))
  for j in range(6):
   z=-2-j*3.0;col=(.1,.8,.77) if j%2==0 else (.52,.06,.58)
   objs.append(self.obj('ring',(0,2,z),(1.7,1.7,1.7),(math.pi/2,0,t*.12+j*.14),5,col))
  for j in range(6):
   a=j*math.pi/3+t*.8;pos=(1.16*math.cos(a),2+1.16*math.sin(a),-2.5)
   objs.append(self.obj('sphere',pos,(.16,.16,.16),mode=5,col=(.13,.82,.65)))
  objs.append(self.obj('sphere',(0,2,-2.5),(.64,.64,.64),mode=3,col=(.07,.30,.4)))
  eye=[(.1,2,7.5-u*1.1),(1.6,2.8,6.8-u),(-1.5,1.35,7.1-u),(0,2,6.8-u*.9)][shot]
  return self.gl.render(objs,eye,(0,2,-6),49-pulse,top=(.013,.004,.043),bottom=(.006,.015,.033),light=(-4,7,4),time=t,shadows=False)
 def chrome(self,t):
  shot=shot_id(t);u=(t%(4*B))/(4*B);p=math.exp(-((t/B)%1)*8)
  objs=[self.obj('cube',(0,-1.80,0),(200,.2,200),mode=0,col=(.025,.032,.041))]
  objs.append(self.obj('knot',(1,.35,0),(1,1,1),(t*.25,t*.32,.22*math.sin(t*.5)),3,(.83,.88,.92)))
  for j in range(3):
   a=t*.4+j*2.094;objs.append(self.obj('sphere',(1+2.3*math.cos(a),.4+.7*math.sin(a*1.3),2.3*math.sin(a)),(.11,.11,.11),mode=3,col=(.75,.88,.97)))
  poses=[(6.7,3.5,8.1),(4.9,2.2,6.3),(-4.3,3.7,7.8),(6.2,4.7,8.4)];e=np.array(poses[shot]);e[2]-=u*.35
  return self.gl.render(objs,tuple(e),(-.7,.15,0),34,top=(.009,.013,.022),bottom=(.017,.027,.035),light=(-4,8,7),time=t)
 def particles(self,t):
  if 'particles' not in self.ready:
   rng=np.random.default_rng(92);n=22000;v=rng.normal(size=(n,3));v/=np.linalg.norm(v,axis=1,keepdims=True);r=rng.uniform(.9,3.6,n)**.87;v*=r[:,None];a=rng.uniform(size=(n,3));a[:,0]=rng.uniform(.014,.055,n);c=np.zeros((n,3),np.float32);blend=rng.random(n);c[:,0]=.1+.75*blend;c[:,1]=.52+.30*(1-blend);c[:,2]=.86+.14*rng.random(n)
   self.gl.mesh('cosmos',np.hstack((v,a,c)));self.ready.add('particles')
  shot=shot_id(t);u=(t%(4*B))/(4*B);morph=[smooth(u),1,.5+.5*math.cos(u*math.pi),smooth(u)][shot]
  objs=[]
  # A sparse reference cube makes the points' 3D movement legible.
  if shot in [1,3]:
   for ax in range(3):
    for a in [-1,1]:
     for b in [-1,1]:
      pos=[0,0,0];other=[x for x in range(3) if x!=ax];pos[other[0]]=a*2.5;pos[other[1]]=b*2.5;sc=[.006,.006,.006];sc[ax]=5
      objs.append(self.obj('cube',pos,sc,mode=5,col=(.02,.11,.15)))
  e=[(6.5,3.6,10),(-5.2,2.7,9),(4.7,5.7,9.6),(5.5,2.8,10.5)][shot]
  return self.gl.render(objs,e,(0,0,0),40,top=(.002,.005,.014),bottom=(.005,.008,.024),light=(-5,6,3),time=t,shadows=False,particles=(self.gl.mesh('cosmos'),float(morph),760.0))
 def glass(self,t):
  shot=shot_id(t);u=(t%(4*B))/(4*B);pulse=math.exp(-((t/B)%1)*8)
  objs=[self.obj('cube',(0,-1.65,0),(200,.2,200),mode=0,col=(.77,.84,.87))]
  # Art-directed non-intersecting crystal objects on a studio stage.
  objs.append(self.obj('round',(.8,.15,0),(1.15,1.15,.72),(.12,t*.21,.16),4,(.72,.82,.95)))
  objs.append(self.obj('torus',(.3,2.0,-.25),(.83,.83,.83),(math.pi/2+.2*math.sin(t),t*.28,.3),4,(.74,.86,.96)))
  objs.append(self.obj('round',(3.05,-.87,.45),(.47,.47,.47),(0,t*.32,0),4,(.9,.75,.59)))
  objs.append(self.obj('sphere',(-1.7,-.98,-.1),(.52,.52,.52),mode=4,col=(.45,.76,.81)))
  for j in range(3):
   a=j*2.1+t*.3;objs.append(self.obj('sphere',(.7+2.3*math.cos(a),1.4+j*.3,1.5*math.sin(a)),(.1,.1,.1),mode=4,col=(.9,.8,.75)))
  e=[(6.5,3.9,10),(4.3,2.5,8.2),(-5.5,4.8,10),(6,4,11)][shot];e=(e[0]+u*.2,e[1],e[2])
  return self.gl.render(objs,e,(-.8,.2,0),36,top=(.87,.91,.94),bottom=(.77,.84,.89),light=(-5,9,7),time=t)
 def render(self,i,t):
  return {1:self.mc,2:self.clay,11:self.cyber,12:self.chrome,13:self.particles,14:self.glass}[i](t)
