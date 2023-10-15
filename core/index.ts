import "core/canvas";
import { Rect } from "core/geometry";
import { HorizontalAlignment, VerticalAlignment } from "core/options/alignment";
import { TimeFormat } from "core/options/format";
import { Options } from "core/options/options";
import { Layout } from "core/options/types";

export { ClockRenderer } from "core/render/renderer";
export { TimeFormat } from "core/options/format";
export { BaseGlyph } from "core/glyph";
export { BaseFont } from "core/font";

export const DefaultOptions: Options = new Options({
    format: TimeFormat.HH_MM_SS_24,
    glyphMorphMillis: 800,
    spacingPx: 16,
    alignment: HorizontalAlignment.Start | VerticalAlignment.Bottom,
    layout: Layout.Wrapped,
    backgroundColor: "#292929",
    bounds: new Rect(0.1, 0.1, 0.9, 0.9),
});
