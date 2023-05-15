import { BaseGlyph } from "../render";
import { decelerate5, interpolate, progress } from "../render/math";
import { Canvas, Paints } from "../render/types";

export class FormGlyph extends BaseGlyph {
    height = 144;
    maxWidth = 144;

    draw0_1 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const d1 = decelerate5(progress(glyphProgress, 0, 0.5));
        const d2 = decelerate5(progress(glyphProgress, 0.5, 1));
        const [color1, color2, color3] = paints.colors;

        // 0
        canvas.withCheckpoint(() => {
            canvas.translate(interpolate(d1, 0, interpolate(d2, 24, 0)), 0);
            canvas.scaleWithPivot(interpolate(d1, 1, 2 / 3), 72, 144);
            canvas.scaleWithPivot(interpolate(d2, 1, 0.7), 72, 96);
            canvas.rotateWithPivot(interpolate(d1, 45, 0), 72, 72);

            const stretchX = interpolate(d1, 0, interpolate(d2, 72, -36));
            canvas.paintPath(color2, () => {
                canvas.moveTo(72 - stretchX, 144);
                canvas.boundedArc(-stretchX, 0, 144 - stretchX, 144, 90, 180);
                canvas.lineTo(72 + stretchX, 0);
                canvas.lineTo(72 + stretchX, 144);
                canvas.lineTo(72 - stretchX, 144);
                canvas.closePath();
            });

            canvas.boundedArc(
                stretchX,
                0,
                144 + stretchX,
                144,
                -90,
                180,
                color3
            );
        });

