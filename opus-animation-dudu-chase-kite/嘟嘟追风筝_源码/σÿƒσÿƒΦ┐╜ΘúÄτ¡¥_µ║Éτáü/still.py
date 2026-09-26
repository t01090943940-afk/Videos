import sys, cairo, time
from scenes import render_frame
times=[float(x) for x in sys.argv[2:]]
out=sys.argv[1]
cols=3; tw,th=640,360
rows=(len(times)+cols-1)//cols
sheet=cairo.ImageSurface(cairo.FORMAT_RGB24, cols*tw, rows*th)
c=cairo.Context(sheet)
t0=time.time()
for i,t in enumerate(times):
    s=render_frame(t)
    c.save(); c.translate((i%cols)*tw,(i//cols)*th); c.scale(tw/1920,th/1080); c.set_source_surface(s,0,0); c.paint(); c.restore()
    c.set_source_rgb(1,1,0); c.move_to((i%cols)*tw+8,(i//cols)*th+22); c.set_font_size(20); c.show_text(f"{t:.2f}")
print("per frame", (time.time()-t0)/len(times))
sheet.write_to_png(out)
