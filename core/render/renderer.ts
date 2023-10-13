import { Rect } from "core/geometry";
import { Glyph } from "core/glyph";
import { ClockLayout } from "core/render/clock-layout";
import { Canvas, Paints } from "core/render/types";

export abstract class ClockRenderer {
    paints: Paints;

    protected constructor(paints: Paints) {
        this.setPaints(paints);
    }

    setPaints = (paints: Paints) => {
        this.paints = paints;
    };

    draw(canvas: Canvas, layout: ClockLayout<any>) {
        if (!layout.isDrawable()) return;

        canvas.paintStyle = this.paints.defaultPaintStyle;
        const { paints } = this;

        // Reset canvas and paint attributes
        canvas.paintStyle = paints.defaultPaintStyle;
        canvas.lineWidth = paints.strokeWidth;

        layout.onDraw(([x, y], scale) => {
            // Global transform and scale derived from options layout, scale, and container dimensions.

            canvas.withTranslationAndScale(x, y, scale, () => {
                layout.layoutPass((glyph, glyphAnimationProgress, rect) => {
                    // Per-glyph transform + draw
                    this.drawGlyphBoundary(canvas, paints, rect);

                    canvas.withTranslationAndScale(
                        rect.left,
                        rect.top,
                        glyph.scale,
                        () => {
                            this.drawGlyph(
                                glyph,
                                canvas,
                                glyphAnimationProgress,
                                paints,
                            );
                        },
                    );
                });
            });
        });
    }

    drawGlyphBoundary = (canvas: Canvas, paints: Paints, boundary: Rect) => {};

    drawGlyph = (
        glyph: Glyph,
        canvas: Canvas,
        glyphAnimationProgress: number,
        paints: Paints,
    ) => {
        glyph.draw(canvas, glyphAnimationProgress, paints);
    };
}
