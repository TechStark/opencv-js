import { FS } from './emscripten'
import { CV } from './opencv'

declare global {
  var cv: CV & { FS: FS }
}
