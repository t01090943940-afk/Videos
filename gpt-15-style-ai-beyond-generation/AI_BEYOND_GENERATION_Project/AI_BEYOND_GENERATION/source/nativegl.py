"""Minimal native EGL/OpenGL renderer. No browser, remote library or network dependency.
Rasterized 3D meshes, depth testing, PCF shadow maps and procedural materials.
"""
import os
os.environ.setdefault('EGL_PLATFORM','surfaceless')
os.environ.setdefault('LP_NUM_THREADS','2')
import ctypes as C, ctypes.util, math
import numpy as np
P=C.c_void_p; I=C.c_int; U=C.c_uint; F=C.c_float; B=C.c_ubyte

def norm(v):
 v=np.asarray(v,dtype=np.float32); return v/max(1e-9,np.linalg.norm(v))
def lookat(eye,target,up=(0,1,0)):
 eye=np.array(eye,np.float32); z=norm(eye-np.array(target)); x=norm(np.cross(up,z)); y=np.cross(z,x)
 a=np.eye(4,dtype=np.float32); a[:3,:3]=[x,y,z]; a[:3,3]=-a[:3,:3]@eye; return a

def perspective(fov,aspect,near=.1,far=100):
 f=1/math.tan(math.radians(fov)/2); a=np.zeros((4,4),np.float32)
 a[0,0]=f/aspect; a[1,1]=f; a[2,2]=(far+near)/(near-far);a[2,3]=2*far*near/(near-far);a[3,2]=-1;return a

def ortho(l,r,b,t,n,f):
 a=np.eye(4,dtype=np.float32);a[0,0]=2/(r-l);a[1,1]=2/(t-b);a[2,2]=-2/(f-n)
 a[0,3]=-(r+l)/(r-l);a[1,3]=-(t+b)/(t-b);a[2,3]=-(f+n)/(f-n);return a

def model(pos=(0,0,0),scale=(1,1,1),rot=(0,0,0)):
 x,y,z=rot; cx,sx=math.cos(x),math.sin(x);cy,sy=math.cos(y),math.sin(y);cz,sz=math.cos(z),math.sin(z)
 rx=np.array([[1,0,0],[0,cx,-sx],[0,sx,cx]],np.float32)
 ry=np.array([[cy,0,sy],[0,1,0],[-sy,0,cy]],np.float32)
 rz=np.array([[cz,-sz,0],[sz,cz,0],[0,0,1]],np.float32)
 a=np.eye(4,dtype=np.float32);a[:3,:3]=ry@rz@rx@np.diag(scale);a[:3,3]=pos;return a

def cube_data(center=(0,0,0),scale=(1,1,1),color=(1,1,1)):
 faces=[((1,0,0),[(1,-1,-1),(1,1,-1),(1,1,1),(1,-1,1)]),((-1,0,0),[(-1,-1,1),(-1,1,1),(-1,1,-1),(-1,-1,-1)]),((0,1,0),[(-1,1,-1),(-1,1,1),(1,1,1),(1,1,-1)]),((0,-1,0),[(-1,-1,1),(-1,-1,-1),(1,-1,-1),(1,-1,1)]),((0,0,1),[(1,-1,1),(1,1,1),(-1,1,1),(-1,-1,1)]),((0,0,-1),[(-1,-1,-1),(-1,1,-1),(1,1,-1),(1,-1,-1)])]
 out=[]
 for n,vs in faces:
  for j in [0,1,2,0,2,3]:
   p=np.array(vs[j])*np.array(scale)*.5+center;out.append([*p,*n,*color])
 return np.array(out,np.float32)

