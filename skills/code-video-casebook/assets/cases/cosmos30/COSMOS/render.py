"""COSMOS / Thirty coded worlds.
Native 1920x1080 procedural imagery, 30 fps delivery, 10 fps pose sampling.
No external visual assets. Requires numpy, Pillow, scipy, ffmpeg and Mesa EGL.
"""
from pathlib import Path
import os,sys,json,math,time,argparse,subprocess
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter,ImageChops
from scipy.ndimage import laplace,gaussian_filter
from glrender import Renderer
BASE=Path(__file__).resolve().parent
STORY=json.loads((BASE/'storyboard.json').read_text())
TAU=math.tau
RNG=np.random.default_rng(28092026)
FONT_EN='/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf'
FONT_EN_REG='/usr/share/fonts/opentype/inter/InterDisplay-Medium.otf'
FONT_ZH='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
FONT_ZH_REG='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
FONT_SERIF='/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
FONT_MONO='/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
FONTCACHE={}
LIGHT_SCENES={6,8,9,17,18,21,23,24}
ACCENTS=['#d1e8ff','#61d8ff','#76efbb','#77a7ff','#ffd19c','#80e7dc','#943c2c','#75d6ff','#173b4b','#af3824','#d9c4eb','#ffb959','#ffd34f','#5feced','#de9bff','#ffbd85','#182039','#253230','#195465','#96d9ff','#b6ff98','#18434c','#99bcff','#ab3c24','#76251f','#edcaa7','#a8c6d8','#ffc184','#bdd6ee','#d1e8ff']

def rgb(c):
    if isinstance(c,str):return tuple(bytes.fromhex(c.lstrip('#')))
    return tuple(c)
def mix(a,b,t):return tuple(int(x*(1-t)+y*t) for x,y in zip(rgb(a),rgb(b)))
def smooth(a,b,t):
    x=np.clip((t-a)/(b-a),0.,1.);return x*x*(3-2*x)
def rotate3(points,ay=0.,ax=0.,az=0.):
    p=np.array(points,dtype=float,copy=True)
    for i,j,a in [(0,2,ay),(1,2,ax),(0,1,az)]:
        u=p[:,i].copy();v=p[:,j].copy();p[:,i]=u*np.cos(a)-v*np.sin(a);p[:,j]=u*np.sin(a)+v*np.cos(a)
    return p

def project(points,cx=690,cy=316,scale=155,dist=7.,ay=0.,ax=.3,az=0.):
    q=rotate3(points,ay,ax,az);factor=dist/(dist+q[:,2]);xy=np.stack([cx+q[:,0]*scale*factor,cy-q[:,1]*scale*factor],1)
    return xy,q[:,2],factor

class Art:
    def __init__(self,image,scale=None):
        self.im=image;self.k=image.width/1280 if scale is None else scale;self.d=ImageDraw.Draw(image,'RGBA')
    def pt(self,p):return tuple(float(v)*self.k for v in p)
    def points(self,p):return [(float(x)*self.k,float(y)*self.k) for x,y in p]
    def line(self,p,fill,width=1):
        if len(p)>1:self.d.line(self.points(p),fill=fill,width=max(1,round(width*self.k)),joint='curve')
    def polygon(self,p,fill,outline=None,width=1):
        q=self.points(p);self.d.polygon(q,fill=fill)
        if outline:self.d.line(q+[q[0]],fill=outline,width=max(1,round(width*self.k)),joint='curve')
    def rect(self,b,fill,outline=None,width=1):self.d.rectangle(self.pt(b),fill,outline,width=max(1,round(width*self.k)))
    def ellipse(self,b,fill=None,outline=None,width=1):self.d.ellipse(self.pt(b),fill,outline,width=max(1,round(width*self.k)))
    def dot(self,x,y,r,c):self.ellipse((x-r,y-r,x+r,y+r),c)
    def arc(self,b,start,end,fill,width=1):self.d.arc(self.pt(b),start,end,fill=fill,width=max(1,round(width*self.k)))
    def font(self,size,kind='en'):
        path={'en':FONT_EN,'reg':FONT_EN_REG,'zh':FONT_ZH,'zhreg':FONT_ZH_REG,'mono':FONT_MONO,'serif':FONT_SERIF}[kind]
        key=(path,round(size*self.k),2 if kind in ['zh','zhreg','serif'] else 0)
        if key not in FONTCACHE:FONTCACHE[key]=ImageFont.truetype(key[0],max(key[1],1),index=key[2])
        return FONTCACHE[key]
    def text(self,p,s,size,fill,kind='en',anchor='lt',stroke=0,stroke_fill=None):
        self.d.text(self.pt(p),s,font=self.font(size,kind),fill=fill,anchor=anchor,stroke_width=round(stroke*self.k),stroke_fill=stroke_fill)
    def spaced(self,p,s,size,fill,spacing=3):
        x,y=p;f=self.font(size,'mono')
        for ch in s:
            self.d.text((x*self.k,y*self.k),ch,font=f,fill=fill,anchor='lt');x+=f.getlength(ch)/self.k+spacing
    def paste_layer(self,layer,xy=(0,0)):
        self.im.paste(layer,(round(xy[0]*self.k),round(xy[1]*self.k)),layer);self.d=ImageDraw.Draw(self.im,'RGBA')

