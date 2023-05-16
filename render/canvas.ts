import { toRadians } from "./math";
import { PaintStyle } from "./types";

export const canvasExtensions = () => {
    const addExtension = <T>(name: string, func: (...args: any) => T) => {
        Object.defineProperty(CanvasRenderingContext2D.prototype, name, {
            value: func,
        });
    };

    Object.defineProperty(CanvasRenderingContext2D.prototype, "paintStyle", {
        value: PaintStyle.Fill,
        writable: true,
    });

    addExtension(
        "text",
        function (text: string, x: number, y: number, color: string) {
            this.fillStyle = color;
            this.font = "48px sans-serif";
            this.fillText(text, x, y);
        }
    );

    addExtension(
        "paint",
        function (color: string, type: PaintStyle = this.paintStyle) {
            switch (type) {
                case PaintStyle.Fill:
                    return fillPaint(this, color);
                case PaintStyle.Stroke:
                    return strokePaint(this, color);
            }
        }
    );

    addExtension(
        "paintCircle",
        function (
            color: string,
            centerX: number,
            centerY: number,
            radius: number
        ) {
            this.paintPath(color, () => {
                this.arc(centerX, centerY, radius, 0, Math.PI * 2);
            });
        }
    );

    addExtension(
        "paintRect",
        function (
            color: string,
            left: number,
            top: number,
            right: number,
            bottom: number
        ) {
            this.paintPath(color, () => {
                this.rect(left, top, right - left, bottom - top);
            });
        }
    );

    addExtension(
        "paintRoundRect",
        function (
            color: string,
            left: number,
            top: number,
            right: number,
            bottom: number,
            ...radii: number[]
        ) {
            this.paintPath(color, () => {
                this.roundRect(left, top, right - left, bottom - top, radii);
            });
        }
    );

    addExtension(
        "scaleUniformWithPivot",
        function (scale: number, pivotX: number, pivotY: number) {
            this.scaleWithPivot(scale, scale, pivotX, pivotY);
        }
    );

    addExtension(
        "scaleWithPivot",
        function (
            scaleX: number,
            scaleY: number,
            pivotX: number,
            pivotY: number
        ) {
            this.translate(pivotX, pivotY);
            this.scale(scaleX, scaleY);
            this.translate(-pivotX, -pivotY);
        }
    );

    addExtension(
        "rotateWithPivot",
        function (angle: number, pivotX: number, pivotY: number) {
            const rads = toRadians(angle);
            this.translate(pivotX, pivotY);
            this.rotate(rads, rads);
            this.translate(-pivotX, -pivotY);
        }
    );

    addExtension(
        "boundedArc",
        function (
            left: number,
            top: number,
            right: number,
            bottom: number,
            startAngle: number,
            sweepAngle: number,
            counterClockwise: boolean = false
        ) {
            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;
            const radiusX = (right - left) / 2;
            const radiusY = (bottom - top) / 2;

            this.ellipse(
                centerX,
                centerY,
                radiusX,
                radiusY,
                0,
                toRadians(startAngle),
                toRadians(startAngle + sweepAngle),
                counterClockwise
            );
        }
    );

    addExtension(
        "paintBoundedArc",
        function (
            color: string,
            left: number,
            top: number,
            right: number,
            bottom: number,
            startAngle: number,
            sweepAngle: number,
            counterClockwise: boolean = false
        ) {
            this.paintPath(color, () => {
                this.boundedArc(
                    left,
                    top,
                    right,
                    bottom,
                    startAngle,
                    sweepAngle,
                    counterClockwise
                );
            });
        }
    );

    addExtension("paintPath", function (color: string, block: () => void) {
        this.beginPath();
        block();
        this.paint(color);
    });

    addExtension("withCheckpoint", function (block: () => void) {
        this.save();
        block();
        this.restore();
    });

    addExtension(
        "withTranslation",
        function (x: number, y: number, block: () => void) {
            this.withCheckpoint(() => {
                this.translate(x, y);
                block();
            });
        }
    );

    addExtension(
        "withScale",
        function (
            scaleX: number,
            scaleY: number,
            pivotX: number = 0,
            pivotY = 0,
            block: () => void
        ) {
            this.withCheckpoint(() => {
                this.scaleWithPivot(scaleX, scaleY, pivotX, pivotY);
                block();
            });
        }
    );

    addExtension(
        "withScaleUniform",
        function (
            scale: number,
            pivotX: number = 0,
            pivotY = 0,
            block: () => void
        ) {
            this.withCheckpoint(() => {
                this.scaleUniformWithPivot(scale, pivotX, pivotY);
                block();
            });
        }
    );

    addExtension(
        "withRotation",
        function (
            angleDegrees: number,
            pivotX: number = 0,
            pivotY = 0,
            block: () => void
        ) {
            this.withCheckpoint(() => {
                this.rotateWithPivot(angleDegrees, pivotX, pivotY);
                block();
            });
        }
    );

    addExtension(
        "withPaintStyle",
        function (paintStyle: PaintStyle, block: () => void) {
            const previous = this.paintStyle;
            this.paintStyle = paintStyle;
            block();
            this.paintStyle = previous;
        }
    );
};

const strokePaint = (canvas: CanvasRenderingContext2D, color: string) => {
    canvas.strokeStyle = color;
    canvas.stroke();
};

const fillPaint = (canvas: CanvasRenderingContext2D, color: string) => {
    canvas.fillStyle = color;
    canvas.fill();
};