def sphere_data(nu=48,nv=24,power=1):
 out=[]
 def v(u,v):
  th=u*2*np.pi; ph=v*np.pi
  p=np.array([np.sin(ph)*np.cos(th),np.cos(ph),np.sin(ph)*np.sin(th)])
  if power!=1:p=np.sign(p)*np.abs(p)**power
  return p
 def normal(u,v):
  if power==1:return norm(vv(u,v))
  p=vfun(u,v); a=vfun(u+.0001,v)-p;b=vfun(u,v+.0001)-p
  n=norm(np.cross(b,a)); return n if np.dot(n,p)>0 else -n
 vv=v;vfun=v
 for j in range(nv):
  for k in range(nu):
   coords=[(k/nu,j/nv),((k+1)/nu,j/nv),((k+1)/nu,(j+1)/nv),(k/nu,(j+1)/nv)]
   for n in [0,1,2,0,2,3]:
    u,w=coords[n];p=v(u,w)
    if power==1:nm=norm(p)
    else:
     # Implicit superellipsoid normal, well-defined at the poles.
     nm=norm(np.sign(p)*np.maximum(np.abs(p),.0001)**(2/power-1))
    out.append([*p,*nm,1,1,1])
 return np.array(out,np.float32)

def torus_data(R=1,r=.23,nu=100,nv=20,knot=False):
 out=[]
 def center(u):
  if not knot:return np.array([R*np.cos(u),0,R*np.sin(u)])
  return np.array([(1+.32*np.cos(3*u))*np.cos(2*u),.55*np.sin(3*u),(1+.32*np.cos(3*u))*np.sin(2*u)])*R
 def vert(u,v):
  c=center(u); t=norm(center(u+.001)-center(u-.001)); ref=np.array([0,1,0])
  if abs(t[1])>.95:ref=np.array([1,0,0])
  b=norm(np.cross(t,ref));n=norm(np.cross(b,t));no=np.cos(v)*n+np.sin(v)*b;return c+r*no,no
 for j in range(nu):
  for k in range(nv):
   uv=[(j/nu*2*np.pi,k/nv*2*np.pi),((j+1)/nu*2*np.pi,k/nv*2*np.pi),((j+1)/nu*2*np.pi,(k+1)/nv*2*np.pi),(j/nu*2*np.pi,(k+1)/nv*2*np.pi)]
   for h in [0,1,2,0,2,3]:
    p,n=vert(*uv[h]);out.append([*p,*n,1,1,1])
 return np.array(out,np.float32)

