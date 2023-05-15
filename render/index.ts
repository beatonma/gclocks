export { BaseClockRenderer } from "./renderer";
export { TimeFormat } from "./format";
export { BaseGlyph } from "./glyph";
export { BaseFont } from "./font";
import "./canvas";
import { Options } from "./types";

import { TimeFormat } from "./format";

export const DefaultOptions: Options = {
    format: TimeFormat.HH_MM_SS_24,
    glyphMorphMillis: 800,
};
