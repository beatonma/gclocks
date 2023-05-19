export { BaseClockRenderer } from "./renderer";
export { TimeFormat } from "./format";
export { BaseGlyph } from "./glyph";
export { BaseFont } from "./font";
import "./canvas";

import { TimeFormat } from "./format";
import { Alignment, Layout, Options } from "./types";

export const DefaultOptions: Options = {
    format: TimeFormat.HH_MM_SS_24,
    glyphMorphMillis: 800,
    spacingPx: 4,
    alignment: Alignment.Center,
    layout: Layout.Horizontal,
};