VERT='''#version 330 core
layout(location=0) in vec3 aPos; layout(location=1) in vec3 aNorm; layout(location=2) in vec3 aColor;
uniform mat4 uModel,uVP,uLight; out vec3 vPos,vN,vColor;out vec4 vShadow;
void main(){vec4 w=uModel*vec4(aPos,1.);vPos=w.xyz;vN=normalize(transpose(inverse(mat3(uModel)))*aNorm);vColor=aColor;vShadow=uLight*w;gl_Position=uVP*w;}
'''
FRAG='''#version 330 core
in vec3 vPos,vN,vColor;in vec4 vShadow;out vec4 frag;
uniform vec3 uEye,uTint,uLightPos;uniform int uMode,uShadows;uniform float uTime;uniform sampler2D uDepth;
float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
float shade(){if(uShadows==0)return 1.;vec3 p=vShadow.xyz/vShadow.w*.5+.5;if(p.z>1.||p.x<0.||p.x>1.||p.y<0.||p.y>1.)return 1.;float s=0.;for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)s+=p.z-.0017>texture(uDepth,p.xy+vec2(x,y)/1024.).r?.30:1.;return s/9.;}
vec3 env(vec3 r){vec3 c=mix(vec3(.015,.022,.035),vec3(.24,.28,.32),r.y*.5+.5);float panel=smoothstep(.72,.79,dot(r,normalize(vec3(-.65,.7,1.))));float strip=(1.-smoothstep(.07,.105,abs(r.y-.16)))*smoothstep(-.5,.15,r.x);float side=smoothstep(.88,.94,dot(r,normalize(vec3(.8,.25,-.5))));return c+vec3(3.7,3.75,3.9)*panel+vec3(2.4)*strip+vec3(.4,.9,1.8)*side;}
void main(){vec3 N=normalize(vN);vec3 V=normalize(uEye-vPos);vec3 L=normalize(uLightPos-vPos);vec3 albedo=vColor*uTint;float rough=.65;
 if(uMode==1){float h=hash(floor(vPos*13.));albedo*=.82+.3*h;float edge=max(max(abs(fract(vPos.x*2.)-.5),abs(fract(vPos.y*2.)-.5)),abs(fract(vPos.z*2.)-.5));albedo*=1.-.09*smoothstep(.465,.499,edge);rough=1.;}
 if(uMode==2){vec3 q=vPos*30.;vec3 bump=vec3(sin(q.y+sin(q.z*.7)),sin(q.z+sin(q.x)),sin(q.x+sin(q.y*.8)));N=normalize(N+.045*bump);float grain=hash(floor(vPos*165.));albedo*=.955+.09*grain;rough=.95;}
 if(uMode==6){vec2 q=abs(fract(vPos.xz*.5)-.5);float grid=1.-smoothstep(.006,.018,min(q.x,q.y));albedo=mix(albedo,vec3(.02,.6,.7),grid*.65);}
 float sh=shade();if(uMode==3)sh=1.;float dif=max(dot(N,L),0.);float fill=max(dot(N,normalize(vec3(1.,.5,-.5))),0.);vec3 col=albedo*(.22+.21*max(N.y,0.)+1.05*dif*sh)+albedo*vec3(.2,.25,.4)*fill;
 float spec=pow(max(dot(N,normalize(L+V)),0.),mix(85.,8.,rough));col+=vec3(.22)*spec*sh;
 if(uMode==3){vec3 R=reflect(-V,N);float fr=pow(1.-max(dot(N,V),0.),4.);col=env(R)*mix(vec3(.76,.8,.84),albedo,.13)+vec3(.03,.10,.13)*fr;col*=.68+.32*sh;}
 if(uMode==4){vec3 R=reflect(-V,N);vec3 T=refract(-V,N,1./1.48);float fr=.06+.94*pow(1.-max(dot(N,V),0.),4.);vec3 sky=mix(vec3(.58,.78,.84),vec3(.94,.9,.84),T.y*.5+.5);vec3 rainbow=.55+.45*cos(vec3(0.,2.1,4.2)+T.x*6.+T.z*4.);col=mix(sky*.85+rainbow*.28,env(R)*1.2,fr*.8+.12);col+=pow(max(dot(N,normalize(L+V)),0.),160.)*2.;}
 if(uMode==5){col=albedo*2.4;}
 col=pow(aces(col),vec3(1./2.2));frag=vec4(col,1.);}
'''
BGV='''#version 330 core
out vec2 uv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}
'''
BGF='''#version 330 core
in vec2 uv;out vec4 frag;uniform vec3 uTop,uBottom;uniform float uTime;
void main(){vec3 c=mix(uBottom,uTop,smoothstep(0.,1.,uv.y));float g=exp(-dot((uv-vec2(.58,.6))*vec2(1.1,1.),(uv-vec2(.58,.6))*vec2(1.1,1.))*4.);c+=g*.026;float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.54)-.5;frag=vec4(c+grain*.002,1.);}
'''
DEPTHV='''#version 330 core
layout(location=0) in vec3 aPos;uniform mat4 uMVP;void main(){gl_Position=uMVP*vec4(aPos,1.);}
'''
DEPTHF='''#version 330 core
void main(){}
'''
POINTV='''#version 330 core
layout(location=0) in vec3 aPos;layout(location=1) in vec3 aNorm;layout(location=2) in vec3 aColor;
uniform mat4 uVP,uView;uniform float uTime,uMorph,uSize;out vec3 color;
void main(){float a=aNorm.y*6.2831853;float b=aNorm.z*6.2831853;vec3 p=aPos;
 vec3 q=vec3((1.7+.45*cos(3.*a))*cos(2.*a),.8*sin(3.*a),(1.7+.45*cos(3.*a))*sin(2.*a));q+=.15*vec3(cos(b),sin(b),cos(b*2.));p=mix(p,q,uMorph);
 float co=cos(uTime*.16),si=sin(uTime*.16);p.xz=mat2(co,-si,si,co)*p.xz;vec4 view=uView*vec4(p,1.);gl_Position=uVP*vec4(p,1.);gl_PointSize=clamp(uSize*aNorm.x/max(.2,-view.z),1.,7.);color=aColor;}
'''
POINTF='''#version 330 core
in vec3 color;out vec4 frag;void main(){vec2 p=gl_PointCoord*2.-1.;float r=dot(p,p);if(r>1.)discard;float a=exp(-r*3.0)*.68;frag=vec4(color,a);}
'''

