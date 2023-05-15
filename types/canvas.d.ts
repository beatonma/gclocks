interface CanvasRenderingContext2D {
    paintStyle: PaintStyle;

    text(text: string, x: number, y: number, color: string): void;

    strokePaint(color: string): void;

    fillPaint(color: string): void;

    paintCircle(
        centerX: number,
        centerY: number,
        radius: number,
        color: string
    );

    /**
     * Beware that we are using right and bottom, not width and height.
     */
    paintRect(
        left: number,
        top: number,
        right: number,
        bottom: number,
        color: string
    ): void;

    boundedArc(
        left: number,
        top: number,
        right: number,
        bottom: number,
        startAngle: number,
        sweepAngle: number,
        color?: string
    ): void;

    scaleWithPivot(scale: number, pivotX: number, pivotY: number): void;

    rotateWithPivot(angleDegrees: number, pivotX: number, pivotY: number): void;

    paintPath(color: string, block: () => void): void;

    withCheckpoint(block: () => void): void;

    withTranslate(x: number, y: number, block: () => void): void;

    withScale(
        scale: number,
        pivotX: number = 0,
        pivotY = 0,
        block: () => void
    ): void;

    withRotation(
        angleDegrees: number,
        pivotX: number = 0,
        pivotY = 0,
        block: () => void
    ): void;

    paint(color: string, style?: PaintStyle): void;
}