# Deterministic authored geometry.
HYPER=np.array([[1 if (i>>b)&1 else -1 for b in range(4)] for i in range(16)],float)
HYPER_EDGES=[(i,j) for i in range(16) for j in range(i+1,16) if np.sum(HYPER[i]!=HYPER[j])==1]
CLOUD=RNG.normal(size=(1700,3));CLOUD/=np.linalg.norm(CLOUD,axis=1,keepdims=True);CLOUD*=RNG.random((1700,1))**(1/3)*2.5
WEB_NODES=RNG.normal(size=(34,3))*np.array([1.9,.60,.72])
WEB_EDGES=[]
for i,p in enumerate(WEB_NODES):
    ds=np.sum((WEB_NODES-p)**2,axis=1)
    for j in np.argsort(ds)[1:4]:
        if i<j:WEB_EDGES.append((i,int(j)))
SPIRAL_N=2300
sr=RNG.exponential(.95,SPIRAL_N);sr=np.clip(sr,.015,3.6)
sa=sr*1.8+RNG.integers(0,3,SPIRAL_N)*TAU/3+RNG.normal(0,.21,SPIRAL_N)
SPIRAL=np.stack([np.cos(sa)*sr,RNG.normal(0,.04,SPIRAL_N),np.sin(sa)*sr],1)
SPIRAL_LIGHT=RNG.random(SPIRAL_N)
VOX_POS=RNG.uniform(-1,1,(82,3));VOX_COL=RNG.random(82)
S4=RNG.normal(size=(2000,4));S4/=np.linalg.norm(S4,axis=1,keepdims=True)

class Mesh:
    def __init__(self,art,cx=690,cy=320,scale=140,ay=.55,ax=.45,dist=10.):
        self.art=art;self.cx=cx;self.cy=cy;self.scale=scale;self.ay=ay;self.ax=ax;self.dist=dist;self.faces=[]
    def face(self,pts,color,edge=None):
        p=np.array(pts,float);q=rotate3(p,self.ay,self.ax)
        n=np.cross(q[1]-q[0],q[2]-q[0]);ln=np.linalg.norm(n)
        if ln>0:n=n/ln
        ld=np.array([-.45,.8,-.65]);ld/=np.linalg.norm(ld)
        shade=.40+.60*max(0,float(np.dot(n,ld)))
        col=tuple(int(np.clip(c*shade,0,255)) for c in rgb(color)[:3])+(255,)
        f=self.dist/(self.dist+q[:,2]);xy=np.stack([self.cx+q[:,0]*self.scale*f,self.cy-q[:,1]*self.scale*f],1)
        self.faces.append((float(q[:,2].mean()),xy,col,edge))
    def box(self,center,size,color):
        x,y,z=center
        if np.isscalar(size):sx=sy=sz=size/2
        else:sx,sy,sz=np.array(size)/2
        p=np.array([[x+sx*a,y+sy*b,z+sz*c] for a,b,c in [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]])
        for face in [(0,3,2,1),(4,5,6,7),(0,4,7,3),(1,2,6,5),(3,7,6,2),(0,1,5,4)]:self.face(p[list(face)],color)
    def cylinder(self,a,b,r,color,sides=16):
        a=np.array(a,float);b=np.array(b,float);v=b-a;v/=np.linalg.norm(v)
        u=np.cross(v,[0,1,0] if abs(v[1])<.9 else [1,0,0]);u/=np.linalg.norm(u);w=np.cross(v,u)
        ang=np.linspace(0,TAU,sides,endpoint=False);ring=np.cos(ang)[:,None]*u*r+np.sin(ang)[:,None]*w*r
        pa=a+ring;pb=b+ring
        self.face(pa[::-1],color);self.face(pb,color)
        for i in range(sides):j=(i+1)%sides;self.face([pa[i],pa[j],pb[j],pb[i]],color)
    def ico(self,center,r,color,phase=0.):
        phi=(1+5**.5)/2
        v=np.array([[-1,phi,0],[1,phi,0],[-1,-phi,0],[1,-phi,0],[0,-1,phi],[0,1,phi],[0,-1,-phi],[0,1,-phi],[phi,0,-1],[phi,0,1],[-phi,0,-1],[-phi,0,1]],float)
        v/=np.linalg.norm(v,axis=1,keepdims=True);v=rotate3(v,phase,.14)*r+center
        faces=[(0,11,5),(0,5,1),(0,1,7),(0,7,10),(0,10,11),(1,5,9),(5,11,4),(11,10,2),(10,7,6),(7,1,8),(3,9,4),(3,4,2),(3,2,6),(3,6,8),(3,8,9),(4,9,5),(2,4,11),(6,2,10),(8,6,7),(9,8,1)]
        for f in faces:self.face(v[list(f)],color)
    def dome(self,center,r,color):
        for j in range(6):
            p0=j/6*math.pi/2;p1=(j+1)/6*math.pi/2
            for i in range(24):
                a=i/24*TAU;b=(i+1)/24*TAU
                pts=[[center[0]+r*math.cos(la)*math.cos(lo),center[1]+r*math.sin(la),center[2]+r*math.cos(la)*math.sin(lo)] for la,lo in [(p0,a),(p0,b),(p1,b),(p1,a)]]
                self.face(pts[::-1],color)
    def draw(self):
        for _,xy,col,edge in sorted(self.faces,key=lambda x:x[0],reverse=True):self.art.polygon(xy,col,edge)

