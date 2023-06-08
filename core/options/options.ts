import { Alignment } from "./alignment";
import { Layout, TimeFormatter } from "./types";

export interface OptionsInit {
    format?: TimeFormatter;
    glyphMorphMillis?: number;
    spacingPx?: number;
    alignment?: Alignment;
    layout?: Layout;
    backgroundColor?: string;
}

export class Options implements OptionsInit {
    format: TimeFormatter;
    glyphMorphMillis: number;
    spacingPx: number;
    alignment: Alignment;
    layout: Layout;
    backgroundColor: string | null;

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

        return this;
    };

    toString = () => JSON.stringify(this);
}
