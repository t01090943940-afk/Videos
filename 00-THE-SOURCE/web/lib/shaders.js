// ─────────────────────────────────────────────────────────────────────────────
//  shaders.js · 全片所有 GLSL
//  约定：所有颜色预乘 alpha；纹理 uv 原点在左下；世界坐标 y 向上、原点在画面中心。
// ─────────────────────────────────────────────────────────────────────────────
const HEAD = `#version 300 es
precision highp float;
`;
const HASH = `
float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
vec2 h22(vec2 p){ float n=h21(p); return vec2(n, h21(p+n*17.13)); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*vnoise(p); p=p*2.03+17.1; a*=.5; } return s; }
`;

// ── 精灵（图片 / 文字 / 纯色 / 代码字形）────────────────────────────────────
export const VS_SPRITE = HEAD + `
layout(location=0) in vec2 aPos;
uniform mat4 uMVP; uniform vec2 uSize;
out vec2 vUV;
void main(){ vUV=aPos; gl_Position=uMVP*vec4((aPos-.5)*uSize,0.,1.); }`;

export const FS_SPRITE = HEAD + HASH + `
in vec2 vUV; out vec4 o;
uniform sampler2D uTex; uniform vec4 uUV; uniform vec4 uColor; uniform float uMode;
uniform vec2 uSize; uniform float uRadius;
uniform float uBright, uSat, uContrast, uRGB;
uniform float uGlyph, uReveal, uScroll, uTick, uSeed, uHot;
uniform sampler2D uCode; uniform vec2 uCells; uniform vec3 uHotColor;
uniform float uEdge; uniform vec3 uEdgeColor;
vec2 tuv(vec2 uv){ return mix(uUV.xy, uUV.zw, uv); }
vec3 samp(vec2 uv){
  if(uRGB>0.){ vec2 d=(uv-.5)*uRGB+vec2(uRGB*.25,0.);
    return vec3(texture(uTex,tuv(uv+d)).r, texture(uTex,tuv(uv)).g, texture(uTex,tuv(uv-d)).b); }
  return texture(uTex,tuv(uv)).rgb; }
void main(){
  vec2 uv=vUV;
  vec2 p=(uv-.5)*uSize; float r=max(uRadius,.75);
  vec2 q=abs(p)-(uSize*.5-r); float d=length(max(q,0.))+min(max(q.x,q.y),0.)-r;
  float aa=max(fwidth(d),1e-4); float m=clamp(.5-d/aa,0.,1.);
  vec4 c;
  if(uMode>1.5){ c=vec4(uColor.rgb,1.); }
  else if(uMode>.5){ float a=texture(uTex,tuv(uv)).a; c=vec4(uColor.rgb*a,a); }
  else {
    vec3 v=samp(uv);
    if(uGlyph>0.){
      vec2 cell=floor(uv*uCells); vec2 cuv=(cell+.5)/uCells;
      vec3 vc=(samp(cuv)*2.+samp(cuv+vec2(.3,.3)/uCells)+samp(cuv-vec2(.3,.3)/uCells))*.25;
      float n=h21(cell+uSeed);
      float w=cuv.x*.72+(1.-cuv.y)*.28;
      float rv=smoothstep(0.,.16,uReveal*1.5-w-n*.42+.04);
      float front=clamp(1.-abs(rv-.5)*2.,0.,1.)*step(.001,uReveal)*step(uReveal,.999);
      vec2 guv=vec2(uv.x, fract(uv.y+uScroll/uCells.y));
      float jump=floor(h21(cell+floor(uTick)*.37)*97.)*step(.05,front);
      guv.y=fract(guv.y+jump/uCells.y);
      float g=texture(uCode,guv).a;
      float lum=dot(vc,vec3(.299,.587,.114));
      vec3 base=vc/max(max(vc.r,max(vc.g,vc.b)),.08);
      vec3 code=mix(vc,base,.35)*g*(.55+1.6*lum)+vc*.035;
      code+=uHotColor*g*front*uHot;
      v=mix(v, mix(code,v,rv), uGlyph);
    }
    float l=dot(v,vec3(.2126,.7152,.0722)); v=mix(vec3(l),v,uSat); v=(v-.5)*uContrast+.5; v=max(v*uBright,0.);
    if(uEdge>0.){ float e=clamp(1.-(-d)/uEdge,0.,1.); v+=uEdgeColor*e*e; }
    c=vec4(v*uColor.rgb,1.);
  }
  o=c*uColor.a*m;
}`;

