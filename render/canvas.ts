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
            this.fillText(text, x, y);
        }
    );

    addExtension("paint", function (color: string, type?: PaintStyle) {
        if (!type) {
            type = this.paintStyle;
        }
        switch (type) {
            case PaintStyle.Fill:
                this.fillPaint(color);
                return;
            case PaintStyle.Stroke:
                this.strokePaint(color);
                return;
            default:
                throw "canvas.paint: PaintStyle is required.";
        }
    });

    addExtension("strokePaint", function (color: string) {
        this.strokeStyle = color;
        this.stroke();
    });

    addExtension("fillPaint", function (color: string) {
        this.fillStyle = color;
        this.fill();
    });

    addExtension(
        "paintCircle",
        function (
            centerX: number,
            centerY: number,
            radius: number,
            color: string
        ) {
            this.beginPath();
            this.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.paint(color);
        }
    );

    // Overrides native method.
    addExtension(
        "paintRect",
        function (
            left: number,
            top: number,
            right: number,
            bottom: number,
            color: string
        ) {
            this.beginPath();
            this.rect(left, top, right - left, bottom - top);
            this.paint(color);
        }
    );

    addExtension(
        "scaleWithPivot",
        function (scale: number, pivotX: number, pivotY: number) {
            this.translate(pivotX, pivotY);
            this.scale(scale, scale);
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
            color?: string
        ) {
            if (color != undefined) {
                this.beginPath();
            }
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
                toRadians(startAngle + sweepAngle)
            );

            if (color != undefined) {
                this.paint(color);
            }
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
        "withTranslate",
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
            scale: number,
            pivotX: number = 0,
            pivotY = 0,
            block: () => void
        ) {
            this.withCheckpoint(() => {
                this.scaleWithPivot(scale, pivotX, pivotY);
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
};
