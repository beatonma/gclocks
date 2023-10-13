import { Size } from "core/geometry";
import { Glyph } from "core/glyph";
import { Layout, TimeFormatter } from "core/options/types";

export interface Font<G extends Glyph> {
    getGlyph: (index: number) => G;
    /**
     * Return the maximum possible Size of the clock with native (1x) scaling.
     */
    measure: (format: TimeFormatter, layout: Layout, spacingPx: number) => Size;
}

export abstract class BaseFont<G extends Glyph> implements Font<G> {
    abstract getGlyph: (index: number) => G;

    abstract measure(
        format: TimeFormatter,
        layout: Layout,
        spacingPx: number,
    ): Size;
}