// ── 全屏 ──────────────────────────────────────────────────────────────────
export const VS_FULL = HEAD + `
layout(location=0) in vec2 aPos; out vec2 vUV;
void main(){ vUV=aPos*.5+.5; gl_Position=vec4(aPos,0.,1.); }`;

export const FS_COPY = HEAD + `in vec2 vUV; out vec4 o; uniform sampler2D uTex; uniform float uAlpha;
void main(){ o=texture(uTex,vUV)*uAlpha; }`;

// 泛光：阈值 + 降采样
export const FS_BLOOM_PRE = HEAD + `in vec2 vUV; out vec4 o; uniform sampler2D uTex; uniform vec2 uTexel; uniform float uThresh;
void main(){
  vec3 c=vec3(0.);
  c+=texture(uTex,vUV+uTexel*vec2(-1,-1)).rgb; c+=texture(uTex,vUV+uTexel*vec2(1,-1)).rgb;
  c+=texture(uTex,vUV+uTexel*vec2(-1,1)).rgb;  c+=texture(uTex,vUV+uTexel*vec2(1,1)).rgb; c*=.25;
  float br=max(c.r,max(c.g,c.b)); float k=.35;
  float soft=clamp(br-uThresh+k,0.,2.*k); soft=soft*soft/(4.*k+1e-4);
  float w=max(soft,br-uThresh)/max(br,1e-4);
  o=vec4(c*w,1.); }`;
export const FS_DOWN = HEAD + `in vec2 vUV; out vec4 o; uniform sampler2D uTex; uniform vec2 uTexel;
void main(){ vec3 c=texture(uTex,vUV).rgb*4.;
  c+=texture(uTex,vUV-uTexel).rgb; c+=texture(uTex,vUV+uTexel).rgb;
  c+=texture(uTex,vUV+vec2(uTexel.x,-uTexel.y)).rgb; c+=texture(uTex,vUV-vec2(uTexel.x,-uTexel.y)).rgb;
  o=vec4(c/8.,1.); }`;
export const FS_UP = HEAD + `in vec2 vUV; out vec4 o; uniform sampler2D uTex; uniform sampler2D uPrev; uniform vec2 uTexel;
void main(){ vec3 c=vec3(0.);
  c+=texture(uTex,vUV+vec2(-uTexel.x*2.,0.)).rgb; c+=texture(uTex,vUV+vec2(uTexel.x*2.,0.)).rgb;
  c+=texture(uTex,vUV+vec2(0.,-uTexel.y*2.)).rgb; c+=texture(uTex,vUV+vec2(0.,uTexel.y*2.)).rgb;
  c+=texture(uTex,vUV+uTexel).rgb*2.; c+=texture(uTex,vUV-uTexel).rgb*2.;
  c+=texture(uTex,vUV+vec2(uTexel.x,-uTexel.y)).rgb*2.; c+=texture(uTex,vUV-vec2(uTexel.x,-uTexel.y)).rgb*2.;
  o=vec4(c/12.+texture(uPrev,vUV).rgb,1.); }`;

