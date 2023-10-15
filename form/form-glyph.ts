import { BaseGlyph, GlyphLayoutInfo } from "core/glyph";
import { decelerate5, interpolate, progress } from "core/math";
import { Canvas, Paints } from "core/render/types";

export namespace StaticFormGlyph {
    export const layoutInfo: GlyphLayoutInfo = {
        height: 144,
        isMonospace: false,
    };
}

export class FormGlyph extends BaseGlyph {
    layoutInfo = StaticFormGlyph.layoutInfo;

    draw0_1 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [_, color2, color3] = paints.colors;
        const d1 = decelerate5(progress(glyphProgress, 0, 0.5));
        const d2 = decelerate5(progress(glyphProgress, 0.5, 1));

        // 0
        canvas.withCheckpoint(() => {
            const stretchX = interpolate(d1, 0, interpolate(d2, 72, -36));

            // canvas.translate(interpolate(d1, 0, interpolate(d2, 24, 0)), 0);
            canvas.translate(
                interpolate(d1, interpolate(d1, 0, 24), interpolate(d2, 24, 0)),
                0,
            );
            canvas.scaleUniformWithPivot(interpolate(d1, 1, 2 / 3), 72, 144);
            canvas.scaleUniformWithPivot(interpolate(d2, 1, 0.7), 72, 96);
            canvas.rotateWithPivot(interpolate(d1, 45, 0), 72, 72);

            canvas.paintPath(color2, () => {
                canvas.moveTo(72 - stretchX, 144);
                canvas.boundedArc(-stretchX, 0, 144 - stretchX, 144, 90, 180);
                canvas.lineTo(72 + stretchX, 0);
                canvas.lineTo(72 + stretchX, 144);
                canvas.lineTo(72 - stretchX, 144);
                canvas.closePath();
            });

            canvas.paintBoundedArc(
                color3,
                stretchX,
                0,
                144 + stretchX,
                144,
                -90,
                180,
            );
        });