RD_FRAMES=[];LIFE_FRAMES=[]
def prepare_fields():
    if RD_FRAMES:return
    rng=np.random.default_rng(510)
    n=210;a=np.ones((n,n),np.float32);b=np.zeros_like(a)
    for _ in range(23):
        x,y=rng.integers(15,n-15,2);a[y-5:y+5,x-5:x+5]=.3;b[y-5:y+5,x-5:x+5]=.9
    a+=rng.normal(0,.02,a.shape)
    for k in range(750):
        ab=a*b*b;a+=(.20*laplace(a)-ab+.034*(1-a));b+=(.10*laplace(b)+ab-(.062+.034)*b)
        if k>=270 and (k-270)%20==0:
            field=np.clip(b*3.,0,1);RD_FRAMES.append(field.copy())
    g=(rng.random((72,128))>.70)
    yy,xx=np.mgrid[:72,:128];mask=((xx-64)/60)**2+((yy-36)/32)**2<1
    g&=mask
    for k in range(24):
        LIFE_FRAMES.append(g.copy())
        nei=sum(np.roll(np.roll(g,i,0),j,1) for i in (-1,0,1) for j in (-1,0,1) if i or j)
        g=((nei==3)|(g&(nei==2)))&mask


def field_image(art,field,kind):
    if kind=='rd':
        f=np.clip(field,0,1)
        c0=np.array([6,27,40]);c1=np.array([47,199,197]);c2=np.array([249,183,106]);c3=np.array([248,245,218])
        a=np.clip(f*3.,0,1)[...,None];b=np.clip((f-.34)*3.,0,1)[...,None];c=np.clip((f-.72)*4.,0,1)[...,None]
        arr=c0*(1-a)+c1*a;arr=arr*(1-b)+c2*b;arr=arr*(1-c)+c3*c
        im=Image.fromarray(np.uint8(arr)).resize(art.im.size,Image.Resampling.BICUBIC)
    else:
        arr=np.zeros((*field.shape,3),np.uint8);arr[:]=[7,22,17];arr[field]=[127,236,125]
        im=Image.fromarray(arr).resize(art.im.size,Image.Resampling.NEAREST)
    art.im.paste(im,(0,0));art.d=ImageDraw.Draw(art.im,'RGBA')