// 最终合成：抖动 / 镜头畸变 / 色差 / 泛光 / 调色 / 颗粒 / 暗角 / 闪白 / 遮幅
export const FS_FINAL = HEAD + HASH + `in vec2 vUV; out vec4 o;
uniform sampler2D uScene, uBloom;
uniform float uBloomAmt, uExposure, uCA, uGrain, uVig, uLetter, uFade, uWarp, uSat, uTime, uZoom, uRot, uContrast;
uniform vec2 uShake; uniform vec3 uFlash, uLift, uGain;
vec3 soft(vec3 x){ vec3 k=vec3(.82); return mix(x, k+(1.-k)*(1.-exp(-(x-k)/(1.-k))), step(k,x)); }
void main(){
  vec2 uv=vUV-.5; uv.x*=16./9.;
  float cs=cos(uRot), sn=sin(uRot); uv=mat2(cs,-sn,sn,cs)*uv; uv/=uZoom; uv+=uShake;
  float r2=dot(uv,uv); uv*=1.+uWarp*r2;
  uv.x*=9./16.; vec2 st=uv+.5;
  vec2 dir=(st-.5); float ca=uCA*(.35+length(dir)*1.6);
  vec3 c;
  c.r=texture(uScene,st+dir*ca).r; c.g=texture(uScene,st).g; c.b=texture(uScene,st-dir*ca).b;
  vec3 b=vec3(texture(uBloom,st+dir*ca*1.5).r, texture(uBloom,st).g, texture(uBloom,st-dir*ca*1.5).b);
  c+=b*uBloomAmt;
  c*=uExposure;
  c=soft(c);
  c=(c-.5)*uContrast+.5;
  float l=dot(c,vec3(.2126,.7152,.0722));
  c=mix(vec3(l),c,uSat);
  c=c*uGain+uLift*(1.-c);
  float v=smoothstep(1.25,.35,length((vUV-.5)*vec2(1.6,1.)));
  c*=mix(1.,v,uVig);
  float g=h21(vUV*vec2(1920.,1080.)+fract(uTime*13.7)*vec2(311.,173.))+h21(vUV*vec2(1733.,997.)+fract(uTime*7.3)*vec2(71.,219.))-1.;
  c+=g*uGrain*(.35+.65*(1.-abs(l-.5)*2.));
  c+=uFlash;
  if(any(isnan(c))) c=vec3(0.);
  float lb=uLetter*.5*(1.-1./2.39*16./9.);
  if(vUV.y<lb||vUV.y>1.-lb) c*=0.;
  c*=1.-uFade;
  c+=(h21(vUV*1000.+uTime)-.5)/255.;
  o=vec4(clamp(c,0.,1.),1.);
}`;

