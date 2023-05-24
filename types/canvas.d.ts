interface CanvasRenderingContext2D {
    paintStyle: PaintStyle;

    text(color: string, text: string, x: number, y: number): void;

    paint(color: string, style?: PaintStyle): void;

    paintCircle(
        color: string,
        centerX: number,
        centerY: number,
        radius: number
    );

    /**
     * Beware that we are using right and bottom, not width and height.
     */
    paintRect(
        color: string,
        leftOrRect: number | Rect,
        top?: number,
        right?: number,
        bottom?: number
    ): void;

    paintRoundRect(
        color: string,
        left: number,
        top: number,
        right: number,
        bottom: number,
        ...radii: number[]
    ): void;

    boundedArc(
        left: number,
        top: number,
        right: number,
        bottom: number,
        startAngle: number,
        sweepAngle: number,
        counterClockwise: boolean = false
    ): void;

    paintBoundedArc(
        color: string,
        left: number,
        top: number,
        right: number,
        bottom: number,
        startAngle: number,
        sweepAngle: number,
        counterClockwise: boolean = false
    ): void;

    scaleWithPivot(
        scaleX: number,
        scaleY: number,
        pivotX: number,
        pivotY: number
    ): void;

    scaleUniformWithPivot(scale: number, pivotX: number, pivotY: number): void;

    rotateWithPivot(angleDegrees: number, pivotX: number, pivotY: number): void;

    paintPath(color: string, block: () => void): void;

    withCheckpoint(block: () => void): void;

    withTranslation(x: number, y: number, block: () => void): void;

    withScale(
        scaleX: number,
        scaleY: number,
        pivotX: number,
        pivotY: number,
        block: () => void
    ): void;

    withScaleUniform(
        scale: number,
        pivotX: number,
        pivotY: number,
        block: () => void
    ): void;

    withRotation(
        angleDegrees: number,
        pivotX: number,
        pivotY: number,
        block: () => void
    ): void;

    withPaintStyle(paintStyle: PaintStyle, block: () => void): void;
}