def embellish(art,s,t):
    a=art;k=round(t*10);rng=np.random.default_rng(100+s)
    if s==0:
        a.spaced((64,151),'A CODED HISTORY OF EVERYTHING',12,(150,179,204,230),2)
        a.text((57,204),'BEFORE',158,(234,237,230,255))
        x=1055;y=303;r=4+2*math.exp(-t*3)
        for rr,alpha in [(95,5),(44,10),(19,22),(8,50)]:a.dot(x,y,rr,(153,211,245,alpha))
        a.dot(x,y,r,(245,246,230,255));a.line([(1035,303),(940,303)],(190,215,232,65),1)
        a.text((64,410),'NO CLOCK.  NO CERTAINTY.  A QUESTION.',15,(163,188,202,235),'mono')
    elif s==1:
        q=HYPER.copy();ang=.4+t*.48
        for i,j,theta in [(0,3,ang),(1,3,ang*.6),(1,2,.5)]:
            u=q[:,i].copy();v=q[:,j].copy();q[:,i]=u*np.cos(theta)-v*np.sin(theta);q[:,j]=u*np.sin(theta)+v*np.cos(theta)
        pts=q[:,:3]/(3.3-q[:,3,None])*2.5
        xy,z,f=project(pts,cx=841,cy=319,scale=135,ay=.4+t*.12,ax=.25)
        for i,j in HYPER_EDGES:
            col=(71,216,255,220) if (i^j)==8 else (147,160,224,150)
            a.line([xy[i],xy[j]],col,2.2)
        for p,zz in zip(xy,z):a.dot(*p,3.8,(211,246,255,240))
        a.text((64,179),'TIME',106,(25,63,88,255),stroke=1,stroke_fill=(99,210,238,255))
        a.text((65,300),'x  y  z  w',26,(170,228,246,255),'mono')
        a.spaced((67,353),'4D ROTATION / 3D PROJECTION',11,(139,185,216,230),1)
    elif s==2:
        a.text((66,176),'t = 0',211,(177,245,213,250),'mono')
        for j in range(10):
            y=178+j*24+int(rng.integers(-5,5));dx=int((hash((k,j))%31)-15)
            if (j+k)%3==0:a.rect((80+dx,y,650+dx,y+3),(9,27,23,250))
        a.text((817,230),'[ UNKNOWN ]',25,(236,93,111,255),'mono')
        for i,st in enumerate(['QUANTUM GRAVITY','INSUFFICIENT MODEL','NO VERIFIED ORIGIN']):a.text((820,279+i*31),st,13,(89,204,155,230),'mono')
        a.line([(66,454),(1160,454)],(97,229,165,80),1)
    elif s==3:
        a.text((64,142),'SPACE',69,(221,229,245,245))
        a.text((67,226),'EXPANDS',31,(143,174,234,235))
        a.text((70,285),'a(t) ~ exp(Ht)',18,(176,170,242,220),'mono')
        for j in range(3):a.line([(68,345+j*13),(181+j*17+k*2,345+j*13)],(133,188,255,130),2)
    elif s==4:
        for i,st in enumerate(['SPACE','MATTER','LIGHT']):a.text((68,151+i*70),st,53,(255,244,209,230))
        for j in range(8):
            aa=j*TAU/8+t*.07;rr=150+t*50
            x=750+math.cos(aa)*rr;y=310+math.sin(aa)*rr*.6
            a.line([(x,y),(x+math.cos(aa)*80,y+math.sin(aa)*48)],(255,238,193,85),2)
    elif s==5:
        prepare_fields();field_image(a,RD_FRAMES[min(k,23)],'rd')
        for j in range(36):
            x=(j*97+43+t*37*(j%3-1))%1200+40;y=(j*67+120+t*18)%350+140
            a.ellipse((x-10,y-10,x+10,y+10),None,(212,255,235,95),1.2)
        a.text((69,161),'10',126,(239,247,227,230));a.text((241,158),'10',43,(239,247,227,230));a.text((306,216),'K',58,(239,247,227,230))
    elif s==6:
        # Labels stay outside the clay objects, not on an atomic scale.
        a.text((227,179),'PROTON',18,(63,50,36,240),'mono');a.text((854,179),'NEUTRON',18,(63,50,36,240),'mono')
        a.line([(300,212),(427,270)],(89,75,52,115),1);a.line([(895,212),(845,265)],(89,75,52,115),1)
        a.text((253,436),'u + u + d',19,(69,61,43,225),'mono');a.text((885,436),'u + d + d',19,(69,61,43,225),'mono')
        for x in [72,1198]:
            a.line([(x,160),(x,475)],(66,65,45,80),1)
            for y in range(170,475,14):a.line([(x,y),(x+7,y)],(66,65,45,100),1)
    elif s==7:
        specs=[(285,295,'H',[(0,0)]),(650,295,'He',[(-17,-17),(17,-17),(-17,17),(17,17)]),(1010,295,'Li',[(0,0),(-30,0),(30,0),(-15,-26),(15,-26),(-15,26),(15,26)])]
        for h,(cx,cy,name,pts) in enumerate(specs):
            a.ellipse((cx-107,cy-107,cx+107,cy+107),None,(93,162,202,120),1)
            a.arc((cx-120,cy-120,cx+120,cy+120),int(t*30),int(t*30)+215,(121,226,247,190),2)
            for j,(dx,dy) in enumerate(pts):
                dd=1+.4*(1-smooth(0,.9,t));col=(246,123,81,255) if ((j<3) if len(pts)==7 else (j%2==0)) else (148,205,227,255)
                a.dot(cx+dx*dd,cy+dy*dd,22,col)
            a.text((cx,432),name,36,(216,237,238,255),'en',anchor='mt')
            a.text((cx-62,150),f'NUCLEUS / {h+1:02}',12,(98,197,224,200),'mono')
            a.line([(cx-95,cy),(cx-143,cy),(cx-143,cy-53)],(138,207,228,150),1)
        a.text((82,471),'p + n  ->  H / He / trace light nuclei',16,(193,224,233,200),'mono')
    elif s==8:
        cx=733;cy=331
        for i in range(3):
            ang=t*.55+i*TAU/3;rr=106+i*18
            x=cx+math.cos(ang)*rr;y=cy+math.sin(ang)*rr*.78
            a.dot(x+5,y+8,16,(0,33,35,50));a.dot(x,y,15,(248,237,199,255))
        for j in range(8):
            ang=j*TAU/8+.3;rr=80+((t*80+j*29)%180)
            a.line([(cx+math.cos(ang)*rr,cy+math.sin(ang)*rr),(cx+math.cos(ang)*(rr+34),cy+math.sin(ang)*(rr+34))],(253,246,215,170),2)
        a.text((70,157),'LET LIGHT',39,(31,71,77,245));a.text((70,205),'TRAVEL.',59,(31,71,77,245))
    elif s==9:
        a.text((70,141),'380,000',86,(41,74,75,230));a.text((74,240),'YEARS AFTER',15,(64,92,91,210),'mono')
        a.text((872,440),'CMB / ARTISTIC MAP',13,(63,72,68,230),'mono')
        for j,col in enumerate([(27,84,95),(49,128,140),(205,166,91),(225,76,37)]):a.rect((876+j*54,470,929+j*54,478),col+(255,))
    elif s==10:
        for j in range(5):
            pts=[]
            for x in np.linspace(-40,1320,140):
                y=398+j*22+42*math.sin(x/190+j*1.7+t*.045*(j+1))+22*math.sin(x/82+j)
                pts.append((x,y))
            a.polygon(pts+[(1320,630),(-40,630)],(13+j*4,10+j*3,23+j*6,255))
        a.text((81,183),'NO STARS',96,(186,170,205,175));a.text((86,295),'YET.',96,(186,170,205,175))
        for j in range(16):
            x=140+(j*179)%1000;y=133+(j*97)%260;a.line([(x-12,y),(x+15,y+1)],(114,95,135,25),1)
    elif s==11:
        m=Mesh(a,cx=727,cy=316,scale=134,ay=.3+t*.26,ax=-.32,dist=8)
        collapse=1-smooth(.0,1.7,t)
        for i,p in enumerate(VOX_POS):
            pos=p*(.55+collapse*2.1)
            pos[1]+=.25*math.sin(i*.6+t*1.2)*collapse
            col=mix('#803756','#ffcf78',VOX_COL[i])
            m.box(pos,.21+(1-collapse)*.04,col)
        m.draw()
        a.text((65,157),'BUILD',53,(250,221,184,235));a.text((65,218),'A STAR.',53,(250,221,184,235))
        if t>=1.7:
            for j in range(12):
                aa=j*TAU/12;rr=75+(t-1.7)*80;a.line([(727+math.cos(aa)*rr,316+math.sin(aa)*rr),(727+math.cos(aa)*(rr+55),316+math.sin(aa)*(rr+55))],(255,207,113,220),3)
    elif s==12:
        # Graphic rays are timed to anticipation, contact and settle poses.
        for j in range(14):
            ang=j*TAU/14+t*.13;rr=226+(7 if k%3==0 else 0)
            pts=[(748+math.cos(ang-.028)*rr,309+math.sin(ang-.028)*rr),(748+math.cos(ang)*(rr+48),309+math.sin(ang)*(rr+48)),(748+math.cos(ang+.028)*rr,309+math.sin(ang+.028)*rr)]
            a.polygon(pts,(255,174,28,245),(16,16,53,255),2)
        a.text((74,157),'ON.',109,(255,222,142,255))
        a.text((82,279),'FUSION / IGNITION',15,(242,189,137,235),'mono')
    elif s==13:
        q=CLOUD.copy();q[:,0]*=1.3;q[:,1]*=.66
        xy,z,f=project(q,cx=704,cy=318,scale=119,ay=t*.19,ax=.35)
        rion=.45+t*.95
        for i in np.argsort(z)[::-1]:
            d=np.linalg.norm(q[i]);ion=d<rion;alpha=180 if ion else 62
            col=(167,254,248,alpha) if ion else (16,116,139,alpha)
            a.dot(*xy[i],(1.5 if ion else 1.)*f[i],col)
        for j in range(3):
            cx=520+j*176;cy=315+(-1)**j*48;r=22+t*(24+j*7)
            a.ellipse((cx-r,cy-r*.67,cx+r,cy+r*.67),None,(68,232,240,140),1.5)
            a.dot(cx,cy,3.5,(224,255,239,255))
        a.text((75,150),'LIGHT CHANGES',37,(161,234,231,230));a.text((76,196),'EVERYTHING.',37,(161,234,231,230))
    elif s==14:
        xy,z,f=project(WEB_NODES,cx=700,cy=320,scale=105,ay=.25+t*.14,ax=.1,dist=9)
        for ii,(i,j) in enumerate(WEB_EDGES):
            p0=WEB_NODES[i];p1=WEB_NODES[j]
            for st in [-1,0,1]:
                u=np.linspace(0,1,20);pts=p0[None,:]*(1-u[:,None])+p1[None,:]*u[:,None]
                pts[:,1]+=.09*st*np.sin(u*math.pi)
                linep,_,_=project(pts,cx=700,cy=320,scale=105,ay=.25+t*.14,ax=.1,dist=9)
                a.line(linep,(144+st*15,93,216,140 if st==0 else 50),1.3)
        for p,ff in zip(xy,f):a.dot(*p,3.0*ff,(236,203,255,240))
        a.text((65,151),'GRAVITY',56,(225,192,248,250));a.text((69,222),'WRITES STRUCTURE.',17,(188,152,222,230),'mono')
    elif s==15:
        q=rotate3(SPIRAL,ay=t*.07);ro=np.array([0.,2.4,5.7]);fw=-ro/np.linalg.norm(ro);rt=np.array([1.,0.,0.]);up=np.cross(rt,fw);v=q-ro;z=v@fw;f=6.18/z;px=(v@rt)/z*1.35/1.03;py=.04+(v@up)/z*1.35/1.03;xy=np.stack([640+px*720,360-py*720],1)
        for i in range(SPIRAL_N):
            if SPIRAL_LIGHT[i]>.18:
                cc=mix('#a5b8fc','#ffcb8f',math.exp(-sr[i]*.8));a.dot(*xy[i],(.45+SPIRAL_LIGHT[i]*.8)*f[i],cc+(int(80+SPIRAL_LIGHT[i]*150),))
        a.text((67,140),'BILLIONS',69,(245,225,205,240));a.text((71,219),'OF SUNS.',30,(200,201,220,235))
    elif s==16:
        cx=750;cy=313;pts=[]
        for j in range(32):
            rr=(256 if j%2==0 else 131)*(1+.06*(k%3==0));ang=j*TAU/32-.1;pts.append((cx+math.cos(ang)*rr,cy+math.sin(ang)*rr*.76))
        a.polygon(pts,(254,238,190,255),(24,23,26,255),7)
        a.text((566,260),'BOOM',104,(29,28,36,255))
        for j,el in enumerate(['C','O','Fe']):
            ang=-2.6+j*1.85;rr=215+(t*.7%1)*25;x=cx+math.cos(ang)*rr;y=cy+math.sin(ang)*rr*.68
            a.text((x,y),el,35,(245,239,208,255),stroke=3,stroke_fill=(25,23,25,255))
        a.text((68,149),'STELLAR',41,(29,27,32,255));a.text((69,199),'ALCHEMY',41,(29,27,32,255))
    elif s==17:
        # Rotated printed cards with contact shadows and discrete assembly.
        colors=['#d44835','#e4ad47','#356c6a'];els=['C','O','Fe'];nums=['6','8','26'];names=['CARBON','OXYGEN','IRON']
        for j in range(3):
            w,h=254,291;card=Image.new('RGBA',(round(w*a.k),round(h*a.k)),(0,0,0,0));ca=Art(card,scale=a.k)
            ca.rect((0,0,w,h),rgb(colors[j])+(255,));ca.rect((12,12,w-12,h-12),None,(242,230,190,140),1)
            ca.text((24,24),nums[j],25,(249,235,204,255),'mono');ca.text((24,87),els[j],99,(247,236,207,255));ca.text((27,232),names[j],20,(247,236,207,255),'mono')
            angle=[9,-6,7][j]+(1 if k%6<3 else -1);card=card.rotate(angle,resample=Image.Resampling.BICUBIC,expand=True)
            x=200+j*297;yy=161+(-1)**j*12+(2 if k%6<3 else -2)
            sh=Image.new('RGBA',card.size,(0,0,0,0));sh.putalpha(card.getchannel('A').point(lambda v:int(v*.17)));a.im.paste(sh,(round((x+8)*a.k),round((yy+12)*a.k)),sh);a.im.paste(card,(round(x*a.k),round(yy*a.k)),card);a.d=ImageDraw.Draw(a.im,'RGBA')
        a.text((60,140),'STAR',45,(43,60,52,235));a.text((60,189),'DUST',45,(43,60,52,235))
    elif s==18:
        # Low polygon planets are actual shaded icosahedral meshes.
        for r in [1.1,1.8,2.65]:
            ang=np.linspace(0,TAU,130);p=np.stack([np.cos(ang)*r,np.zeros_like(ang)-.2,np.sin(ang)*r],1)
            xy,_,_=project(p,cx=731,cy=320,scale=126,ay=.24,ax=-.88,dist=10);a.line(xy,(43,106,114,100),1.4)
        m=Mesh(a,cx=731,cy=320,scale=126,ay=.24,ax=-.88,dist=10)
        m.ico(np.array([0,0,0]),.55,'#ffb65e',t*.08)
        for j,(r,col) in enumerate([(1.1,'#a96441'),(1.8,'#317f91'),(2.65,'#d5bb88')]):
            ang=j*2.1+t*(.42-j*.08);m.ico(np.array([math.cos(ang)*r,0,math.sin(ang)*r]),.13+j*.07,col,t*.2)
        for i in range(34):
            ang=i*2.399+t*.1;rad=1.4+.55*math.sin(i*7.1);m.ico(np.array([math.cos(ang)*rad,-.03,math.sin(ang)*rad]),.028,'#b19172')
        m.draw();a.text((66,157),'4.6',104,(30,75,81,250));a.text((71,272),'BILLION YEARS AGO',14,(42,90,93,235),'mono')
    elif s==19:
        a.text((70,151),'HOME.',83,(207,231,240,245));a.text((73,247),'ONE SMALL WORLD.',14,(151,189,211,235),'mono')
        a.arc((406,88,1094,531),-24,28,(149,199,218,140),1)
        a.line([(1123,318),(1068,318)],(133,201,230,150),1);a.text((1093,345),'EARTH',14,(161,211,233,230),'mono')
    elif s==20:
        prepare_fields();field_image(a,LIFE_FRAMES[min(k,23)],'life')
        a.rect((0,0,1280,720),(2,12,10,25))
        for x in range(0,1280,10):a.line([(x,80),(x,541)],(2,10,8,75),1)
        for y in range(90,550,10):a.line([(0,y),(1280,y)],(2,10,8,75),1)
        a.text((69,171),'LIFE',141,(212,255,191,255),stroke=2,stroke_fill=(9,35,20,255))
        a.text((75,340),f'CELLULAR AUTOMATON / GENERATION {k:02}',14,(180,232,163,255),'mono')
        a.text((76,377),'SIMPLE RULES. COMPLEX WORLDS.',14,(180,232,163,230),'mono')
    elif s==21:
        m=Mesh(a,cx=814,cy=385,scale=115,ay=.65+t*.04,ax=-.48,dist=16)
        m.box((0,-.60,0),(3.7,.27,3.0),'#819184');m.box((0,-.4,0),(3.5,.15,2.8),'#d0d5b1')
        for i in range(3):m.box((-1.4-i*.2,-.58-i*.09,.85),(.65,.18,.85),'#a8b29b')
        m.cylinder((.35,-.30,.1),(.35,.37,.1),.66,'#e9e2c8',24);m.dome((.35,.37,.1),.69,'#f2ead6')
        m.box((.38,.88,.11),(.09,.62,1.23),'#475a58')
        # Telescope on its own pedestal; no geometry is placed through the dome.
        m.cylinder((-.94,-.3,-.30),(-.94,.20,-.30),.10,'#748788',12)
        tilt=.30+round(t/.3)*.015
        m.cylinder((-1.02,.23,-.36),(-1.53,.63+tilt,-.60),.13,'#f0e9cf',16)
        m.cylinder((-1.52,.63+tilt,-.60),(-1.58,.69+tilt,-.63),.15,'#255a64',16)
        for xx in [-.8,.38]:
            m.box((xx,-.01,1.02),(.76,.08,.65),'#255b6c')
            for rr in range(4):m.box((xx-.3+rr*.2,.04,1.02),(.025,.015,.58),'#6fa2a5')
        m.draw()
        a.text((65,152),'LOOK UP.',85,(33,67,71,250));a.text((71,255),'ASK WHERE WE CAME FROM.',14,(53,91,89,245),'mono')
        for j in range(5):
            x=723+j*85;y=145+(j*53)%97;a.line([(x-4,y),(x+4,y)],(89,137,134,170),1);a.line([(x,y-4),(x,y+4)],(89,137,134,170),1)
    elif s==22:
        # Three spatial coordinates plus time, projected as stacked worldline slices.
        ay=.24+t*.075;ax=.62
        for j in range(12):
            tm=j/11;r=.28+tm**1.8*1.64;ang=np.linspace(0,TAU,110)
            pts=np.stack([r*np.cos(ang),(tm-.5)*3.05*np.ones_like(ang),r*np.sin(ang)],1)
            xy,_,_=project(pts,cx=825,cy=325,scale=114,ay=ay,ax=ax,dist=8)
            a.line(xy,(145,185,255,170 if j==7 else 56),2 if j==7 else 1)
        for j in range(16):
            aa=j*TAU/16;tm=np.linspace(0,1,70);r=.28+tm**1.8*1.64
            pts=np.stack([r*np.cos(aa+tm*.18), (tm-.5)*3.05,r*np.sin(aa+tm*.18)],1)
            xy,_,_=project(pts,cx=825,cy=325,scale=114,ay=ay,ax=ax,dist=8);a.line(xy,(142,191,251,170),1.6)
        a.text((66,166),'13.8',110,(217,231,248,250));a.text((72,286),'BILLION YEARS',20,(159,187,227,240),'mono')
        a.text((75,365),'3 SPACE + 1 TIME',16,(124,164,220,220),'mono')
        a.line([(1148,456),(1148,183)],(167,198,241,160),1.3);a.polygon([(1143,190),(1148,180),(1153,190)],(167,198,241,220));a.text((1163,222),'t',24,(185,215,249,245),'mono')
    elif s==23:
        x0,y0=513,472;x1,y1=1169,146
        a.line([(x0,y1),(x0,y0),(x1,y0)],(55,69,62,210),2)
        for j in range(1,5):a.line([(x0,y0-j*63),(x1,y0-j*63)],(41,82,75,36),1)
        xs=np.linspace(0,1,140);ys=(np.exp(xs*2.3)-1)/(np.exp(2.3)-1)
        end=.72+.28*smooth(0,2.1,t);valid=xs<=end
        pts=np.stack([x0+xs[valid]*(x1-x0),y0-ys[valid]*(y0-y1)],1);a.line(pts,(176,66,37,250),4)
        alt=np.stack([x0+xs*(x1-x0),y0-xs*.43*(y0-y1)],1)
        for j in range(0,len(alt)-1,8):a.line(alt[j:j+4],(67,122,117,130),1.8)
        if len(pts):a.dot(*pts[-1],6,(189,57,31,255))
        a.text((529,143),'a(t)',20,(68,81,73,245),'mono');a.text((1058,487),'FUTURE',14,(68,81,73,230),'mono')
        a.text((68,158),'FARTHER.',68,(47,72,67,250));a.text((68,239),'FASTER?',68,(47,72,67,250))
        a.text((72,350),'A CONDITIONAL SCENARIO',13,(133,63,44,240),'mono')
    elif s==24:
        a.text((77,159),'EVEN',59,(80,39,30,240));a.text((75,230),'SUNS',102,(80,39,30,245));a.text((80,350),'GROW OLD.',27,(105,48,35,235),'mono')
        a.text((753,289),'SUN',66,(239,202,156,205))
        for j in range(4):
            rr=167+t*35+j*11
            a.arc((780-rr,328-rr*.92,780+rr,328+rr*.92),j*60+int(t*12),j*60+int(t*12)+37,(107,27,21,85),1)
    elif s==25:
        # These coordinates match the analytic camera in the GLSL scene.
        ro=np.array([.20*math.sin(t*.25),.35,4.5]);target=np.array([0,.02,0]);fw=target-ro;fw/=np.linalg.norm(fw);rt=np.cross(fw,[0,1,0]);rt/=np.linalg.norm(rt);up=np.cross(rt,fw)
        for j in range(6):
            ang=j*2.39996+t*.24;ce=np.array([(j-2.5)*.59,.35+math.sin(ang)*.24,math.cos(ang)*.43]);v=ce-ro;z=np.dot(v,fw)
            px=.15+(np.dot(v,rt)/z)*1.8/1.25;py=.07+(np.dot(v,up)/z)*1.8/1.25;x=640+px*720;y=360-py*720
            rr=(.16+(j%2)*.075)/z*1.8/1.25*720
            a.line([(x,141),(x,y-rr)],(191,202,210,140),1.3)
            alive=1-smooth(j*.30+.4,j*.30+1.1,t)
            a.text((x,451),'ON' if alive>.5 else 'OFF',12,(int(125+80*alive),int(130+50*alive),int(138+12*alive),220),'mono',anchor='mt')
        a.line([(355,141),(1130,141)],(187,205,216,120),1.2)
        a.text((70,160),'THE LAST',41,(230,211,184,245));a.text((71,211),'LIGHTS.',41,(230,211,184,245))
    elif s==26:
        a.text((65,151),'REMAINS',62,(190,208,216,235));a.text((70,229),'A LONG, COLD AGE.',16,(141,168,183,230),'mono')
        for j in range(5):
            x=156+j*21;a.line([(x,310),(x,320+(j%3)*22)],(143,166,183,80),2)
    elif s==27:
        a.text((67,153),'NOT EVEN',47,(248,208,163,245));a.text((68,212),'BLACK HOLES.',38,(248,208,163,245))
        a.text((74,282),'HAWKING RADIATION',13,(210,169,123,220),'mono')
        for j in range(32):
            aa=j*2.39996;rr=140+((j*7+t*47)%140);x=779+math.cos(aa)*rr;y=316+math.sin(aa)*rr*.75
            if y<485:a.dot(x,y,.9+(j%3)*.25,(255,202,138,int(90+60*t/2.4)))
    elif s==28:
        q=S4.copy();ang=.2+t*.6
        for i,j,theta in [(0,3,ang),(1,3,ang*.6),(2,3,ang*.2)]:
            u=q[:,i].copy();v=q[:,j].copy();q[:,i]=u*np.cos(theta)-v*np.sin(theta);q[:,j]=u*np.sin(theta)+v*np.cos(theta)
        w=-.6+t*.48;sel=np.abs(q[:,3]-w)<.18
        pts=q[sel,:3]*1.9;xy,z,f=project(pts,cx=830,cy=322,scale=161,ay=.4,ax=.3)
        for i in np.argsort(z)[::-1]:
            col=mix('#628ea6','#e1bf91',.5+.5*pts[i,0]/2);a.dot(*xy[i],1.6*f[i],col+(200,))
        for j in range(5):
            ww=-.8+j*.4;r=math.sqrt(max(0,1-ww*ww))*1.9;aa=np.linspace(0,TAU,100)
            ring=np.stack([r*np.cos(aa),r*np.sin(aa),np.ones_like(aa)*ww],1);xyp,_,_=project(ring,cx=830,cy=322,scale=161,ay=.4,ax=.3)
            a.line(xyp,(130,167,196,60),1)
        a.text((66,157),'LESS',67,(211,221,224,235));a.text((68,236),'DIFFERENCE.',42,(211,221,224,235));a.text((72,312),'4D SLICES / w = c',15,(150,177,200,220),'mono')
    elif s==29:
        a.spaced((64,151),'THE STORY RETURNS TO A QUESTION',12,(150,179,204,230),1.6)
        a.text((58,204),'AFTER',158,(234,237,230,255))
        for j in range(5):
            fade=max(0.,1-t/1.8);pts=[]
            for x in np.linspace(720,1055,100):
                y=303+math.sin((x-720)/100+j*.6)*50*fade*((1055-x)/335)
                pts.append((x,y))
            a.line(pts,(160,208,235,int(72*fade)),1.1)
        for rr,alpha in [(95,5),(44,10),(19,22),(8,50)]:a.dot(1055,303,rr,(153,211,245,alpha))
        a.dot(1055,303,4,(245,246,230,255))
        a.text((66,410),'A POSSIBLE END. NOT A CERTAINTY.',15,(163,188,202,235),'mono')