class GL:
 def __init__(self,w=1920,h=1080):
  self.w,self.h=w,h; self.E=C.CDLL(ctypes.util.find_library('EGL')); self.G=C.CDLL(ctypes.util.find_library('GL'));self.funcs={};self.uniforms={}
  def ef(n,r,args):x=getattr(self.E,n);x.restype=r;x.argtypes=args;return x
  d=ef('eglGetDisplay',P,[P])(None);a=I();b=I();assert ef('eglInitialize',U,[P,C.POINTER(I),C.POINTER(I)])(d,C.byref(a),C.byref(b))
  ef('eglBindAPI',U,[U])(0x30A2);cfg=P();nn=I();attrs=(I*15)(0x3033,1,0x3040,8,0x3024,8,0x3023,8,0x3022,8,0x3021,8,0x3025,24,0x3038)
  ef('eglChooseConfig',U,[P,C.POINTER(I),C.POINTER(P),I,C.POINTER(I)])(d,attrs,C.byref(cfg),1,C.byref(nn))
  ca=(I*7)(0x3098,3,0x30FB,3,0x30FD,1,0x3038);context=ef('eglCreateContext',P,[P,P,P,C.POINTER(I)])(d,cfg,None,ca)
  pa=(I*5)(0x3057,w,0x3056,h,0x3038);surface=ef('eglCreatePbufferSurface',P,[P,P,C.POINTER(I)])(d,cfg,pa)
  assert ef('eglMakeCurrent',U,[P,P,P,P])(d,surface,surface,context)
  specs={
  'glCreateShader':(U,[U]),'glShaderSource':(None,[U,I,C.POINTER(C.c_char_p),C.POINTER(I)]),'glCompileShader':(None,[U]),'glGetShaderiv':(None,[U,U,C.POINTER(I)]),'glGetShaderInfoLog':(None,[U,I,C.POINTER(I),C.c_char_p]),
  'glCreateProgram':(U,[]),'glAttachShader':(None,[U,U]),'glLinkProgram':(None,[U]),'glGetProgramiv':(None,[U,U,C.POINTER(I)]),'glGetProgramInfoLog':(None,[U,I,C.POINTER(I),C.c_char_p]),'glUseProgram':(None,[U]),
  'glGenVertexArrays':(None,[I,C.POINTER(U)]),'glBindVertexArray':(None,[U]),'glGenBuffers':(None,[I,C.POINTER(U)]),'glBindBuffer':(None,[U,U]),'glBufferData':(None,[U,C.c_size_t,P,U]),'glEnableVertexAttribArray':(None,[U]),'glVertexAttribPointer':(None,[U,I,U,B,I,P]),
  'glGetUniformLocation':(I,[U,C.c_char_p]),'glUniform1f':(None,[I,F]),'glUniform1i':(None,[I,I]),'glUniform3f':(None,[I,F,F,F]),'glUniformMatrix4fv':(None,[I,I,B,P]),'glViewport':(None,[I,I,I,I]),'glEnable':(None,[U]),'glDisable':(None,[U]),'glClearColor':(None,[F,F,F,F]),'glClear':(None,[U]),'glDrawArrays':(None,[U,I,I]),'glReadPixels':(None,[I,I,I,I,U,U,P]),'glPixelStorei':(None,[U,I]),'glFinish':(None,[]),'glBlendFunc':(None,[U,U]),'glDepthMask':(None,[B]),
  'glGenTextures':(None,[I,C.POINTER(U)]),'glBindTexture':(None,[U,U]),'glTexImage2D':(None,[U,I,I,I,I,I,U,U,P]),'glTexParameteri':(None,[U,U,I]),'glActiveTexture':(None,[U]),'glGenFramebuffers':(None,[I,C.POINTER(U)]),'glBindFramebuffer':(None,[U,U]),'glFramebufferTexture2D':(None,[U,U,U,U,I]),'glDrawBuffer':(None,[U]),'glReadBuffer':(None,[U]),'glColorMask':(None,[B,B,B,B]),'glGetString':(C.c_char_p,[U])}
  for n,(r,args) in specs.items():x=getattr(self.G,n);x.restype=r;x.argtypes=args;setattr(self,n,x)
  vao=U();self.glGenVertexArrays(1,C.byref(vao));self.blank=vao.value;self.glBindVertexArray(self.blank)
  self.main=self.program(VERT,FRAG);self.bg=self.program(BGV,BGF);self.depth=self.program(DEPTHV,DEPTHF);self.points=self.program(POINTV,POINTF)
  tex=U();self.glGenTextures(1,C.byref(tex));self.shadow=tex.value;self.glBindTexture(0x0DE1,self.shadow);self.glTexImage2D(0x0DE1,0,0x81A6,1024,1024,0,0x1902,0x1406,None)
  for par,val in [(0x2801,0x2600),(0x2800,0x2600),(0x2802,0x812F),(0x2803,0x812F)]:self.glTexParameteri(0x0DE1,par,val)
  fb=U();self.glGenFramebuffers(1,C.byref(fb));self.shadowfbo=fb.value;self.glBindFramebuffer(0x8D40,self.shadowfbo);self.glFramebufferTexture2D(0x8D40,0x8D00,0x0DE1,self.shadow,0);self.glDrawBuffer(0);self.glReadBuffer(0);self.glBindFramebuffer(0x8D40,0)
  self.arr=np.empty((h,w,4),np.uint8);self.meshes={};self.glEnable(0x0B71)
  print('Native renderer:',self.glGetString(0x1F01).decode(),flush=True)
 def program(self,vs,fs):
  shaders=[]
  for tp,s in [(0x8B31,vs),(0x8B30,fs)]:
   sh=self.glCreateShader(tp);p=C.c_char_p(s.encode());self.glShaderSource(sh,1,C.byref(p),None);self.glCompileShader(sh);ok=I();self.glGetShaderiv(sh,0x8B81,C.byref(ok))
   if not ok.value:
    e=C.create_string_buffer(8192);self.glGetShaderInfoLog(sh,8192,None,e);raise RuntimeError(e.value.decode())
   shaders.append(sh)
  pr=self.glCreateProgram()
  for s in shaders:self.glAttachShader(pr,s)
  self.glLinkProgram(pr);ok=I();self.glGetProgramiv(pr,0x8B82,C.byref(ok))
  if not ok.value:
   e=C.create_string_buffer(8192);self.glGetProgramInfoLog(pr,8192,None,e);raise RuntimeError(e.value.decode())
  return pr
 def use(self,p):self.current=p;self.glUseProgram(p)
 def uniform(self,n,v):
  k=(self.current,n)
  if k not in self.uniforms:self.uniforms[k]=self.glGetUniformLocation(self.current,n.encode())
  loc=self.uniforms[k]
  if loc<0:return
  if isinstance(v,np.ndarray):
   a=np.ascontiguousarray(v,np.float32);self.glUniformMatrix4fv(loc,1,1,a.ctypes.data)
  elif isinstance(v,(tuple,list)):self.glUniform3f(loc,*v)
  elif n in ['uMode','uShadows','uDepth']:self.glUniform1i(loc,int(v))
  else:self.glUniform1f(loc,float(v))
 def mesh(self,name,data=None):
  if name in self.meshes:return self.meshes[name]
  if data is None:
   if name=='cube':data=cube_data()
   elif name=='sphere':data=sphere_data()
   elif name=='round':data=sphere_data(48,28,.36)
   elif name=='torus':data=torus_data()
   elif name=='knot':data=torus_data(R=1.2,r=.24,nu=160,nv=24,knot=True)
   elif name=='ring':data=torus_data(R=1,r=.04,nu=120,nv=10)
  a=np.ascontiguousarray(data,np.float32);vao=U();vbo=U();self.glGenVertexArrays(1,C.byref(vao));self.glGenBuffers(1,C.byref(vbo));self.glBindVertexArray(vao.value);self.glBindBuffer(0x8892,vbo.value);self.glBufferData(0x8892,a.nbytes,a.ctypes.data,0x88E4)
  for j in range(3):self.glEnableVertexAttribArray(j);self.glVertexAttribPointer(j,3,0x1406,0,36,P(j*12))
  m=(vao.value,len(a),vbo.value);self.meshes[name]=m;return m
 def draw(self,m,primitive=4):self.glBindVertexArray(m[0]);self.glDrawArrays(primitive,0,m[1])
 def render(self,objects,eye=(5,4,7),target=(0,.5,0),fov=40,top=(.88,.90,.94),bottom=(.66,.73,.81),light=(-5,9,6),time=0,shadows=True,particles=None):
  lightmat=ortho(-13,13,-13,13,.1,50)@lookat(light,(0,0,0));view=lookat(eye,target);vp=perspective(fov,self.w/self.h)@view
  if shadows:
   self.glBindFramebuffer(0x8D40,self.shadowfbo);self.glViewport(0,0,1024,1024);self.glEnable(0x0B71);self.glDepthMask(1);self.glClear(0x00000100);self.glColorMask(0,0,0,0);self.use(self.depth)
   for mesh,mat,mode,tint in objects:
    if mode==5:continue
    self.uniform('uMVP',lightmat@mat);self.draw(mesh)
   self.glColorMask(1,1,1,1)
  self.glBindFramebuffer(0x8D40,0);self.glViewport(0,0,self.w,self.h);self.glDisable(0x0BE2);self.glClearColor(*bottom,1);self.glClear(0x4000|0x100);self.glDisable(0x0B71);self.use(self.bg);self.uniform('uTop',top);self.uniform('uBottom',bottom);self.uniform('uTime',time);self.glBindVertexArray(self.blank);self.glDrawArrays(4,0,3)
  self.glEnable(0x0B71);self.use(self.main);self.uniform('uVP',vp);self.uniform('uEye',eye);self.uniform('uLight',lightmat);self.uniform('uLightPos',light);self.uniform('uTime',time);self.uniform('uShadows',int(shadows));self.glActiveTexture(0x84C0);self.glBindTexture(0x0DE1,self.shadow);self.uniform('uDepth',0)
  for mesh,mat,mode,tint in objects:self.uniform('uModel',mat);self.uniform('uMode',mode);self.uniform('uTint',tint);self.draw(mesh)
  if particles:
   mesh,morph,size=particles;self.glEnable(0x8642);self.glEnable(0x0BE2);self.glBlendFunc(0x0302,1);self.glDepthMask(0);self.use(self.points);self.uniform('uVP',vp);self.uniform('uView',view);self.uniform('uTime',time);self.uniform('uMorph',morph);self.uniform('uSize',size);self.draw(mesh,0);self.glDepthMask(1);self.glDisable(0x0BE2)
  self.glPixelStorei(0x0D05,1);self.glReadPixels(0,0,self.w,self.h,0x80E1,0x1401,self.arr.ctypes.data)
  return self.arr[::-1].copy()
