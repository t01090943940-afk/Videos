#version 330 core
uniform vec2 uRes;
uniform float uTime;
uniform int uScene;
uniform float uBeat;
out vec4 frag;
const float PI=3.14159265359;
float hash(float n){return fract(sin(n)*43758.5453123);}
float h2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float h3(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float f=0.,a=.5;for(int j=0;j<4;j++){f+=a*noise(p);p=p*2.04+17.2;a*=.5;}return f;}
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
float line(vec2 p,vec2 a,vec2 b){vec2 q=p-a,v=b-a;return length(q-v*clamp(dot(q,v)/dot(v,v),0.,1.));}
vec3 stars(vec2 p,float strength){vec3 c=vec3(0);for(int i=0;i<3;i++){float sc=80.+float(i)*83.;vec2 cell=floor(p*sc),q=fract(p*sc)-.5;float seed=h2(cell+float(i)*37.);vec2 off=vec2(hash(seed*223.),hash(seed*774.))*.55-.275;float rad=length(q-off);float v=pow(max(0.,1.-rad*10.),3.)*step(.985-float(i)*.004,seed);c+=v*mix(vec3(.35,.65,1),vec3(1,.8,.54),hash(seed*90.))*strength;}return c;}
vec3 night(vec2 p){return vec3(.009,.013,.025)+vec3(.018,.035,.065)*exp(-length(p-vec2(.25,.12))*2.5)+stars(p,1.0);}
float sphereHit(vec3 ro,vec3 rd,vec3 ce,float r){vec3 oc=ro-ce;float b=dot(oc,rd),c=dot(oc,oc)-r*r,h=b*b-c;return h<0.?1e5:-b-sqrt(h);}
vec3 envcol(vec3 v){float s1=pow(max(dot(v,normalize(vec3(-1,1,1))),0.),9.);float s2=pow(max(dot(v,normalize(vec3(1,.3,-1))),0.),34.);return vec3(.15,.19,.26)+vec3(2.9,2.3,1.6)*s1+vec3(.25,1.2,1.7)*s2+vec3(.2)*pow(max(v.y,0.),3.);}
vec3 centerOf(int i,int sc,float t){float a=float(i)*2.39996+t*.24;
 if(sc==6){int cluster=i/3;float k=float(i%3);float gap=mix(1.35,.54,smoothstep(0.,1.45,t));return vec3((float(cluster)*2.-1.)*gap+cos(k*2.094+t*.45)*.26,.20+sin(k*2.094+t*.45)*.26,float(cluster)*.08+sin(k*2.094+t*.3)*.24);}
 if(sc==25){return vec3((float(i)-2.5)*.59, .35+sin(a)*.24,cos(a)*.43);}
 if(sc==26){return vec3(cos(a)*(.72+float(i%2)*.42),sin(a*1.5)*.66, sin(a)*.7);}
 return vec3(0,.08,0);
}
vec3 sphereScene(vec2 p,int sc,float t){vec3 ro=vec3(0,.35,4.5),target=vec3(0,.02,0);ro.x=.20*sin(t*.25);vec3 fw=normalize(target-ro),rt=normalize(cross(fw,vec3(0,1,0))),up=cross(rt,fw);vec3 rd=normalize(fw*1.8+rt*(p.x-.15)*1.25+up*(p.y-.07)*1.25);
 int count=sc==6?6:(sc==25?6:(sc==26?5:1));float best=1e5;int hit=-1;vec3 ce=vec3(0);float radius=0.;
 for(int i=0;i<6;i++){if(i>=count)break;vec3 cp=centerOf(i,sc,t);float r=sc==6?.335:(sc==25?.16+float(i%2)*.075:(sc==26?.36+float(i%3)*.06:.92));float d=sphereHit(ro,rd,cp,r);if(d>0.&&d<best){best=d;hit=i;ce=cp;radius=r;}}
 vec3 bg=night(p);
 if(sc==6){bg=vec3(.78,.75,.65)*(.91-.10*p.y);float td=(-.58-ro.y)/rd.y;if(td>0.){vec3 gp=ro+td*rd;float sh=0.;for(int i=0;i<6;i++){vec3 cp=centerOf(i,sc,t);sh+=exp(-dot(gp.xz-cp.xz,gp.xz-cp.xz)*6.)*.1;}bg-=sh;bg+=vec3(.017)*noise(gp*55.);}}
 if(sc==12)bg=vec3(.07,.075,.25)+vec3(.14,.02,.10)*max(0.,1.-length(p));
 if(sc==19)bg+=vec3(.03,.12,.21)*exp(-pow(length(p-vec2(.15,.03))-.37,2.)*180.);
 if(hit<0)return bg;
 vec3 pos=ro+best*rd,n=normalize(pos-ce),base=vec3(.8,.35,.12);float rough=.3,metal=0.;vec3 ld=normalize(vec3(-.6,.7,1.));
 if(sc==6){base=hit%3==0?vec3(.82,.16,.095):(hit%3==1?vec3(.075,.40,.64):vec3(.97,.68,.20));float grain=noise(pos*90.);float fp=sin(60.*length(pos.xy-ce.xy)+noise(pos*12.)*5.);n=normalize(n+vec3(grain-.5,fp*.17,0)*.07);base*=.94+.08*grain;rough=.8;}
 if(sc==12){float nd=dot(n,ld);float band=nd>.65?1.:(nd>.1?.71:.31);float ed=dot(n,-rd);vec3 c=vec3(1.,.49,.06)*band;if(ed<.055)c=vec3(.02,.02,.075);c+=vec3(1,.7,.13)*step(.91,nd)*.18;return c;}
 if(sc==19){float lat=asin(n.y);float lon=atan(n.z,n.x)+t*.16;vec3 q=vec3(cos(lon)*cos(lat),sin(lat),sin(lon)*cos(lat));float f=fbm(q*3.1+4.5)+.16*noise(q*8.);float land=smoothstep(.55,.585,f);base=mix(vec3(.01,.085,.20),mix(vec3(.17,.22,.09),vec3(.38,.30,.14),noise(q*14.)),land);float clouds=smoothstep(.57,.69,fbm(q*6.+vec3(t*.045,0,0)));base=mix(base,vec3(.92,.94,.92),clouds*.9);base=mix(base,vec3(.82,.87,.85),smoothstep(.88,.97,abs(n.y)));rough=.28;}
 if(sc==25){float alive=1.-smoothstep(float(hit)*.30+.4,float(hit)*.30+1.1,t);base=mix(vec3(.055,.067,.08),vec3(1.,.56,.17),alive);metal=.85;rough=.15;}
 if(sc==26){base=mix(vec3(.28,.32,.35),vec3(.45,.30,.12),float(hit%2));float gr=noise(pos*32.);n=normalize(n+(vec3(noise(pos*18.),noise(pos*18.+7.),noise(pos*18.+18.))-.5)*.1);base*=.7+.4*gr;metal=.9;rough=.22;}
 float diff=max(dot(n,ld),0.);float shadow=1.;for(int j=0;j<6;j++){if(j>=count)break;if(j==hit)continue;float tr=sphereHit(pos+n*.02,ld,centerOf(j,sc,t),sc==6?.31:.3);if(tr>0&&tr<7.)shadow*=.25;}
 vec3 c=base*(.16+diff*.83*shadow);vec3 halfv=normalize(ld-rd);float spec=pow(max(dot(n,halfv),0.),mix(100.,12.,rough));c+=spec*mix(vec3(.3),base,metal)*shadow;float rim=pow(1.-max(dot(n,-rd),0.),3.);c+=rim*vec3(.10,.28,.43)*.28;
 if(metal>.5)c=mix(c,envcol(reflect(rd,n))*base,.73);
 if(sc==19){c+=rim*vec3(.025,.32,.65);float cities=step(.74,noise(pos*110.))*step(.57,fbm(pos*3.1+4.5));c+=vec3(.8,.46,.12)*cities*(1.-smoothstep(-.1,.15,dot(n,ld)))*.15;}
 if(sc==25){float alive=1.-smoothstep(float(hit)*.30+.4,float(hit)*.30+1.1,t);c+=base*alive*.7;}
 return c;
}
vec3 galaxy(vec2 p,float t){vec3 ro=vec3(0,2.4,5.7),fw=normalize(-ro),rt=vec3(1,0,0),up=cross(rt,fw);vec3 rd=normalize(fw*1.35+rt*p.x*1.03+up*(p.y-.04)*1.03);vec3 col=night(p)*.5;
 for(int i=0;i<24;i++){float mid=-ro.y/min(rd.y,-.015);float d=mid-.5+float(i)*.043;vec3 q=ro+rd*d;q.xz=rot(t*.07)*q.xz;float r=length(q.xz);float ang=atan(q.z,q.x);float arm=pow(.5+.5*cos(ang*3.-r*5.4),4.);float fl=fbm(q*5.);float den=exp(-abs(q.y)*24.)*exp(-r*.7)*(arm*.8+.09)*(fl*.7+.4);float core=exp(-length(q*vec3(1,2.2,1))*4.);col+=mix(vec3(.22,.39,.82),vec3(1.7,.58,.21),pow(max(1.-r/3.,0.),2.))*den*.27;col+=vec3(1.5,1.05,.56)*core*.08;}
 col+=stars(p*1.4,1.3)*(.3+pow(max(0.,1.-length(p)*1.5),2.));return col;
}
vec3 blackhole(vec2 p,float t){p-=vec2(.12,.06);p*=.62;float shrink=1.-.20*smoothstep(0.,2.4,t);p/=shrink;float r=length(p);vec2 lens=p*(1.+.022/max(r*r,.016));vec3 col=night(lens)*.8;float horizon=.125;float photon=exp(-pow((r-horizon*1.07)/.004,2.));col+=vec3(1.6,.74,.26)*photon;
 float ring=length(vec2(p.x,p.y*4.8));float band=exp(-pow((ring-.24)/.079,2.));float ang=atan(p.y*4.8,p.x);float tex=.65+.35*sin(ring*370.-t*5.+sin(ang*16.));float asym=.65+.65*smoothstep(.3,-.3,p.x);vec3 disk=vec3(1.4,.40,.10)*band*tex*asym;disk+=vec3(1.1,.95,.56)*exp(-pow((ring-.16)/.018,2.));
 float warped=length(vec2(p.x,p.y*1.3));float back=exp(-pow((warped-.17)/.02,2.))*smoothstep(-.04,.09,p.y)*(.7+.3*sin(atan(p.y,p.x)*47.+t*4.));col+=disk;col+=vec3(1.,.6,.22)*back;col+=vec3(1.,.28,.07)*exp(-r*8.)*.10;
 if(r<horizon)col=vec3(.0008,.001,.002);float glow=exp(-pow((r-horizon)/.03,2.))*.1;col+=vec3(1,.4,.1)*glow;return col;
}
void main(){vec2 uv=gl_FragCoord.xy/uRes;vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;float t=uTime;int s=uScene;vec3 c=night(p);
 if(s==0){c=vec3(.007,.009,.013)+vec3(.03,.043,.056)*exp(-length(p-vec2(.38,.06))*5.);}
 if(s==1){c=vec3(.006,.014,.03)+vec3(.014,.095,.18)*exp(-length(p-vec2(.2,.04))*3.);c+=stars(p,.35);}
 if(s==2){float row=floor((p.y+.5)*80.);float scan=step(.78,hash(row+floor(t*10.)));float cols=step(.7,hash(floor(p.x*20.)+row*6.+floor(t*10.)));c=vec3(.012,.025,.026)+vec3(.03,.24,.18)*scan*cols*.30;float b=step(.986,hash(row+floor(t*10.)*5.));c+=vec3(.7,.05,.19)*b*step(p.x,hash(row)-.1);c*=.85+.15*sin(gl_FragCoord.y*PI);}
 if(s==3){vec2 q=p-vec2(.16,.06);q=rot(.16+t*.06)*q;float a=atan(q.y,q.x),r=length(q);float z=1./max(r,.02);float rings=pow(max(.0,cos(log(max(r,.008))*20.-t*7.)),35.);float spokes=pow(abs(cos(a*14.+t*.3)),75.);vec3 col=mix(vec3(.08,.30,.95),vec3(.93,.16,.41),.5+.5*sin(log(r+.03)*2.));c=vec3(.005,.009,.025)+col*(rings*.55+spokes*.45)*smoothstep(.008,.045,r);c+=vec3(.7,.85,1)*exp(-r*30.);}
 if(s==4){vec3 q=vec3(p*2.4,t*.2);vec3 w=vec3(fbm(q+4.),fbm(q+8.),fbm(q+12.));float n=fbm(q*2.7+w*3.);float rays=pow(abs(sin(atan(p.y,p.x)*8.+n*4.)),12.);c=mix(vec3(.18,.005,.025),vec3(1.,.16,.03),smoothstep(.25,.7,n));c+=vec3(1.,.58,.14)*pow(n,3.)*3.;c+=vec3(1.,.9,.64)*pow(max(0.,1.-length(p*vec2(.8,1.2))),3.)*(.9+.2*uBeat);c+=vec3(.4,.06,.01)*rays*.25;}
 if(s==5){vec3 q=vec3(p*5.,t*.22);float n=fbm(q+vec3(fbm(q+3.),fbm(q+8.),fbm(q+19.))*3.);c=.5+.5*cos(vec3(0,1.4,3.1)+n*8.);c*=.8;}
 if(s==6||s==12||s==19||s==25||s==26)c=sphereScene(p,s,t);
 if(s==7){float g=step(.968,fract(p.x*24.))+step(.968,fract(p.y*24.));float major=step(.989,fract(p.x*6.))+step(.989,fract(p.y*6.));c=vec3(.012,.075,.19)+vec3(.09,.23,.36)*g*.2+vec3(.15,.36,.48)*major*.3;}
 if(s==8){vec2 q=p-vec2(.13,.04);q=rot(.12)*q;float a=atan(q.y,q.x);float r=length(q*vec2(.85,1.0))+.015*sin(a*7.+t);c=vec3(.9,.86,.75);for(int i=0;i<7;i++){float rad=.46-float(i)*.049;float edge=smoothstep(rad+.007,rad-.002,r);vec3 ink=.5+.38*cos(vec3(.3,2.1,4.8)+float(i)*.59);c=mix(c,ink,edge);float sh=exp(-pow((r-rad+.007)/.005,2.));c-=sh*.14;}c+=vec3(h2(gl_FragCoord.xy)*.035);}
 if(s==9){c=vec3(.93,.89,.78);vec2 q=(p-vec2(.10,.055))*vec2(1.05,1.9);float r=length(q);float n=fbm(vec3(q*6.8,t*.035));vec3 ink=mix(vec3(.025,.28,.39),vec3(.91,.27,.09),smoothstep(.27,.7,n));float hal=step(length(fract(gl_FragCoord.xy/5.)-.5),.36);float edge=smoothstep(.54,.53,r);c=mix(c,ink*(.82+.18*hal),edge);c+=vec3(h2(gl_FragCoord.xy)*.05-.025);}
 if(s==10){c=vec3(.025,.018,.047)+vec3(.05,.027,.087)*(p.y+.5);c+=vec3(.003)*noise(vec3(p*8.,t*.05));}
 if(s==11){c=vec3(.026,.023,.055)+vec3(.09,.02,.11)*exp(-length(p-vec2(.1,0))*3.);c+=stars(p,.25);}
 if(s==13){c=vec3(.003,.018,.026)+vec3(.005,.10,.12)*exp(-length(p-vec2(.1,0))*2.);float scan=sin(gl_FragCoord.y*PI*.5);c*=.95+.05*scan;}
 if(s==14){c=vec3(.02,.014,.04)+vec3(.06,.015,.11)*exp(-length(p)*2.);}
 if(s==15)c=galaxy(p,t);
 if(s==16){vec2 q=p-vec2(.16,.035);float a=atan(q.y,q.x);float burst=step(.37,fract(a*19./PI));c=mix(vec3(.98,.76,.08),vec3(.92,.15,.035),burst);float dots=step(length(fract(gl_FragCoord.xy/9.)-.5),.18);c*=1.-.19*dots;}
 if(s==17){c=vec3(.84,.82,.71);c+=vec3(h2(gl_FragCoord.xy)*.06-.03);}
 if(s==18){c=vec3(.73,.86,.87)-vec3(.12,.15,.16)*max(0.,-p.y);}
 if(s==20){c=vec3(.025,.07,.05);}
 if(s==21){c=vec3(.88,.88,.80)+vec3(.025,.026,.016)*p.y;}
 if(s==22){c=vec3(.006,.012,.03)+vec3(.023,.04,.105)*exp(-length(p)*2.);}
 if(s==23){c=vec3(.94,.925,.87);float g=step(.978,fract(p.x*18.))+step(.978,fract(p.y*18.));c-=g*.025;}
 if(s==24){vec2 q=p-vec2(.20,.02);float n=fbm(vec3(q*6.,t*.075));float r=length(q)+.05*n;float radius=.16+t*.075;float mask=smoothstep(radius+.065,radius-.025,r+.06*fbm(vec3(q*20.,t*.1)));c=vec3(.90,.85,.73);vec3 ink=mix(vec3(.16,.022,.025),vec3(.73,.085,.045),n);c=mix(c,ink,mask);c+=vec3(.035)*h2(gl_FragCoord.xy);}
 if(s==27)c=blackhole(p,t);
 if(s==28){c=vec3(.008,.013,.021)+vec3(.025,.05,.07)*exp(-length(p)*3.);}
 if(s==29){c=vec3(.007,.009,.013)+vec3(.03,.043,.056)*exp(-length(p-vec2(.38,.06))*5.);}
 float vig=1.-.18*pow(length(p*vec2(.6,1.)),1.4);if(s!=16&&s!=17&&s!=18&&s!=21&&s!=23&&s!=24&&s!=9&&s!=6&&s!=8)c*=vig;
 c=max(c,vec3(0));if(s==4||s==15||s==27)c=1.-exp(-c*1.35);
 c+=vec3((h2(gl_FragCoord.xy+floor(t*10.)*13.)-.5)*.009);
 frag=vec4(clamp(c,0.,1.),1);
}