// 两镜之间的转场
export const FS_TRANS = HEAD + HASH + `in vec2 vUV; out vec4 o;
uniform sampler2D uA, uB; uniform float uP, uType, uSeed; uniform vec2 uCenter;
vec4 A(vec2 u){ return texture(uA,clamp(u,0.,1.)); }
vec4 B(vec2 u){ return texture(uB,clamp(u,0.,1.)); }
vec2 vor(vec2 p, out vec2 id){ vec2 i=floor(p), f=fract(p); float md=9.; vec2 best=vec2(0);
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){ vec2 g=vec2(x,y); vec2 c=g+h22(i+g)*.9+.05; float d=length(c-f);
    if(d<md){ md=d; best=i+g; } } id=best; return vec2(md,0.); }
void main(){
  vec2 uv=vUV; float p=clamp(uP,0.,1.); int t=int(uType+.5);
  vec4 c;
  if(t==1){ // slice：横条错位扫入
    float n=12.; float band=floor(uv.y*n); float d=h21(vec2(band,uSeed))*.45;
    float k=clamp((p-d)/(1.-.45),0.,1.); k=1.-pow(1.-k,3.);
    float dir=mod(band,2.)<1.?1.:-1.;
    float off=(1.-k)*dir*1.1;
    c = (uv.x-off>=0. && uv.x-off<=1. && k>0.)? B(uv-vec2(off,0.)) : A(uv+vec2(k*dir*.25,0.));
    c.rgb+=vec3(.9,.95,1.)*step(abs(uv.x-off-(dir>0.?0.:1.)),.004)*k*(1.-k)*4.;
  } else if(t==2){ // zoom punch：径向模糊推进
    vec2 d=uv-uCenter; vec3 acc=vec3(0.); float s1=1.+p*1.6, s2=2.2-p*1.2;
    for(int i=0;i<10;i++){ float fi=float(i)/9.; acc+= mix(A(uCenter+d/(s1+fi*p*.6)).rgb, B(uCenter+d/(max(s2-fi*(1.-p)*.8,1.))).rgb, smoothstep(.35,.65,p)); }
    c=vec4(acc/10.,1.); c.rgb+=vec3(1.)*pow(1.-abs(p-.5)*2.,3.)*.6;
  } else if(t==3){ // shatter：Voronoi 碎片收缩、旋转、外飞，露出下一镜
    vec2 asp=vec2(16./9.,1.); float sc=6.;
    vec2 id; vor(uv*asp*sc,id);
    vec2 cc=(id+.5)/sc/asp;
    float dd=length((cc-uCenter)*asp);
    float k=clamp(p*1.8-dd*.8,0.,1.); k=k*k*(3.-2.*k);
    float ang=(h21(id)-.5)*2.4*k;
    vec2 off=normalize((cc-uCenter)*asp+1e-3)/asp*k*.06;
    vec2 local=(uv-cc-off)*asp; local=mat2(cos(ang),-sin(ang),sin(ang),cos(ang))*local/max(1.-k,.001);
    vec2 src=cc+local/asp;
    vec2 id2; float dv=vor(src*asp*sc,id2).x;
    bool inside=(id2==id) && k<.99;
    c = inside ? A(src)*(1.+k*.6) : B(uv);
    if(inside) c.rgb+=vec3(1.,.85,.7)*k*.35;
  } else if(t==4){ // ink：墨迹晕染
    vec2 asp=vec2(16./9.,1.);
    float f=fbm(uv*asp*3.+uSeed)*.55+length((uv-uCenter)*asp)*.75;
    float m=smoothstep(f-.05,f+.05,p*1.55);
    float edge=smoothstep(.12,0.,abs(f-p*1.55));
    c=mix(A(uv),B(uv),m); c.rgb*=1.-edge*.85*(1.-m*.3);
  } else if(t==5){ // pixel：像素化交叉
    float s=mix(1.,90.,sin(p*3.14159)); vec2 g=vec2(16.,9.)*120./s;
    vec2 q=(floor(uv*g)+.5)/g; c=p<.5?A(q):B(q);
  } else if(t==6){ // rgb：块状故障
    vec2 blk=floor(uv*vec2(10.,24.)); float r=h21(blk+floor(p*8.)+uSeed);
    float on=step(.55,r)*sin(p*3.14159);
    vec2 off=vec2((h21(blk*1.7+uSeed)-.5)*.3*on,0.);
    vec4 src=p<.5?A(uv+off):B(uv+off);
    vec4 src2=p<.5?A(uv+off*1.8+vec2(.01,0.)):B(uv+off*1.8+vec2(.01,0.));
    c=vec4(src2.r,src.g,(p<.5?A(uv-off):B(uv-off)).b,1.);
  } else if(t==7){ // whip：甩镜
    vec3 acc=vec3(0.); float sp=sin(p*3.14159)*.35;
    for(int i=0;i<14;i++){ float fi=float(i)/13.-.5; vec2 u2=uv+vec2(fi*sp,0.);
      acc+= p<.5? A(u2+vec2(p*.8,0.)).rgb : B(u2-vec2((1.-p)*.8,0.)).rgb; }
    c=vec4(acc/14.,1.);
  } else { c=p<.5?A(uv):B(uv); }
  o=c;
}`;

