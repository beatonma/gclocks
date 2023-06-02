export type Canvas = CanvasRenderingContext2D;

export interface Paints {
    defaultPaintStyle: PaintStyle;
    colors: string[];
    strokeWidth: number;
}

export enum PaintStyle {
    Fill,
    Stroke,
}