def overlay(art,s,t):
    a=art;meta=STORY[s];light=s in LIGHT_SCENES;fg=(30,47,51,255) if light else (239,240,230,255);muted=(67,83,82,240) if light else (177,193,205,245);accent=rgb(ACCENTS[s])+(255,)
    # Dedicated lower reading area, never fully opaque or completely empty.
    ov=Image.new('RGBA',a.im.size,(0,0,0,0));arr=np.zeros((a.im.height,1,4),np.uint8)
    ys=np.arange(a.im.height)/a.k
    al=np.clip((ys-460)/170,0,1)*(.94 if not light else .78)
    base=(236,232,215) if light else (5,10,16)
    arr[:,:,0]=base[0];arr[:,:,1]=base[1];arr[:,:,2]=base[2];arr[:,:,3]=(al*255).astype(np.uint8)[:,None]
    strip=Image.fromarray(arr,'RGBA').resize(a.im.size);a.im.paste(strip,(0,0),strip);a.d=ImageDraw.Draw(a.im,'RGBA')
    a.line([(60,46),(1220,46)],fg[:3]+(35,),1)
    a.spaced((62,24),'COSMOS / 30 CODED WORLDS',10,muted,1.4)
    a.text((62,66),meta['style'],16,fg,'zh')
    a.text((1218,64),meta['dimension'],15,accent,'mono',anchor='rt')
    a.text((1218,24),f'{s+1:02} / 30',13,muted,'mono',anchor='rt')
    chapter='I / ORIGIN' if s<10 else ('II / STRUCTURE' if s<20 else 'III / AFTERLIGHT')
    a.spaced((62,528),meta['english'],11,accent,2)
    titlex=62+(-9 if t<.1 else 0)
    a.text((titlex,555),meta['title'],43,fg,'zh')
    a.text((65,614),meta['caption'],22,fg,'zhreg')
    a.text((1216,554),meta['epoch'],14,muted,'zhreg',anchor='rt')
    a.text((1216,586),meta['status'],12,accent,'zhreg',anchor='rt')
    a.text((1216,623),chapter,11,muted,'mono',anchor='rt')
    for i in range(30):
        xx=62+i*38.45
        alpha=200 if i<s else (110 if i==s else 34)
        a.line([(xx,678),(xx+30,678)],accent[:3]+(alpha,),2 if i<=s else 1)
        if i==s:a.line([(xx,678),(xx+30*min(1,t/2.3),678)],fg,3)
    # Eight beats per shot; small markers echo the percussion without full-frame flashes.
    bt=int(t/.3+1e-6)
    for j in range(8):a.rect((1134+j*10,702,1138+j*10,705),accent[:3]+(200 if j==bt else 32,))
    a.text((63,696),'STOP-MOTION / PROCEDURAL CINEMA',9,muted,'mono')


