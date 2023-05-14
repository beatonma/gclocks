import { BaseGlyph } from "../render";
import { decelerate5, interpolate, progress as prog } from "../render/math";
import { Canvas, Paints } from "../render/types";

export class FormGlyph extends BaseGlyph {
    height = 144;

    draw0_1 = (canvas: Canvas, progress: number, paints: Paints): void => {
        const d1 = decelerate5(prog(progress, 0, 0.5));
        const d2 = decelerate5(prog(progress, 0.5, 1));

        // 0
        canvas.save();
        canvas.translate(interpolate(d1, 0, interpolate(d2, 24, 0)), 0);
        canvas.scaleWithPivot(interpolate(d1, 1, 2 / 3), 72, 144);
        canvas.scaleWithPivot(interpolate(d2, 1, 0.7), 72, 96);
        canvas.rotateWithPivot(interpolate(d1, 45, 0), 72, 72);
        canvas.rect(0, 0, this.getWidthAtProgress(progress), this.height);

        const stretchX = interpolate(d1, 0, interpolate(d2, 72, -36));
        canvas.beginPath();
        canvas.moveTo(72 - stretchX, 144);
        canvas.boundedArc(-stretchX, 0, 144 - stretchX, 144, 90, 180);
        canvas.lineTo(72 + stretchX, 0);
        canvas.lineTo(72 + stretchX, 144);
        canvas.lineTo(72 - stretchX, 144);
        canvas.closePath();
        canvas.fillPaint(paints.colors[1]);

        canvas.beginPath();
        // canvas.moveTo(stretchX, 0);
        canvas.boundedArc(stretchX, 0, 144 + stretchX, 144, -90, 180);
        canvas.closePath();
        canvas.fillPaint(paints.colors[2]);
        canvas.restore();

        // 1
        if (d2 > 0) {
            canvas.beginPath();
            canvas.rect(
                interpolate(d2, 28, 0),
                interpolate(d2, 72, 0),
                100,
                interpolate(d2, 144, 48)
            );
            canvas.strokePaint(paints.colors[1]);

            canvas.beginPath();
            canvas.rect(28, interpolate(d2, 144, 48), 100, 144);
            canvas.strokePaint(paints.colors[2]);
        }
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
        canvas.fillCircle(24, 24, 24, paints.colors[1]);
        canvas.fillCircle(24, 120, 24, paints.colors[2]);
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

    getWidthAtProgress = (progress: number): number => {
        switch (this.key) {
            case "0_1":
                return interpolate(
                    decelerate5(prog(progress, 0.5, 1)),
                    interpolate(decelerate5(prog(progress, 0, 0.5)), 144, 192),
                    100
                );
            case ":":
                return 48;

            default:
                return this.height;
        }
    };
}