        // 1
        if (d2 > 0) {
            canvas.paintRect(
                color2,
                interpolate(d2, 28, 0),
                interpolate(d2, 72, 0),
                100,
                interpolate(d2, 144, 48),
            );
            canvas.paintRect(color3, 28, interpolate(d2, 144, 48), 100, 144);
        }
    };

    draw1_2 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [color1, color2, color3] = paints.colors;
        const d = 1 - decelerate5(progress(glyphProgress, 0, 0.5));
        const d1 = decelerate5(progress(glyphProgress, 0.3, 0.8));
        const d2 = decelerate5(progress(glyphProgress, 0.5, 1.0));

        // 2
        if (d1 > 0) {
            canvas.withTranslation(interpolate(d2, 72, 0), 0, () => {
                canvas.paintPath(color3, () => {
                    canvas.moveTo(0, 144);
                    canvas.lineTo(72, 72);
                    canvas.lineTo(72, 144);
                    canvas.lineTo(0, 144);
                });
            });

            canvas.withTranslation(108, interpolate(d1, 72, 0), () => {
                canvas.paintBoundedArc(color1, -36, 0, 36, 72, -90, 180);
            });

            canvas.withTranslation(0, interpolate(d1, 72, 0), () => {
                canvas.paintRect(
                    color1,
                    interpolate(d2, 72, 8),
                    0,
                    interpolate(d2, 144, 108),
                    72,
                );
            });

            canvas.paintRect(color2, 72, 72, 144, 144);
        }

        // 1
        if (d > 0) {
            canvas.withTranslation(interpolate(d, 44, 0), 0, () => {
                canvas.paintRect(
                    color2,
                    interpolate(d, 28, 0),
                    interpolate(d, 72, 0),
                    100,
                    interpolate(d, 144, 48),
                );
                canvas.paintRect(color3, 28, interpolate(d, 144, 48), 100, 144);
            });
        }
    };

    draw1__ = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [_, color2, color3] = paints.colors;
        const d1 = decelerate5(progress(glyphProgress, 0, 0.5));
        const d2 = decelerate5(progress(glyphProgress, 0.5, 1));

        canvas.scaleUniformWithPivot(interpolate(d2, 1, 0), 0, 144);
        canvas.paintRect(
            color2,
            interpolate(d1, 0, 28),
            interpolate(d1, 0, 72),
            100,
            interpolate(d1, 48, 144),
        );

        if (d1 < 1) {
            canvas.paintRect(color3, 28, interpolate(d1, 48, 144), 100, 144);
        }
    };

    draw2_0 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        // TODO
        const [color1, color2, color3] = paints.colors;
        canvas.text(paints.colors[0], "2_0", 50, 50);
    };

    draw2_1 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [color1, color2, color3] = paints.colors;
        const d = decelerate5(progress(glyphProgress, 0, 0.5));
        const d1 = decelerate5(progress(glyphProgress, 0.2, 0.5));
        const d2 = decelerate5(progress(glyphProgress, 0.5, 1));

        // 2
        if (d1 < 1) {
            canvas.withTranslation(interpolate(d, 0, 28), 0, () => {
                canvas.paintPath(color3, () => {
                    canvas.moveTo(0, 144);
                    canvas.lineTo(72, 72);
                    canvas.lineTo(72, 144);
                    canvas.lineTo(0, 144);
                });
            });

            canvas.withTranslation(
                interpolate(d, 108, 64),
                interpolate(d1, 0, 72),
                () => {
                    canvas.paintBoundedArc(color1, -36, 0, 36, 72, -90, 180);
                },
            );

            canvas.withTranslation(0, interpolate(d1, 0, 72), () => {
                canvas.paintRect(
                    color1,
                    interpolate(d, 8, 28),
                    0,
                    interpolate(d, 108, 100),
                    72,
                );
            });

            canvas.withTranslation(interpolate(d, 0, -44), 0, () => {
                canvas.paintRect(color2, 72, 72, 144, 144);
            });
        } else {
            // 1
            canvas.paintRect(
                color2,
                interpolate(d2, 28, 0),
                interpolate(d2, 72, 0),
                100,
                interpolate(d2, 144, 48),
            );
            canvas.paintRect(color3, 28, interpolate(d2, 144, 48), 100, 144);
        }
    };

    draw2_3 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [color1, color2, color3] = paints.colors;
        const d = decelerate5(progress(glyphProgress, 0, 0.5));
        const d1 = decelerate5(progress(glyphProgress, 0.5, 1.0));

        // 2
        if (d < 1) {
            canvas.withTranslation(interpolate(d, 0, -16), 0, () => {
                canvas.withTranslation(interpolate(d, 0, 72), 0, () => {
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
                    canvas.paintBoundedArc(
                        color1,
                        108 - 36,
                        interpolate(d, 0, 72),
                        108 + 36,
                        72 + interpolate(d, 0, 72),
                        -90,
                        180,
                    );

                    canvas.paintRect(
                        color1,
                        interpolate(d, 8, 72),
                        interpolate(d, 0, 72),
                        interpolate(d, 108, 144),
                        interpolate(d, 72, 144),
                    );
                }
                canvas.paintRect(color2, 72, 72, 144, 144);
            });
            return;
        }
        // 3
        // half-circle
        canvas.withCheckpoint(() => {
            canvas.beginPath();
            canvas.scaleUniformWithPivot(interpolate(d1, 0.7, 1), 128, 144);
            canvas.boundedArc(32, 48, 128, 144, -90, 180);
            canvas.paint(color3);
        });

        // bottom rectangle
        canvas.paintRect(
            color1,
            interpolate(d1, 56, 0),
            interpolate(d1, 72, 96),
            interpolate(d1, 128, 80),
            interpolate(d1, 144, 144),
        );

        // top part with triangle
        canvas.withTranslation(0, interpolate(d1, 72, 0), () => {
            canvas.paintPath(color3, () => {
                canvas.moveTo(128, 0);
                canvas.lineTo(80, 48);
                canvas.lineTo(80, 0);
                canvas.closePath();
            });
            canvas.paintRect(
                color3,
                interpolate(d1, 56, 0),
                0,
                interpolate(d1, 128, 80),
                interpolate(d1, 72, 48),
            );
        });

        // middle rectangle
        canvas.paintRect(
            color2,
            interpolate(d1, 56, 32),
            interpolate(d1, 72, 48),
            interpolate(d1, 128, 80),
            interpolate(d1, 144, 96),
        );
    };

    draw2__ = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [color1, color2, color3] = paints.colors;
        const d = decelerate5(progress(glyphProgress, 0, 0.5));
        const d1 = decelerate5(progress(glyphProgress, 0.5, 1.0));

        // 2
        canvas.withTranslation(interpolate(d, 0, -72), 0, () => {
            if (d < 1) {
                canvas.withTranslation(interpolate(d, 0, 72), 0, () => {
                    canvas.paintPath(color3, () => {
                        canvas.beginPath();
                        canvas.moveTo(0, 144);
                        canvas.lineTo(72, 72);
                        canvas.lineTo(72, 144);
                        canvas.lineTo(0, 144);
                    });
                });

                canvas.withTranslation(108, interpolate(d, 0, 72), () => {
                    canvas.paintBoundedArc(color1, -36, 0, 36, 72, -90, 180);
                });

                canvas.paintRect(
                    color1,
                    interpolate(d, 8, 72),
                    interpolate(d, 0, 72),
                    interpolate(d, 108, 144),
                    interpolate(d, 72, 144),
                );
            }

            canvas.withScaleUniform(interpolate(d1, 1, 0), 72, 144, () => {
                canvas.paintRect(color2, 72, 72, 144, 144);
            });
        });
    };

    draw3_0 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [color1, color2, color3] = paints.colors;
        const d1 = 1 - decelerate5(progress(glyphProgress, 0, 0.5));
        const d2 = decelerate5(progress(glyphProgress, 0.5, 1));

        canvas.withCheckpoint(() => {
            canvas.rotateWithPivot(interpolate(d2, 0, 45), 72, 72);
            canvas.translate(interpolate(d1, interpolate(d2, 16, -8), 0), 0);

            if (d1 > 0) {
                // top part of 3 with triangle
                canvas.withTranslation(0, interpolate(d1, 48, 0), () => {
                    canvas.paintPath(color3, () => {
                        const x = interpolate(d1, 48, 0);
                        canvas.moveTo(128 - x, 0);
                        canvas.lineTo(80 - x, 48);
                        canvas.lineTo(80 - x, 0);
                    });
                    canvas.paintRect(color3, interpolate(d1, 32, 0), 0, 80, 48);
                });
            }

            // bottom rectangle in 3
            canvas.paintRect(
                color1,
                interpolate(d1, interpolate(d2, 32, 80), 0),
                96,
                80,
                144,
            );

            // middle rectangle
            canvas.paintRect(color2, interpolate(d2, 32, 80), 48, 80, 96);

            // 0
            // half-circles
            canvas.scaleUniformWithPivot(interpolate(d2, 2 / 3, 1), 80, 144);
            canvas.translate(8, 0);
            if (d2 > 0) {
                canvas.withRotation(interpolate(d2, -180, 0), 72, 72, () => {
                    canvas.paintBoundedArc(color2, 0, 0, 144, 144, 90, 180);
                });
            }

            canvas.paintBoundedArc(color3, 0, 0, 144, 144, -90, 180);
        });
    };

    draw3_4 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [color1, color2, color3] = paints.colors;
        const d1 = 1 - decelerate5(progress(glyphProgress, 0, 0.5));
        const d2 = decelerate5(progress(glyphProgress, 0.5, 1));

        // 3
        if (d1 > 0) {
            canvas.withTranslation(interpolate(d1, 16, 0), 0, () => {
                // middle rectangle
                canvas.paintRect(
                    color2,
                    interpolate(d1, 56, 32),
                    interpolate(d1, 72, 48),
                    interpolate(d1, 128, 80),
                    interpolate(d1, 144, 96),
                );

                // half-circle
                canvas.withScaleUniform(
                    interpolate(d1, 0.7, 1),
                    128,
                    144,
                    () => {
                        canvas.paintBoundedArc(
                            color3,
                            32,
                            48,
                            128,
                            144,
                            -90,
                            180,
                        );
                    },
                );

                // bottom rectangle
                canvas.paintRect(
                    color1,
                    interpolate(d1, 56, 0),
                    interpolate(d1, 72, 96),
                    interpolate(d1, 128, 80),
                    interpolate(d1, 144, 144),
                );

                // top part with triangle
                canvas.withTranslation(0, interpolate(d1, 72, 0), () => {
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
                            color3,
                            interpolate(d1, 56, 0),
                            0,
                            interpolate(d1, 128, 80),
                            interpolate(d1, 72, 48),
                        );
                    }
                });
            });
        } else {
            // 4
            // bottom rectangle
            canvas.paintRect(color2, 72, interpolate(d2, 144, 108), 144, 144);

            // middle rectangle
            canvas.paintRect(
                color1,
                interpolate(d2, 72, 0),
                interpolate(d2, 144, 72),
                144,
                interpolate(d2, 144, 108),
            );

            // triangle
            canvas.withScaleUniform(d2, 144, 144, () => {
                canvas.beginPath();
                canvas.moveTo(72, 72);
                canvas.lineTo(72, 0);
                canvas.lineTo(0, 72);
                canvas.lineTo(72, 72);
                canvas.paint(color2);
            });

            // top rectangle
            canvas.paintRect(
                color3,
                72,
                interpolate(d2, 72, 0),
                144,
                interpolate(d2, 144, 72),
            );
        }
    };

    draw4_5 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [color1, color2, color3] = paints.colors;
        const d = decelerate5(progress(glyphProgress, 0, 0.5));
        const d1 = decelerate5(progress(glyphProgress, 0.5, 1));

        // 4
        if (d < 1) {
            // bottom rectangle
            canvas.paintRect(
                color2,
                interpolate(d, 72, 0),
                108,
                interpolate(d, 144, 72),
                144,
            );

            // top rectangle
            canvas.paintRect(
                color3,
                interpolate(d, 72, 0),
                interpolate(d, 0, 72),
                interpolate(d, 144, 72),
                interpolate(d, 72, 144),
            );

            // triangle
            canvas.withScaleUniform(1 - d, 0, 144, () => {
                canvas.paintPath(color2, () => {
                    canvas.moveTo(72, 72);
                    canvas.lineTo(72, 0);
                    canvas.lineTo(0, 72);
                    canvas.lineTo(72, 72);
                });
            });

            // middle rectangle
            canvas.paintRect(
                color1,
                0,
                72,
                interpolate(d, 144, 72),
                interpolate(d, 108, 144),
            );
        } else {
            // 5
            // wing rectangle
            canvas.paintRect(
                color2,
                80,
                interpolate(d1, 72, 0),
                interpolate(d1, 80, 128),
                interpolate(d1, 144, 48),
            );

            // half-circle
            canvas.withCheckpoint(() => {
                canvas.scaleUniformWithPivot(interpolate(d1, 0.75, 1), 0, 144);
                canvas.translate(interpolate(d1, -48, 0), 0);
                canvas.paintBoundedArc(color3, 32, 48, 128, 144, -90, 180);
            });

            // bottom rectangle
            canvas.paintRect(color2, 0, 96, 80, 144);

            // middle rectangle
            canvas.paintRect(
                color1,
                0,
                interpolate(d1, 72, 0),
                80,
                interpolate(d1, 144, 96),
            );
        }
    };

    draw5_0 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [color1, color2, color3] = paints.colors;
        const d = decelerate5(progress(glyphProgress, 0, 0.5));
        const d1 = decelerate5(progress(glyphProgress, 0.5, 1));

        canvas.withRotation(interpolate(d1, 0, 45), 72, 72, () => {
            // 5 (except half-circle)
            if (d < 1) {
                // wing rectangle
                canvas.paintRect(
                    color2,
                    80,
                    interpolate(d, 0, 48),
                    interpolate(d, 128, 80),
                    interpolate(d, 48, 144),
                );

                // bottom rectangle
                canvas.paintRect(color2, 0, 96, 80, 144);
            }

            // middle rectangle
            canvas.paintRect(
                color1,
                interpolate(d1, 0, 80),
                interpolate(d, 0, interpolate(d1, 48, 0)),
                80,
                interpolate(d, 96, 144),
            );

            canvas.scaleUniformWithPivot(interpolate(d1, 2 / 3, 1), 80, 144);

            // half-circles
            if (d1 > 0) {
                canvas.withRotation(interpolate(d1, -180, 0), 72, 72, () => {
                    canvas.paintBoundedArc(color2, 0, 0, 144, 144, 90, 180);
                });
            }

            canvas.translate(interpolate(d1, 8, 0), 0);
            canvas.paintBoundedArc(color3, 0, 0, 144, 144, -90, 180);
        });
    };

    draw5_6 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [color1, color2, color3] = paints.colors;
        const d = decelerate5(progress(glyphProgress, 0, 0.7));
        const d1 = decelerate5(progress(glyphProgress, 0.1, 1));

        // 5 (except half-circle)
        if (d < 1) {
            canvas.withScaleUniform(interpolate(d, 1, 0.25), 108, 96, () => {
                // wing rectangle
                canvas.paintRect(color2, 80, 0, 128, 48);

                // bottom rectangle
                canvas.paintRect(color2, 0, 96, 80, 144);

                // middle rectangle
                canvas.paintRect(color1, 0, 0, 80, 96);
            });
        }

        // half-circle
        canvas.withRotation(interpolate(d1, 0, 90), 72, 72, () => {
            if (d1 == 0) {
                canvas.paintBoundedArc(color3, 32, 48, 128, 144, -90, 180);
            } else {
                canvas.scaleUniformWithPivot(
                    interpolate(d1, 2 / 3, 1),
                    80,
                    144,
                );
                canvas.translate(interpolate(d1, 8, 0), 0);
                canvas.paintBoundedArc(color3, 0, 0, 144, 144, -90, 180);
            }

            // 6 (just the parallelogram)
            if (d1 > 0) {
                canvas.withRotation(-90, 72, 72, () => {
                    canvas.paintPath(color2, () => {
                        canvas.beginPath();
                        canvas.moveTo(0, 72);
                        canvas.lineTo(
                            interpolate(d1, 0, 36),
                            interpolate(d1, 72, 0),
                        );
                        canvas.lineTo(
                            interpolate(d1, 72, 108),
                            interpolate(d1, 72, 0),
                        );
                        canvas.lineTo(72, 72);
                        canvas.lineTo(0, 72);
                    });
                });
            }
        });
    };

    draw6_7 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [_, color2, color3] = paints.colors;
        const d = decelerate5(glyphProgress);

        // 7 rectangle
        canvas.paintRect(color3, interpolate(d, 72, 0), 0, 72, 72);

        // 6 circle
        canvas.withTranslation(interpolate(d, 0, 36), 0, () => {
            if (d < 1) {
                canvas.paintBoundedArc(
                    color3,
                    0,
                    0,
                    144,
                    144,
                    interpolate(d, 180, -64),
                    -180,
                    true,
                );
            }

            // parallelogram
            canvas.paintPath(color2, () => {
                canvas.moveTo(36, 0);
                canvas.lineTo(108, 0);
                canvas.lineTo(interpolate(d, 72, 36), interpolate(d, 72, 144));
                canvas.lineTo(interpolate(d, 0, -36), interpolate(d, 72, 144));
                canvas.closePath();
            });
        });
    };

    draw7_8 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [color1, color2, color3] = paints.colors;
        const d = decelerate5(progress(glyphProgress, 0, 0.5));
        const d1 = decelerate5(progress(glyphProgress, 0.2, 0.5));
        const d2 = decelerate5(progress(glyphProgress, 0.5, 1));

        if (d == 0) {
            // 7 'rectangle', drawn as a path to avoid unnecessary overlapping
            // (because overlapping looks weird with transparent colors)
            canvas.paintPath(color3, () => {
                canvas.moveTo(0, 0);
                canvas.lineTo(72, 0);
                canvas.lineTo(36, 72);
                canvas.lineTo(0, 72);
                canvas.closePath();
            });

            // 7 parallelogram
            canvas.paintPath(color2, () => {
                canvas.moveTo(interpolate(d, 72, 48), interpolate(d, 0, 96));
                canvas.lineTo(interpolate(d, 144, 96), interpolate(d, 0, 96));
                canvas.lineTo(interpolate(d, 72, 96), 144);
                canvas.lineTo(interpolate(d, 0, 48), 144);
                canvas.closePath();
            });
        } else {
            // 8
            if (d1 > 0) {
                if (d2 > 0) {
                    // top
                    canvas.withTranslation(0, interpolate(d2, 96, 0), () => {
                        canvas.paintRoundRect(color3, 24, 0, 120, 48, 24);
                    });
                }

                // left bottom
                canvas.withCheckpoint(() => {
                    canvas.translate(interpolate(d1, 24, 0), 0);
                    canvas.scaleUniformWithPivot(
                        interpolate(d2, 0.5, 1),
                        48,
                        144,
                    );
                    canvas.paintBoundedArc(color1, 0, 48, 96, 144, 90, 180);
                });

                // right bottom
                canvas.withCheckpoint(() => {
                    canvas.translate(interpolate(d1, -24, 0), 0);
                    canvas.scaleUniformWithPivot(
                        interpolate(d2, 0.5, 1),
                        96,
                        144,
                    );
                    canvas.paintBoundedArc(color2, 48, 48, 144, 144, -90, 180);
                });

                // bottom middle
                canvas.withScale(interpolate(d1, 0, 1), 1, 72, 0, () => {
                    canvas.paintRect(
                        color1,
                        48,
                        interpolate(d2, 96, 48),
                        96,
                        144,
                    );
                    canvas.paintRect(
                        color2,
                        interpolate(d2, 48, 96),
                        interpolate(d2, 96, 48),
                        96,
                        144,
                    );
                });
            }

            if (d < 1) {
                // 7 rectangle
                canvas.paintRect(
                    color3,
                    interpolate(d, 0, 48),
                    interpolate(d, 0, 96),
                    interpolate(d, 72, 96),
                    interpolate(d, 72, 144),
                );

                // 7 parallelogram
                canvas.paintPath(color2, () => {
                    canvas.moveTo(
                        interpolate(d, 72, 48),
                        interpolate(d, 0, 96),
                    );
                    canvas.lineTo(
                        interpolate(d, 144, 96),
                        interpolate(d, 0, 96),
                    );
                    canvas.lineTo(interpolate(d, 72, 96), 144);
                    canvas.lineTo(interpolate(d, 0, 48), 144);
                    canvas.closePath();
                });
            }
        }
    };

    draw8_9 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [color1, color2, color3] = paints.colors;
        const d1 = decelerate5(progress(glyphProgress, 0, 0.5));
        const d2 = decelerate5(progress(glyphProgress, 0.5, 1));

        // 8
        if (d1 < 1) {
            // top
            canvas.withTranslation(0, interpolate(d1, 0, 48), () => {
                canvas.paintRoundRect(color3, 24, 0, 120, 48, 24);
            });

            if (d1 == 0) {
                // left + middle bottom
                canvas.paintPath(color1, () => {
                    canvas.moveTo(48, 48);
                    canvas.lineTo(96, 48);
                    canvas.lineTo(96, 144);
                    canvas.lineTo(48, 144);
                    canvas.boundedArc(0, 48, 96, 144, 90, 180);
                });

                // right bottom
                canvas.paintBoundedArc(color2, 48, 48, 144, 144, -90, 180);
            } else {
                // bottom middle
                canvas.paintRect(
                    color1,
                    interpolate(d1, 48, 72) - 2,
                    interpolate(d1, 48, 0),
                    interpolate(d1, 96, 72) + 2,
                    144,
                );

                // left bottom
                canvas.withScaleUniform(
                    interpolate(d1, 2 / 3, 1),
                    0,
                    144,
                    () => {
                        canvas.paintBoundedArc(color1, 0, 0, 144, 144, 90, 180);
                    },
                );

                // right bottom
                canvas.withScaleUniform(
                    interpolate(d1, 2 / 3, 1),
                    144,
                    144,
                    () => {
                        canvas.paintBoundedArc(
                            color2,
                            0,
                            0,
                            144,
                            144,
                            -90,
                            180,
                        );
                    },
                );
            }
        } else {
            // 9
            canvas.withRotation(interpolate(d2, -90, -180), 72, 72, () => {
                canvas.paintPath(color3, () => {
                    // parallelogram
                    canvas.moveTo(0, 72);
                    canvas.lineTo(
                        interpolate(d2, 0, 36),
                        interpolate(d2, 72, 0),
                    );
                    canvas.lineTo(
                        interpolate(d2, 72, 108),
                        interpolate(d2, 72, 0),
                    );
                    canvas.lineTo(72, 72);
                    canvas.lineTo(0, 72);
                });

                // vanishing arc
                canvas.paintBoundedArc(
                    color1,
                    0,
                    0,
                    144,
                    144,
                    interpolate(d2, 180, 0),
                    -180,
                );

                // primary arc
                canvas.paintBoundedArc(color2, 0, 0, 144, 144, 0, 180);
            });
        }
    };

    draw9_0 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [color1, color2, color3] = paints.colors;
        const d = decelerate5(glyphProgress);

        // 9
        canvas.withRotation(interpolate(d, -180, -225), 72, 72, () => {
            // parallelogram
            canvas.paintPath(color3, () => {
                canvas.moveTo(0, 72);
                canvas.lineTo(interpolate(d, 36, 0), interpolate(d, 0, 72));
                canvas.lineTo(interpolate(d, 108, 72), interpolate(d, 0, 72));
                canvas.lineTo(72, 72);
                canvas.lineTo(0, 72);
            });

            canvas.paintBoundedArc(
                color3,
                0,
                0,
                144,
                144,
                interpolate(d, 180, 0),
                180,
                true,
            );
            canvas.paintBoundedArc(color2, 0, 0, 144, 144, 0, 180);
        });
    };

    drawSeparator = (
        canvas: Canvas,
        glyphProgress: number,
        paints: Paints,
    ): void => {
        canvas.paintCircle(paints.colors[1], 24, 24, 24);
        canvas.paintCircle(paints.colors[2], 24, 120, 24);
    };

    draw_ = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        // This page intentionally blank.
    };

    draw__1 = (canvas: Canvas, glyphProgress: number, paints: Paints): void => {
        const [_, color2, color3] = paints.colors;
        const d1 = decelerate5(progress(glyphProgress, 0, 0.5));
        const d2 = decelerate5(progress(glyphProgress, 0.5, 1));

        // 1
        canvas.scaleUniformWithPivot(interpolate(d1, 0, 1), 0, 144);
        canvas.paintRect(
            color2,
            interpolate(d2, 28, 0),
            interpolate(d2, 72, 0),
            100,
            interpolate(d2, 144, 48),
        );

        if (d2 > 0) {
            canvas.paintRect(color3, 28, interpolate(d2, 144, 48), 100, 144);
        }
    };

    getWidthAtProgress = (glyphProgress: number): number => {
        switch (this.key) {
            case "0":
            case "0_1":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0.5, 1)),
                    interpolate(
                        decelerate5(progress(glyphProgress, 0, 0.4)),
                        144,
                        192,
                    ),
                    100,
                );
            case "1":
            case "1_2":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0, 0.5)),
                    100,
                    144,
                );
            case "2":
            case "2_3":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0, 0.5)),
                    144,
                    128,
                );
            case "3":
            case "3_4":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0, 0.5)),
                    128,
                    144,
                );
            case "4":
            case "4_5":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0, 0.5)),
                    144,
                    128,
                );
            case "5":
            case "5_6":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0.1, 1)),
                    128,
                    144,
                );
            case "6":
            case "6_7":
                const turningPoint = 0.8;
                const maxChange = 31;
                const d = decelerate5(glyphProgress);
                if (d < turningPoint)
                    return (
                        144 +
                        interpolate(progress(d, 0, turningPoint), 0, maxChange)
                    );
                return (
                    144 +
                    maxChange -
                    interpolate(progress(d, turningPoint, 1), 0, maxChange)
                );

            case "7":
            case "7_8":
                return 144;
            case "8":
            case "8_9":
                return 144;
            case "9":
            case "9_0":
                return 144;
            case " _1":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0, 0.5)),
                    0,
                    100,
                );
            case "1_ ":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0.5, 1)),
                    100,
                    0,
                );
            case "2_ ":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0, 0.5)),
                    144,
                    interpolate(
                        decelerate5(progress(glyphProgress, 0.5, 1)),
                        72,
                        0,
                    ),
                );
            case "2_1":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0, 0.5)),
                    144,
                    100,
                );
            case "3_0":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0, 0.5)),
                    128,
                    144,
                );
            case "5_0":
                return interpolate(
                    decelerate5(progress(glyphProgress, 0, 0.5)),
                    128,
                    144,
                );
            case "2_0":
                return 144;
            case " ":
            case "_":
                return 0;
            case ":":
                return 48;

            default:
                throw `getWidthAtProgress unhandled key ${this.key}`;
        }
    };
}
