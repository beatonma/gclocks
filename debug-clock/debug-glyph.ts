import { BaseGlyph } from "../render";
import { Canvas, Paints } from "../render/types";
import { canvasExtensions } from "../render/canvas";

canvasExtensions();

export class DebugGlyph extends BaseGlyph {
    height = 100;

    draw0_1 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("0_1", 50, 50, paints.colors[0]);
    };

    draw1_2 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("1_2", 50, 50, paints.colors[0]);
    };

    draw1__ = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("1__", 50, 50, paints.colors[0]);
    };

    draw2_0 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("2_0", 50, 50, paints.colors[0]);
    };

    draw2_1 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("2_1", 50, 50, paints.colors[0]);
    };

    draw2_3 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("2_3", 50, 50, paints.colors[0]);
    };

    draw2__ = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("2__", 50, 50, paints.colors[0]);
    };

    draw3_0 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("3_0", 50, 50, paints.colors[0]);
    };

    draw3_4 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("3_4", 50, 50, paints.colors[0]);
    };

    draw4_5 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("4_5", 50, 50, paints.colors[0]);
    };

    draw5_0 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("5_0", 50, 50, paints.colors[0]);
    };

    draw5_6 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("5_6", 50, 50, paints.colors[0]);
    };

    draw6_7 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("6_7", 50, 50, paints.colors[0]);
    };

    draw7_8 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("7_8", 50, 50, paints.colors[0]);
    };

    draw8_9 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("8_9", 50, 50, paints.colors[0]);
    };

    draw9_0 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("9_0", 50, 50, paints.colors[0]);
    };

    drawSeparator = (
        canvas: Canvas,
        progress: number,
        paints: Paints
    ): void => {
        canvas.text(":", 50, 50, paints.colors[0]);
    };

    draw_ = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("_", 50, 50, paints.colors[0]);
    };

    draw__1 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("__1", 50, 50, paints.colors[0]);
    };

    draw__2 = (canvas: Canvas, progress: number, paints: Paints): void => {
        canvas.text("__2", 50, 50, paints.colors[0]);
    };

    getWidthAtProgress = (progress: number): number => 100;
}
