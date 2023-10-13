import { Glyph, GlyphRole } from "core/glyph";
import { TimeResolution } from "core/options/format";

export interface TimeFormatter {
    name: string;
    roles: GlyphRole[];
    apply: (date: Date) => string;
    applyRole: <T extends Glyph>(glyph: T, index: number) => T;
    resolution: TimeResolution;
}

export enum Layout {
    // Starting from zero causes issues with parsing from search params and switch/case.
    Horizontal = 1, // All in one line
    Vertical, // Hours, minutes, seconds on separate lines.
    Wrapped, // Hours and seconds on one line, seconds below.
}
