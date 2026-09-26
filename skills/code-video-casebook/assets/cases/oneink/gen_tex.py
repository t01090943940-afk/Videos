import numpy as np
from PIL import Image, ImageDraw, ImageFilter
rng = np.random.default_rng(7)
N = 2048
def fftnoise(n, beta, lo=0, hi=1e9, seed=0):
    r = np.random.default_rng(seed)
    fx = np.fft.fftfreq(n)[:,None]; fy = np.fft.fftfreq(n)[None,:]
    f = np.sqrt(fx*fx+fy*fy)*n
    f[0,0]=1
    amp = f**(-beta/2)
    amp[(f<lo)|(f>hi)] = 0
    ph = r.normal(size=(n,n)) + 1j*r.normal(size=(n,n))
    x = np.real(np.fft.ifft2(ph*amp))
    x = (x-x.mean())/x.std()
    return x
def norm01(x, lo=-2.5, hi=2.5):
    return np.clip((x-lo)/(hi-lo),0,1)

mott = norm01(fftnoise(N, 3.0, 1, 200, 1))
cloud2 = norm01(fftnoise(N, 2.2, 4, 400, 2))

# fibers
img = Image.new('L', (N, N), 128)
d = ImageDraw.Draw(img)
def fiber(length, width, val, curl):
    x, y = rng.uniform(0, N, 2)
    ang = rng.uniform(0, np.pi*2)
    pts = []
    steps = max(4, int(length/6))
    for i in range(steps):
        pts.append((x, y))
        ang += rng.normal(0, curl)
        x += np.cos(ang)*length/steps; y += np.sin(ang)*length/steps
    for ox in (-N, 0, N):
        for oy in (-N, 0, N):
            d.line([(px+ox, py+oy) for px, py in pts], fill=int(val), width=int(width))
for i in range(26000):
    L = rng.lognormal(np.log(60), 0.6)
    v = 128 + rng.choice([-1, 1], p=[0.35, 0.65]) * rng.uniform(10, 45)
    fiber(L, 1 if rng.random() < 0.8 else 2, v, 0.12)
for i in range(1800):
    fiber(rng.uniform(200, 500), 1, 128 + rng.uniform(15, 40), 0.05)
for i in range(700):
    fiber(rng.uniform(250, 700), 2, 128 - rng.uniform(6, 20), 0.04)
fib = np.asarray(img.filter(ImageFilter.GaussianBlur(0.6)), dtype=np.float32)/255.0
# grain + flecks
grain = norm01(fftnoise(N, 0.5, 200, 2000, 3), -3, 3)
fl = np.zeros((N, N), np.float32)
ys, xs = rng.integers(0, N, 2500), rng.integers(0, N, 2500)
fl[ys, xs] = 1
flk = Image.fromarray((fl*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
fl = np.asarray(flk, np.float32)/255.0
fl = fl/fl.max()
B = np.clip(grain*0.8 + fl*0.9, 0, 1)
# absorption noise for bleeding edges (mid freq, fibrous)
absn = norm01(fftnoise(N, 1.6, 20, 900, 4)*0.7 + (fib-0.5)*6)
out = np.stack([mott*0.6+cloud2*0.4, fib, B, absn], -1)
Image.fromarray((np.clip(out,0,1)*255).astype(np.uint8), 'RGBA').save('tex/paper.png')

# streak noise for dry brush (anisotropic: long along x) 1024x256 periodic
def aniso(nx, ny, sx, sy, seed):
    r = np.random.default_rng(seed)
    fx = np.fft.fftfreq(nx)[None,:]*nx; fy = np.fft.fftfreq(ny)[:,None]*ny
    f = np.sqrt((fx/sx)**2+(fy/sy)**2); f[0,0]=1
    amp = np.exp(-f*0.5)*(f**-0.6)
    ph = r.normal(size=(ny,nx))+1j*r.normal(size=(ny,nx))
    x = np.real(np.fft.ifft2(ph*amp)); return (x-x.mean())/x.std()
st = norm01(aniso(1024, 1024, 1.0, 40.0, 5), -2.2, 2.2)
Image.fromarray((st*255).astype(np.uint8), 'L').save('tex/streak.png')
print('ok')
# relief shading baked from mottling (light from upper-left), and big soft cloud
m = mott*0.6+cloud2*0.4
gx = (np.roll(m,-3,1)-np.roll(m,3,1)); gy = (np.roll(m,-3,0)-np.roll(m,3,0))
rel = 0.5 + (gx*0.7 - gy*0.9)*2.2
cl = norm01(fftnoise(N, 3.5, 1, 30, 9))
Image.fromarray((np.stack([np.clip(rel,0,1), cl, cl, np.ones_like(cl)],-1)*255).astype(np.uint8),'RGBA').save('tex/paperL.png')
print('L ok')
