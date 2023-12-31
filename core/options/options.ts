import { Rect } from "core/geometry";
import { Alignment } from "core/options/alignment";
import { Layout, TimeFormatter } from "core/options/types";

export interface OptionsInit {
    format?: TimeFormatter;
    glyphMorphMillis?: number;
    spacingPx?: number;
    alignment?: Alignment;
    layout?: Layout;
    backgroundColor?: string;
    bounds?: Rect;
}

export class Options implements OptionsInit {
    format: TimeFormatter;
    glyphMorphMillis: number;
    spacingPx: number;
    alignment: Alignment;
    layout: Layout;
    backgroundColor: string | null;
    bounds: Rect;

    constructor(init: OptionsInit) {
        this.merge(init);
    }

    /**
     * Update this instance with the values from the other.
     * If the other instance has an undefined value, keep the existing value.
     */
    merge = (other: OptionsInit): Options => {
        this.format = other.format ?? this.format;
        this.glyphMorphMillis = other.glyphMorphMillis ?? this.glyphMorphMillis;
        this.spacingPx = other.spacingPx ?? this.spacingPx;
        this.alignment = other.alignment ?? this.alignment;
        this.layout = other.layout ?? this.layout;
        this.backgroundColor = other.backgroundColor ?? this.backgroundColor;
        this.bounds = other.bounds ?? this.bounds;

        return this;
    };

    toString = () => JSON.stringify(this);
}
