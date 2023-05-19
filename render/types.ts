import { Glyph, GlyphRole } from "./glyph";

export type TimeFormatter = {
    roles: GlyphRole[];
    apply: (date: Date) => string;
    applyRole: <T extends Glyph>(glyph: T, index: number) => T;
};
export type Canvas = CanvasRenderingContext2D;

export interface Options {
    format: TimeFormatter;
    glyphMorphMillis: number;
    spacingPx: number;
    alignment: Alignment;
    layout: Layout;
}

export interface Paints {
    defaultPaintStyle: PaintStyle;
    colors: string[];
    strokeWidth: number;
}

export enum PaintStyle {
    Fill,
    Stroke,
}

export enum Alignment {
    Start,
    Center,
    End,
}

export enum Layout {
    Horizontal, // All in one line
    Vertical, // Hours, minutes, seconds on separate lines.
    Wrapped, // Hours and seconds on one line, seconds below.
}
