import sys, cv2, numpy as np, glob
files = sys.argv[2:]
out = sys.argv[1]
ims = [cv2.imread(f) for f in files]
ims = [cv2.resize(i, (800, 450), interpolation=cv2.INTER_AREA) for i in ims]
for i, f in zip(ims, files):
    cv2.putText(i, f.split('/')[-1], (8, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 255), 1)
cols = 2
rows = (len(ims) + cols - 1) // cols
while len(ims) < rows * cols:
    ims.append(np.zeros_like(ims[0]))
grid = np.vstack([np.hstack(ims[r * cols:(r + 1) * cols]) for r in range(rows)])
cv2.imwrite(out, grid)
