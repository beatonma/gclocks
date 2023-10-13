import { Rect } from "core/geometry";
import { ClockRenderer } from "core/render/renderer";
import { Canvas, Paints, PaintStyle } from "core/render/types";

export class DebugBoundaryRenderer extends ClockRenderer {
    constructor() {
        super({
            defaultPaintStyle: PaintStyle.Stroke,
            strokeWidth: 4,
            colors: ["black", "green", "red", "yellow"],
        });
    }

    drawGlyphBoundary = (canvas: Canvas, paints: Paints, boundary: Rect) => {
        canvas.paintRect(paints.colors[0], boundary);
    };

    drawGlyph = () => {};
}
