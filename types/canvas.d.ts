interface CanvasRenderingContext2D {
    text(text: string, x: number, y: number, color: string): void;

    strokePaint(color: string): void;

    fillPaint(color: string): void;

    fillCircle(centerX: number, centerY: number, radius: number, color: string);

    boundedArc(
        left: number,
        top: number,
        right: number,
        bottom: number,
        startAngle: number,
        sweepAngle: number
    ): void;

    scaleWithPivot(scale: number, pivotX: number, pivotY: number): void;

    rotateWithPivot(angle: number, pivotX: number, pivotY: number): void;

    withPath(block: () => void): void;

    withCheckpoint(block: () => void): void;

    /**
     * Beware that we are using right and bottom, not width and height.
     */
    fillRect(
        left: number,
        top: number,
        right: number,
        bottom: number,
        color: string
    ): void;
}