// 马赛克：几百帧作品拼成「通通开源」
export const FS_MOSAIC = HEAD + HASH + `in vec2 vUV; out vec4 o;
uniform sampler2D uAtlas, uMask, uHero, uCode;
uniform vec2 uCam; uniform float uZoom, uTile, uTime, uDim, uHot, uHeroMix, uGlyph, uRipple, uRippleT;
uniform vec2 uHeroTile; uniform vec2 uAtlasGrid; uniform vec2 uCells; uniform vec2 uRippleC;
void main(){
  vec2 px=(vUV-.5)*vec2(1920.,1080.);
  vec2 wp=uCam+px/uZoom;
  vec2 tsz=vec2(uTile,uTile*9./16.);
  vec2 cell=floor(wp/tsz); vec2 f=fract(wp/tsz);
  float gap=.06;
  vec2 fg=smoothstep(vec2(0.),vec2(gap*.5),f)*smoothstep(vec2(1.),vec2(1.-gap*.5),f);
  float edge=mix(1.,fg.x*fg.y,clamp(uZoom*uTile/40.,0.,1.));
  float n=h21(cell);
  float work=floor(n*uAtlasGrid.y);
  float fr=mod(floor(uTime*10.+n*37.),uAtlasGrid.x);
  vec2 auv=vec2((fr+f.x)/uAtlasGrid.x, 1.-(work+1.-f.y)/uAtlasGrid.y);
  vec3 col=texture(uAtlas,auv).rgb;
  // 蒙版：字形覆盖（在格子中心采样，整格点亮）
  vec2 cc=(cell+.5)*tsz; vec2 muv=cc/vec2(1920.,1080.)+.5;
  float m=(muv.x<0.||muv.x>1.||muv.y<0.||muv.y>1.)?0.:texture(uMask,muv).r;
  float lum=dot(col,vec3(.299,.587,.114));
  vec3 lit=col*1.25+vec3(1.,.55,.25)*.10;
  vec3 dim=col*uDim;
  vec3 c=mix(dim,lit,m);
  c+=vec3(1.,.8,.6)*m*uHot*(.4+.6*h21(cell+floor(uTime*20.)));
  // 冲击波纹：从中心扩散的一圈高亮格
  float rd=length(cc-uRippleC)/1100.; float ring=exp(-pow((rd-uRippleT)*16.,2.))*uRipple;
  c+=col*ring*1.1+vec3(.25,.18,.1)*ring;
  // 英雄格：推进到这一格时换成原片高清帧，再退化成它的源码
  if(cell==uHeroTile){
    vec3 h=texture(uHero,f).rgb;
    if(uGlyph>0.){
      vec2 gc=floor(f*uCells); vec3 hc=texture(uHero,(gc+.5)/uCells).rgb;
      float g=texture(uCode,f).a; h=mix(h, hc*g*1.8+hc*.03, uGlyph);
    }
    c=mix(c,h,uHeroMix);
  }
  o=vec4(c*edge,1.);
}`;

// ── 实例化：字形粒子（一行代码炸开 → 拼成一帧）───────────────────────────
export const VS_SWARM = HEAD + HASH + `
layout(location=0) in vec2 aPos;
layout(location=1) in vec4 aInst; // cellX, cellY, charIdx, lineIdx
uniform mat4 uVP; uniform vec2 uCells; uniform vec4 uGrid; // x0,y0(top-left, world), cw, ch
uniform vec2 uLine0; uniform float uCharW, uLineLen, uT, uGlyphCols, uFont;
uniform sampler2D uVideo; uniform vec4 uVideoUV;
out vec2 vUV; out vec3 vCol; out float vA;
void main(){
  vec2 cell=aInst.xy;
  vec2 tgt=vec2(uGrid.x+(cell.x+.5)*uGrid.z, uGrid.y-(cell.y+.5)*uGrid.w);
  vec2 src=vec2(uLine0.x+(aInst.w+.5)*uCharW, uLine0.y);
  float r1=h21(cell), r2=h21(cell+7.1), r3=h21(cell+3.3);
  float dist=length(tgt-src)/1800.;
  float delay=dist*.35+r1*.25;
  float k=clamp((uT-delay)/.55,0.,1.);
  float e=1.-pow(1.-k,4.);
  vec2 ctrl=mix(src,tgt,.5)+vec2((r2-.5)*900.,(r3-.2)*700.);
  vec2 p=mix(mix(src,ctrl,e),mix(ctrl,tgt,e),e);
  float z=(1.-e)*(r2*600.-200.)*sin(e*3.14159);
  float sc=mix(uFont/uGrid.w*1.0, 1., e);
  float rot=(1.-e)*(r1-.5)*9.;
  vec2 lp=(aPos-.5)*vec2(uGrid.z,uGrid.w)*sc;
  lp=mat2(cos(rot),-sin(rot),sin(rot),cos(rot))*lp;
  gl_Position=uVP*vec4(p+lp,z,1.);
  float ci=aInst.z; vec2 gcell=vec2(mod(ci,uGlyphCols), floor(ci/uGlyphCols));
  vUV=(gcell+vec2(aPos.x,1.-aPos.y))/vec2(uGlyphCols, ceil(96./uGlyphCols)); vUV.y=1.-vUV.y;
  vec2 cuv=(cell+.5)/uCells; cuv.y=1.-cuv.y;
  vec3 vc=texture(uVideo,mix(uVideoUV.xy,uVideoUV.zw,cuv)).rgb;
  float lum=dot(vc,vec3(.299,.587,.114));
  vec3 base=vc/max(max(vc.r,max(vc.g,vc.b)),.08);
  vec3 fin=mix(vc,base,.35)*(.55+1.6*lum);
  vCol=mix(vec3(1.,.95,.85)*1.6, fin, smoothstep(.55,1.,e));
  vA=step(.0001,uT-delay+.02);
}`;
export const FS_SWARM = HEAD + `in vec2 vUV; in vec3 vCol; in float vA; out vec4 o; uniform sampler2D uGlyphs;
void main(){ float a=texture(uGlyphs,vUV).a*vA; o=vec4(vCol*a,a); }`;

