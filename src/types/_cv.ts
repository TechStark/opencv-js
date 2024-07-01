import type { FS } from "./emscripten";
import type { CV } from "./opencv";

declare global {
  var cv: CV & { FS: FS };
}
