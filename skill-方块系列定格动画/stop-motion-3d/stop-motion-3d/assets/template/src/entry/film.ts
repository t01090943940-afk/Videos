import { Film } from "../runtime/film";
import type { Episode, WorldManifest } from "../runtime/types";
import type { PoseSpec } from "../runtime/rig";
import { LOOKS } from "../looks";
import { PALETTE } from "../world/palette";
import { studioHooks } from "../world/hooks";
import { logoTexture } from "../world/backdrop";
import worldJson from "../world/world.json";
import episodeJson from "../episode/episode.json";
import posesJson from "../world/poses.json";

/**
 * Capture page. Exposes the render contract on window.film:
 *   ready   — resolves once fonts, world copies and monitor thumbnails exist
 *   frame(f) → JPEG data URL of frame f (WebGL plate + MG layer)
 *   inspect(f) → contact / penetration / pose-signature report (no pixels)
 *   meta()  → shots, frame ranges, events (for audio + QC scripts)
 */
declare global {
  interface Window { film: unknown }
}

const glCanvas = document.getElementById("gl") as HTMLCanvasElement;
const outCanvas = document.getElementById("out") as HTMLCanvasElement;

async function boot() {
  await document.fonts.load("800 40px 'Noto Sans CJK SC'");
  await document.fonts.load("500 20px 'Noto Sans CJK SC'");
  const world = worldJson as unknown as WorldManifest;
  const film = new Film({
    world,
    episode: episodeJson as unknown as Episode & { screens: Record<string, string> },
    looks: LOOKS,
    poses: posesJson as unknown as Record<string, PoseSpec>,
    palette: PALETTE,
    hooks: studioHooks(world),
    canvas: glCanvas,
    out: outCanvas,
    staticScreens: { 0: logoTexture() },
  });
  film.init();
  return film;
}

const ready = boot();
window.film = {
  ready: ready.then((f) => f.meta()),
  async frame(f: number, quality = 0.93) {
    const film = await ready;
    film.render(f);
    return outCanvas.toDataURL("image/jpeg", quality);
  },
  async inspect(f: number) {
    return (await ready).inspect(f);
  },
  async meta() {
    return (await ready).meta();
  },
};
