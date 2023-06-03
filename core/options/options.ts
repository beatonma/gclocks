import { Alignment, HorizontalAlignment, VerticalAlignment } from "./alignment";
import { TimeFormat } from "./format";
import { Layout, TimeFormatter } from "./types";

const OptionsSeparator = "__";

interface OptionsInit {
    format?: TimeFormatter;
    glyphMorphMillis?: number;
    spacingPx?: number;
    alignment?: Alignment;
    layout?: Layout;
}

export class Options implements OptionsInit {
    format: TimeFormatter;
    glyphMorphMillis: number;
    spacingPx: number;
    alignment: Alignment;
    layout: Layout;

    constructor(init: OptionsInit) {
        this.merge(init);
    }

    updateSearchParams = (existing: URLSearchParams): URLSearchParams => {
        const horizontalAlignment =
            HorizontalAlignment[
                Alignment.getHorizontalAlignment(this.alignment)
            ];
        const verticalAlignment =
            VerticalAlignment[Alignment.getVerticalAlignment(this.alignment)];

        const serialized: Record<string, string> = {
            format: this.format.name,
            glyphMorphMillis: `${this.glyphMorphMillis}`,
            spacingPx: `${this.spacingPx}`,
            alignment: `${horizontalAlignment}${OptionsSeparator}${verticalAlignment}`,
            layout: Layout[this.layout],
        };

        Object.entries(serialized).forEach(([key, value]) => {
            existing.set(key, value);
        });
        return existing;
    };

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

        return this;
    };

    toString = () => JSON.stringify(this);
}

export namespace Options {
    export const fromSearchParams = (params: string): Options => {
        const searchParams = new URLSearchParams(params);

        const formatKey: keyof Options = "format";
        const glyphMorphMillisKey: keyof Options = "glyphMorphMillis";
        const spacingPxKey: keyof Options = "spacingPx";
        const alignmentKey: keyof Options = "alignment";
        const layoutKey: keyof Options = "layout";

        const parsed: OptionsInit = {
            format: undefined,
            glyphMorphMillis:
                parseInt(searchParams.get(glyphMorphMillisKey)) || undefined,
            spacingPx: parseInt(searchParams.get(spacingPxKey)) || undefined,
            alignment: undefined,
            layout: undefined,
        };

        if (searchParams.has(formatKey)) {
            const formatterName = searchParams.get(
                formatKey
            ) as keyof typeof TimeFormat;
            parsed.format = TimeFormat[formatterName];
        }

        if (searchParams.has(alignmentKey)) {
            const alignmentName = searchParams.get(alignmentKey);
            if (alignmentName.includes(OptionsSeparator)) {
                const [horizontal, vertical] =
                    alignmentName.split(OptionsSeparator);

                parsed.alignment =
                    HorizontalAlignment[
                        horizontal as keyof typeof HorizontalAlignment
                    ] |
                    VerticalAlignment[
                        vertical as keyof typeof VerticalAlignment
                    ];
            }
        }

        if (searchParams.has(layoutKey)) {
            const layoutName = searchParams.get(layoutKey);
            parsed.layout = Layout[layoutName as keyof typeof Layout];
        }

        return new Options(parsed);
    };
}
