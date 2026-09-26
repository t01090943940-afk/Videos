import type { LookDef } from "./types";
import { diorama } from "./diorama";
import { block } from "./block";
import { clay } from "./clay";
import { vox } from "./vox";
import { sketch } from "./sketch";
import { comic } from "./comic";
import { watercolor } from "./watercolor";

/** Look registry. A shot picks one with "look": "<id>". Each look is a full rendering pipeline. */
export const LOOKS: Record<string, LookDef> = { diorama, block, clay, vox, sketch, comic, watercolor };
