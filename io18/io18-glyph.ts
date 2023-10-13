import { BaseGlyph } from "core";
import { GlyphLayoutInfo } from "core/glyph";
import { Canvas, Paints } from "core/render/types";
import { SquareGrid } from "io18/animations";

export namespace StaticIo19Glyph {
    export const layoutInfo: GlyphLayoutInfo = {
        height: 144,
        width: 140,
        isMonospace: true,
    };
}

export class Io18Glyph extends BaseGlyph {
    layoutInfo = StaticIo19Glyph.layoutInfo;

    zeroSquareGrid = new SquareGrid(4.8, 70, 6, 10, 13);

    draw0_1 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "0_1", 50, 50);
        canvas.paintPath("yellow", () => {
            this.zeroSquareGrid.drawEnter(canvas, glyphProgress);
        });
    };

    draw1_2 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "1_2", 50, 50);
    };

    draw1__ = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "1__", 50, 50);
    };

    draw2_0 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "2_0", 50, 50);
    };

    draw2_1 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "2_1", 50, 50);
    };

    draw2_3 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "2_3", 50, 50);
    };

    draw2__ = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "2__", 50, 50);
    };

    draw3_0 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "3_0", 50, 50);
    };

    draw3_4 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "3_4", 50, 50);
    };

    draw4_5 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "4_5", 50, 50);
    };

    draw5_0 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "5_0", 50, 50);
    };

    draw5_6 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "5_6", 50, 50);
    };

    draw6_7 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "6_7", 50, 50);
    };

    draw7_8 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "7_8", 50, 50);
    };

    draw8_9 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "8_9", 50, 50);
    };

    draw9_0 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "9_0", 50, 50);
    };

    drawSeparator = (
        canvas: Canvas,
        glyphProgress: number,
        paints: Paints,
    ): void => {
        canvas.text("red", ":", 50, 50);
    };

    draw_ = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "_", 50, 50);
    };

    draw__1 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("red", "__1", 50, 50);
    };

    getWidthAtProgress = (progress: number): number => {
        switch (this.key) {
            case ":":
                return 24;
            case " ":
                return 0;
            default:
                return this.layoutInfo.width;
        }
    };
}
