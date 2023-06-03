export { ClockRenderer } from "./render/renderer";
export { TimeFormat } from "./options/format";
export { BaseGlyph } from "./glyph";
export { BaseFont } from "./font";
import "./canvas";

import { TimeFormat } from "./options/format";
import {
    HorizontalAlignment,
    Layout,
    Options,
    VerticalAlignment,
} from "./options/types";

export const DefaultOptions: Options = {
    format: TimeFormat.HH_MM_SS_24,
    glyphMorphMillis: 800,
    spacingPx: 16,
    alignment: HorizontalAlignment.None | VerticalAlignment.Bottom,
    layout: Layout.Wrapped,
};
