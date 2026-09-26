"""Minimal headless EGL/OpenGL renderer. No Python OpenGL package required."""
import os, ctypes as C
os.environ.setdefault('LIBGL_ALWAYS_SOFTWARE','1')
os.environ.setdefault('EGL_PLATFORM','surfaceless')
os.environ.setdefault('LP_NUM_THREADS','3')
import numpy as np
E=C.CDLL('libEGL.so.1'); G=C.CDLL('libGL.so.1')

def api(lib,name,restype,args):
    f=getattr(lib,name); f.restype=restype; f.argtypes=args; return f
P=C.c_void_p; I=C.c_int; U=C.c_uint; F=C.c_float
getd=api(E,'eglGetDisplay',P,[P])
init=api(E,'eglInitialize',U,[P,C.POINTER(I),C.POINTER(I)])
bind=api(E,'eglBindAPI',U,[U])
choose=api(E,'eglChooseConfig',U,[P,C.POINTER(I),C.POINTER(P),I,C.POINTER(I)])
createp=api(E,'eglCreatePbufferSurface',P,[P,P,C.POINTER(I)])
createc=api(E,'eglCreateContext',P,[P,P,P,C.POINTER(I)])
make=api(E,'eglMakeCurrent',U,[P,P,P,P])
cs=api(G,'glCreateShader',U,[U]); ss=api(G,'glShaderSource',None,[U,I,C.POINTER(C.c_char_p),C.POINTER(I)])
compile_=api(G,'glCompileShader',None,[U]); getsi=api(G,'glGetShaderiv',None,[U,U,C.POINTER(I)])
getlog=api(G,'glGetShaderInfoLog',None,[U,I,C.POINTER(I),C.c_char_p])
cp=api(G,'glCreateProgram',U,[]); attach=api(G,'glAttachShader',None,[U,U]); link=api(G,'glLinkProgram',None,[U]); use=api(G,'glUseProgram',None,[U])
getpi=api(G,'glGetProgramiv',None,[U,U,C.POINTER(I)])
getplog=api(G,'glGetProgramInfoLog',None,[U,I,C.POINTER(I),C.c_char_p])
loc=api(G,'glGetUniformLocation',I,[U,C.c_char_p]); u1f=api(G,'glUniform1f',None,[I,F]); u1i=api(G,'glUniform1i',None,[I,I]); u2f=api(G,'glUniform2f',None,[I,F,F])
viewport=api(G,'glViewport',None,[I,I,I,I]); draw=api(G,'glDrawArrays',None,[U,I,I]); read=api(G,'glReadPixels',None,[I,I,I,I,U,U,P])
genvao=api(G,'glGenVertexArrays',None,[I,C.POINTER(U)]); bindvao=api(G,'glBindVertexArray',None,[U]); finish=api(G,'glFinish',None,[])
getstr=api(G,'glGetString',C.c_char_p,[U])

class Renderer:
    def __init__(self,w,h,fragment):
        self.w,self.h=w,h
        self.display=getd(None); major,minor=I(),I()
        if not init(self.display,C.byref(major),C.byref(minor)): raise RuntimeError('EGL init failed')
        bind(0x30A2)
        attrs=(I*15)(0x3033,1,0x3040,8,0x3024,8,0x3023,8,0x3022,8,0x3021,8,0x3025,0,0x3038)
        cfg=P(); n=I(); choose(self.display,attrs,C.byref(cfg),1,C.byref(n))
        surfattrs=(I*5)(0x3057,w,0x3056,h,0x3038)
        self.surface=createp(self.display,cfg,surfattrs)
        ctxattrs=(I*1)(0x3038)
        self.context=createc(self.display,cfg,None,ctxattrs)
        if not make(self.display,self.surface,self.surface,self.context): raise RuntimeError('EGL make current failed')
        self.renderer=getstr(0x1F01).decode()
        vert='''#version 330 core\nvoid main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0,1);}'''
        self.program=cp()
        for typ,src in [(0x8B31,vert),(0x8B30,fragment)]:
            sh=cs(typ); b=C.c_char_p(src.encode()); ss(sh,1,C.byref(b),None); compile_(sh)
            ok=I(); getsi(sh,0x8B81,C.byref(ok))
            if not ok.value:
                buf=C.create_string_buffer(20000); getlog(sh,20000,None,buf); raise RuntimeError(buf.value.decode())
            attach(self.program,sh)
        link(self.program); ok=I(); getpi(self.program,0x8B82,C.byref(ok))
        if not ok.value:
            buf=C.create_string_buffer(20000); getplog(self.program,20000,None,buf); raise RuntimeError(buf.value.decode())
        use(self.program); va=U();genvao(1,C.byref(va));bindvao(va)
        viewport(0,0,w,h)
        self.locations={name:loc(self.program,name.encode()) for name in ['uRes','uTime','uScene','uBeat']}
        u2f(self.locations['uRes'],w,h)
        self.buffer=np.empty((h,w,4),np.uint8)
    def render(self,scene,t,beat=0.):
        u1i(self.locations['uScene'],scene);u1f(self.locations['uTime'],t);u1f(self.locations['uBeat'],beat)
        draw(0x0004,0,3)
        read(0,0,self.w,self.h,0x1908,0x1401,self.buffer.ctypes.data_as(P))
        return self.buffer[::-1,:,:3].copy()

if __name__=='__main__':
    from PIL import Image
    r=Renderer(640,360,'#version 330 core\nuniform vec2 uRes;out vec4 frag;void main(){frag=vec4(gl_FragCoord.xy/uRes,0.3,1.);}')
    print(r.renderer);Image.fromarray(r.render(0,0)).save('/mnt/data/cosmos_build/egl_test.png')
