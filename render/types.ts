export type TimeFormatter = (date: Date) => string;
export type Canvas = CanvasRenderingContext2D;

// export { Glyph, GlyphState, GlyphStateLock } from "./glyph";
// export { Font } from "./font";
// export { ClockRenderer } from "./renderer";

export interface Options {
    format: TimeFormatter;
    glyphMorphMillis: 800;
}

export interface Paints {
    colors: string[];
    strokeWidth: number;
}

export enum PaintStyle {
    Fill,
    Stroke,
}
