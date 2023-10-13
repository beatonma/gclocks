import { Alignment } from "core/options/alignment";
import { Canvas, PaintStyle } from "core/render/types";

abstract class Io18Animation {
    x: number;
    y: number;
    rotation: number = 0; // Degrees
    paintStyle: PaintStyle = PaintStyle.Stroke;

    // 0 <= t <= 1, animation progress
    abstract drawEnter(canvas: Canvas, t: number): void;

    abstract drawExit(canvas: Canvas, t: number): void;

    protected constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

abstract class GridAnimation extends Io18Animation {
    rows: number;
    columns: number;
    spaceBetweenPx: number;
    cellCount: number;

    // TODO interpolation.

    constructor(
        x: number,
        y: number,
        rows: number,
        columns: number,
        spaceBetweenPx: number,
    ) {
        super(x, y);
        this.rows = rows;
        this.columns = columns;
        this.spaceBetweenPx = spaceBetweenPx;
        this.cellCount = rows * columns;
    }
}

/**
 * Grid of squares - overall shape is an arbitrary rectangle.
 */
export class SquareGrid extends GridAnimation {
    static fill = (
        left: number,
        top: number,
        width: number,
        height: number,
        alignment: Alignment,
    ): SquareGrid => {
        const spaceBetween = 13;
        const paintWidth = 3;
        const insetWidth = width - paintWidth;
        const insetHeight = height - paintWidth;
        const rows = Math.floor(insetHeight / spaceBetween);
        const cols = Math.floor(insetWidth / spaceBetween);
        const x = Alignment.applyHorizontal(
            alignment,
            cols * spaceBetween + paintWidth,
            width,
            left,
        );
        const y = Alignment.applyVertical(
            alignment,
            rows * spaceBetween * paintWidth,
            height,
            top,
        );

        return new SquareGrid(x, y, rows, cols, spaceBetween);
    };

    drawEnter(canvas: Canvas, t: number) {
        this.drawEnterLTR(canvas, t);
    }

    drawEnterLTR(canvas: Canvas, t: number) {
        const maxCells = Math.floor(t * this.cellCount);
        let count = 0;
        for (let col = 0; col < this.columns; col++) {
            for (let row = 0; row < this.rows; row++) {
                if (++count > maxCells) return;
                this.drawRect(canvas, row, col);
            }
        }
    }

    drawEnterRTL(canvas: Canvas, t: number) {
        const maxCells = Math.floor(t * this.cellCount);
        let count = 0;
        for (let col = this.columns - 1; col >= 0; col--) {
            for (let row = 0; row < this.rows; row++) {
                if (++count > maxCells) return;
                this.drawRect(canvas, row, col);
            }
        }
    }

    drawRect(canvas: Canvas, row: number, column: number) {
        canvas.rect(
            column * this.spaceBetweenPx + this.x,
            row * this.spaceBetweenPx + this.y,
            (column + 1) * this.spaceBetweenPx,
            (row + 1) * this.spaceBetweenPx,
        );
    }

    drawExit(canvas: Canvas, t: number) {
        this.drawExitLTR(canvas, t);
    }

    drawExitLTR(canvas: Canvas, t: number) {
        this.drawEnterRTL(canvas, 1 - t);
    }

    drawExitRTL(canvas: Canvas, t: number) {
        const maxCells = Math.floor(t * this.cellCount);
        let count = 0;
        for (let col = this.columns - 1; col >= 0; col--) {
            for (let row = this.rows - 1; row >= 0; row--) {
                if (++count > maxCells) return;
                this.drawRect(canvas, row, col);
            }
        }
    }
}
