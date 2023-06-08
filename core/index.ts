export { ClockRenderer } from "./render/renderer";
export { TimeFormat } from "./options/format";
export { BaseGlyph } from "./glyph";
export { BaseFont } from "./font";
import "./canvas";
import { HorizontalAlignment, VerticalAlignment } from "./options/alignment";

import { TimeFormat } from "./options/format";
import { Options } from "./options/options";
import { Layout } from "./options/types";

export const DefaultOptions: Options = new Options({
    format: TimeFormat.HH_MM_SS_24,
    glyphMorphMillis: 800,
    spacingPx: 16,
    alignment: HorizontalAlignment.Start | VerticalAlignment.Bottom,
    layout: Layout.Wrapped,
    backgroundColor: null,
});
