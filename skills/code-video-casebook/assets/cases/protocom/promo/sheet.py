import sys,glob
from PIL import Image
d,o=sys.argv[1],sys.argv[2]
fs=sorted(glob.glob(d+'/*.jpg'),key=lambda f:float(f.split('/t')[-1][:-4]))
sh=Image.new('RGB',(3*640,((len(fs)+2)//3)*360))
for i,f in enumerate(fs): sh.paste(Image.open(f).resize((640,360)),((i%3)*640,(i//3)*360))
sh.save(o)