        // 1
        if (d2 > 0) {
            canvas.paintRect(
                interpolate(d2, 28, 0),
                interpolate(d2, 72, 0),
                100,
                interpolate(d2, 144, 48),
                color2
            );
            canvas.paintRect(28, interpolate(d2, 144, 48), 100, 144, color3);
        }
    };

    draw1_2 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const d = 1 - decelerate5(progress(glyphProgress, 0, 0.5));
        const d1 = decelerate5(progress(glyphProgress, 0.3, 0.8));
        const d2 = decelerate5(progress(glyphProgress, 0.5, 1.0));
        const [color1, color2, color3] = paints.colors;

        // 2
        if (d1 > 0) {
            canvas.withTranslate(interpolate(d2, 72, 0), 0, () => {
                canvas.paintPath(color3, () => {
                    canvas.moveTo(0, 144);
                    canvas.lineTo(72, 72);
                    canvas.lineTo(72, 144);
                    canvas.lineTo(0, 144);
                });
            });

            canvas.withTranslate(108, interpolate(d1, 72, 0), () => {
                canvas.boundedArc(-36, 0, 36, 72, -90, 180, color1);
            });

            canvas.withTranslate(0, interpolate(d1, 72, 0), () => {
                canvas.paintRect(
                    interpolate(d2, 72, 8),
                    0,
                    interpolate(d2, 144, 108),
                    72,
                    color1
                );
            });

            canvas.paintRect(72, 72, 144, 144, color2);
        }

        // 1
        if (d > 0) {
            canvas.withTranslate(interpolate(d, 44, 0), 0, () => {
                canvas.paintRect(
                    interpolate(d, 28, 0),
                    interpolate(d, 72, 0),
                    100,
                    interpolate(d, 144, 48),
                    color2
                );
                canvas.paintRect(28, interpolate(d, 144, 48), 100, 144, color3);
            });
        }
    };

    draw1__ = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("1__", 50, 50, paints.colors[0]);
    };

    draw2_0 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("2_0", 50, 50, paints.colors[0]);
    };

    draw2_1 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("2_1", 50, 50, paints.colors[0]);
    };

    draw2_3 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const d = decelerate5(progress(glyphProgress, 0, 0.5));
        const d1 = decelerate5(progress(glyphProgress, 0.5, 1.0));
        const [color1, color2, color3] = paints.colors;

        // 2
        if (d < 1) {
            canvas.withTranslate(interpolate(d, 0, -16), 0, () => {
                canvas.withTranslate(interpolate(d, 0, 72), 0, () => {
                    canvas.paintPath(color3, () => {
                        canvas.moveTo(0, 144);
                        canvas.lineTo(72, 72);
                        canvas.lineTo(72, 144);
                        canvas.lineTo(0, 144);
                    });
                });

                if (d == 0) {
                    canvas.paintPath(color1, () => {
                        canvas.moveTo(8, 0);
                        canvas.lineTo(108, 0);
                        canvas.boundedArc(108 - 36, 0, 108 + 36, 72, -90, 180);
                        canvas.lineTo(108, 72);
                        canvas.lineTo(8, 72);
                        canvas.lineTo(8, 0);
                        canvas.closePath();
                    });
                } else {
                    canvas.boundedArc(
                        108 - 36,
                        interpolate(d, 0, 72),
                        108 + 36,
                        72 + interpolate(d, 0, 72),
                        -90,
                        180,
                        color1
                    );

                    canvas.paintRect(
                        interpolate(d, 8, 72),
                        interpolate(d, 0, 72),
                        interpolate(d, 108, 144),
                        interpolate(d, 72, 144),
                        color1
                    );
                }
                canvas.paintRect(72, 72, 144, 144, color2);
            });
            return;
        }
        // 3
        // half-circle
        canvas.withCheckpoint(() => {
            canvas.beginPath();
            canvas.scaleWithPivot(interpolate(d1, 0.7, 1), 128, 144);
            canvas.boundedArc(32, 48, 128, 144, -90, 180);
            canvas.paint(color3);
        });

        // bottom rectangle
        canvas.paintRect(
            interpolate(d1, 56, 0),
            interpolate(d1, 72, 96),
            interpolate(d1, 128, 80),
            interpolate(d1, 144, 144),
            color1
        );

        // top part with triangle
        canvas.withTranslate(0, interpolate(d1, 72, 0), () => {
            canvas.paintPath(color3, () => {
                canvas.moveTo(128, 0);
                canvas.lineTo(80, 48);
                canvas.lineTo(80, 0);
                canvas.closePath();
            });
            canvas.paintRect(
                interpolate(d1, 56, 0),
                0,
                interpolate(d1, 128, 80),
                interpolate(d1, 72, 48),
                color3
            );
        });

        // middle rectangle
        canvas.paintRect(
            interpolate(d1, 56, 32),
            interpolate(d1, 72, 48),
            interpolate(d1, 128, 80),
            interpolate(d1, 144, 96),
            color2
        );
    };

    draw2__ = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("2__", 50, 50, paints.colors[0]);
    };

    draw3_0 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("3_0", 50, 50, paints.colors[0]);
    };

    draw3_4 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const d1 = 1 - decelerate5(progress(glyphProgress, 0, 0.5));
        const d2 = decelerate5(progress(glyphProgress, 0.5, 1));
        const [color1, color2, color3] = paints.colors;

        // 3
        if (d1 > 0) {
            canvas.withTranslate(interpolate(d1, 16, 0), 0, () => {
                // middle rectangle
                canvas.paintRect(
                    interpolate(d1, 56, 32),
                    interpolate(d1, 72, 48),
                    interpolate(d1, 128, 80),
                    interpolate(d1, 144, 96),
                    color2
                );

                // half-circle
                canvas.withScale(interpolate(d1, 0.7, 1), 128, 144, () => {
                    canvas.boundedArc(32, 48, 128, 144, -90, 180, color3);
                });

                // bottom rectangle
                canvas.paintRect(
                    interpolate(d1, 56, 0),
                    interpolate(d1, 72, 96),
                    interpolate(d1, 128, 80),
                    interpolate(d1, 144, 144),
                    color1
                );

                // top part with triangle
                canvas.withTranslate(0, interpolate(d1, 72, 0), () => {
                    canvas.beginPath();
                    canvas.moveTo(80, 0);
                    canvas.lineTo(128, 0);
                    canvas.lineTo(80, 48);
                    if (d1 == 1) {
                        canvas.lineTo(0, 48);
                        canvas.lineTo(0, 0);
                        canvas.lineTo(80, 0);
                        canvas.closePath();
                        canvas.paint(color3);
                    } else {
                        canvas.closePath();
                        canvas.paint(color3);
                        canvas.paintRect(
                            interpolate(d1, 56, 0),
                            0,
                            interpolate(d1, 128, 80),
                            interpolate(d1, 72, 48),
                            color3
                        );
                    }
                });
            });
        } else {
            // 4
            // bottom rectangle
            canvas.paintRect(72, interpolate(d2, 144, 108), 144, 144, color2);

            // middle rectangle
            canvas.paintRect(
                interpolate(d2, 72, 0),
                interpolate(d2, 144, 72),
                144,
                interpolate(d2, 144, 108),
                color1
            );

            // triangle
            canvas.withScale(d2, 144, 144, () => {
                canvas.beginPath();
                canvas.moveTo(72, 72);
                canvas.lineTo(72, 0);
                canvas.lineTo(0, 72);
                canvas.lineTo(72, 72);
                canvas.paint(color2);
            });

            // top rectangle
            canvas.paintRect(
                72,
                interpolate(d2, 72, 0),
                144,
                interpolate(d2, 144, 72),
                color3
            );
        }
    };

    draw4_5 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("4_5", 50, 50, paints.colors[0]);
    };

    draw5_0 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("5_0", 50, 50, paints.colors[0]);
    };

    draw5_6 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("5_6", 50, 50, paints.colors[0]);
    };

    draw6_7 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("6_7", 50, 50, paints.colors[0]);
    };

    draw7_8 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("7_8", 50, 50, paints.colors[0]);
    };

    draw8_9 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("8_9", 50, 50, paints.colors[0]);
    };

    draw9_0 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("9_0", 50, 50, paints.colors[0]);
    };

    drawSeparator = (
        canvas: Canvas,
        glyphProgress: number,
        paints: Paints
    ): void => {
        canvas.paintCircle(24, 24, 24, paints.colors[1]);
        canvas.paintCircle(24, 120, 24, paints.colors[2]);
    };

    draw_ = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("_", 50, 50, paints.colors[0]);
    };

    draw__1 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("__1", 50, 50, paints.colors[0]);
    };

    draw__2 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        canvas.text("__2", 50, 50, paints.colors[0]);
    };

    getWidthAtProgress = (glyphProgress: number): number => {
        switch (this.key) {
            case "0_1":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0.5, 1)),
                    interpolate(
                        decelerate5(progress(glyphProgress, 0, 0.5)),
                        144,
                        192
                    ),
                    100
                );
            case "1_2":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0, 0.5)),
                    100,
                    144
                );
            case "2_3":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0, 0.5)),
                    144,
                    128
                );
            case "3_4":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0.5, 1)),
                    128,
                    144
                );
            case ":":
                return 48;

            default:
                // noinspection JSSuspiciousNameCombination
                return this.height;
        }
    };
}
