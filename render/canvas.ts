import { toRadians } from "./math";

export const canvasExtensions = () => {
    Object.defineProperty(CanvasRenderingContext2D.prototype, "text", {
        value: function (text: string, x: number, y: number, color: string) {
            this.fillStyle = color;
            this.fillText(text, x, y);
        },
    });

    Object.defineProperty(CanvasRenderingContext2D.prototype, "strokePaint", {
        value: function (color: string) {
            this.strokeStyle = color;
            this.stroke();
        },
    });

    Object.defineProperty(CanvasRenderingContext2D.prototype, "fillPaint", {
        value: function (color: string) {
            this.fillStyle = color;
            this.fill();
        },
    });

    Object.defineProperty(CanvasRenderingContext2D.prototype, "fillCircle", {
        value: function (
            centerX: number,
            centerY: number,
            radius: number,
            color: string
        ) {
            this.beginPath();
            this.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.fillPaint(color);
        },
    });

    Object.defineProperty(
        CanvasRenderingContext2D.prototype,
        "scaleWithPivot",
        {
            value: function (scale: number, pivotX: number, pivotY: number) {
                this.translate(pivotX, pivotY);
                this.scale(scale, scale);
                this.translate(-pivotX, -pivotY);
            },
        }
    );

    Object.defineProperty(
        CanvasRenderingContext2D.prototype,
        "rotateWithPivot",
        {
            value: function (angle: number, pivotX: number, pivotY: number) {
                this.translate(pivotX, pivotY);
                this.rotate(angle, angle);
                this.translate(-pivotX, -pivotY);
            },
        }
    );

    Object.defineProperty(CanvasRenderingContext2D.prototype, "boundedArc", {
        value: function (
            left: number,
            top: number,
            right: number,
            bottom: number,
            startAngle: number,
            sweepAngle: number
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
                toRadians(startAngle + sweepAngle)
            );
        },
    });
};
