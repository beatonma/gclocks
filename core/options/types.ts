import { Glyph, GlyphRole } from "../glyph";
import { TimeResolution } from "./format";

export type TimeFormatter = {
    name: string;
    roles: GlyphRole[];
    apply: (date: Date) => string;
    applyRole: <T extends Glyph>(glyph: T, index: number) => T;
    resolution: TimeResolution;
};

export interface Options {
    format: TimeFormatter;
    glyphMorphMillis: number;
    spacingPx: number;
    alignment: Alignment;
    layout: Layout;
}

export enum Layout {
    // Starting from zero causes issues with parsing from search params and switch/case.
    Horizontal = 1, // All in one line
    Vertical, // Hours, minutes, seconds on separate lines.
    Wrapped, // Hours and seconds on one line, seconds below.
}

export enum HorizontalAlignment {
    _ = 0,
    Start = 1 << 0,
    Center = 1 << 1,
    End = 1 << 2,
    None = 1 << 3,
}

export enum VerticalAlignment {
    _ = 0,
    Top = 1 << 4,
    Center = 1 << 5,
    Bottom = 1 << 6,
    None = 1 << 7,
}

export type Alignment = HorizontalAlignment | VerticalAlignment;
