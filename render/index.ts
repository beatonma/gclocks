export { BaseClockRenderer } from "./renderer";
export { TimeFormat } from "./format";
export { BaseGlyph } from "./glyph";
export { BaseFont } from "./font";
import "./canvas";

import { TimeFormat } from "./format";
import {
    HorizontalAlignment,
    Layout,
    Options,
    VerticalAlignment,
} from "./types";

export const DefaultOptions: Options = {
    format: TimeFormat.HH_MM_SS_24,
    glyphMorphMillis: 800,
    spacingPx: 16,
    alignment: HorizontalAlignment.None | VerticalAlignment.Bottom,
    layout: Layout.Horizontal,
};
