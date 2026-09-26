import * as THREE from "three";

/**
 * Screen content registry. "screen:N" / "tv:N" materials sample SCREENS[N].
 * The film fills these before rendering (monitor thumbnails are real renders of the sandbox in
 * each look — the film shows the films its characters are making).
 */
export const SCREENS: THREE.Texture[] = [];

export function screenTexture(i: number): THREE.Texture {
  if (!SCREENS[i]) {
    const t = new THREE.DataTexture(new Uint8Array([20, 22, 28, 255]), 1, 1);
    t.needsUpdate = true;
    SCREENS[i] = t;
  }
  return SCREENS[i];
}