def make_frame(renderer,s,t):
    arr=renderer.render(s,t,math.exp(-((t/.3)%1)*8))
    im=Image.fromarray(arr).convert('RGB');art=Art(im);embellish(art,s,t);overlay(art,s,t)
    return im.convert('RGB')


def preview(w=640,h=360):
    r=Renderer(w,h,(BASE/'cosmos.frag').read_text());sheet=Image.new('RGB',(w*5,h*6))
    out=BASE/'stills';out.mkdir(exist_ok=True)
    for s in range(30):
        im=make_frame(r,s,1.2);im.save(out/f'{s:02}.jpg',quality=94);sheet.paste(im,((s%5)*w,(s//5)*h));print('preview',s,flush=True)
    sheet.save(BASE/'contact_sheet.jpg',quality=92)


def render_video(w=1920,h=1080,start=0,end=30):
    r=Renderer(w,h,(BASE/'cosmos.frag').read_text());out=BASE/'clips';out.mkdir(exist_ok=True)
    for s in range(start,end):
        path=out/f'{s:02}.mp4';t0=time.time()
        cmd=['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{w}x{h}','-r','30','-i','-','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-threads','2','-movflags','+faststart',str(path)]
        proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
        try:
            for pose in range(24):
                im=make_frame(r,s,pose/10);b=im.tobytes()
                for _ in range(3):proc.stdin.write(b)
            proc.stdin.close();rc=proc.wait()
            if rc:raise RuntimeError(f'ffmpeg failed: {rc}')
        except Exception:
            proc.kill();raise
        print(f'shot {s+1:02}/30 done {time.time()-t0:.2f}s {path.stat().st_size/1e6:.2f}MB',flush=True)

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--preview',action='store_true');p.add_argument('--width',type=int,default=1920);p.add_argument('--height',type=int,default=1080);p.add_argument('--start',type=int,default=0);p.add_argument('--end',type=int,default=30);args=p.parse_args()
    if args.preview:preview(640,360)
    else:render_video(args.width,args.height,args.start,args.end)