// ── 实例化：作品帧瓦片（球 / 墙）─────────────────────────────────────────
export const VS_TILES = HEAD + HASH + `
layout(location=0) in vec2 aPos;
layout(location=1) in vec4 aA; // x y z scale
layout(location=2) in vec4 aB; // yaw pitch atlasIdx bright
layout(location=3) in vec2 aC; // glyph, roll
uniform mat4 uVP; uniform vec2 uTileSize;
out vec2 vUV0; out float vIdx; out float vBright; out float vGlyph; out vec2 vLocal;
void main(){
  vec2 lp=(aPos-.5)*uTileSize*aA.w;
  float cr=cos(aC.y), sr=sin(aC.y); lp=mat2(cr,-sr,sr,cr)*lp;
  float cy=cos(aB.x), sy=sin(aB.x), cx=cos(aB.y), sx=sin(aB.y);
  vec3 v=vec3(lp,0.);
  v=vec3(v.x, v.y*cx - v.z*sx, v.y*sx + v.z*cx);
  v=vec3(v.x*cy + v.z*sy, v.y, -v.x*sy + v.z*cy);
  gl_Position=uVP*vec4(aA.xyz+v,1.);
  vUV0=aPos; vIdx=aB.z; vBright=aB.w; vGlyph=aC.x; vLocal=(aPos-.5)*uTileSize*aA.w;
}`;
export const FS_TILES = HEAD + HASH + `in vec2 vUV0; in float vIdx; in float vBright; in float vGlyph; in vec2 vLocal; out vec4 o;
uniform sampler2D uAtlas, uCode; uniform vec2 uAtlasGrid; uniform float uTime; uniform vec2 uTileSize; uniform vec3 uEdgeCol;
void main(){
  vec2 vUV=gl_FrontFacing? vUV0 : vec2(1.-vUV0.x, vUV0.y);
  float work=floor(vIdx/uAtlasGrid.x); float fr0=mod(vIdx,uAtlasGrid.x);
  float fr=mod(fr0+floor(uTime*8.),uAtlasGrid.x);
  vec2 auv=vec2((fr+vUV.x)/uAtlasGrid.x, 1.-(work+1.-vUV.y)/uAtlasGrid.y);
  vec3 c=texture(uAtlas,auv).rgb;
  if(vGlyph>0.){
    vec2 cells=vec2(20.,7.); vec2 gc=floor(vUV*cells);
    vec3 cc=texture(uAtlas,vec2((fr+(gc.x+.5)/cells.x)/uAtlasGrid.x, 1.-(work+1.-(gc.y+.5)/cells.y)/uAtlasGrid.y)).rgb;
    vec2 cu=vec2(vUV.x*.18+h21(vec2(vIdx,1.))*.8, vUV.y*.14+h21(vec2(vIdx,2.))*.85);
    float g=texture(uCode,cu).a;
    float lum=dot(cc,vec3(.299,.587,.114));
    c=mix(c, cc*g*(.8+1.8*lum)+vec3(.2,.6,1.)*g*.15, vGlyph);
  }
  vec2 d=abs(vLocal)-(uTileSize*0.)-vec2(0.);
  float ex=min(vUV.x,1.-vUV.x), ey=min(vUV.y,1.-vUV.y);
  float e=min(ex*uTileSize.x/uTileSize.y, ey);
  float aa=fwidth(e)*1.2; float m=smoothstep(0.,aa,e);
  c+=uEdgeCol*smoothstep(aa*3.,0.,e);
  o=vec4(c*vBright,1.)*m;
}`;
