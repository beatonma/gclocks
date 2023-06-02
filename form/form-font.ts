import { BaseFont } from "../render";
import { TimeResolution } from "../render/format";
import { Size } from "../render/geometry";
import { Glyph } from "../render/glyph";
import { Layout, TimeFormatter } from "../render/types";
import { FormGlyph, StaticFormGlyph } from "./form-glyph";

export class FormFont extends BaseFont<FormGlyph> {
    getGlyph = () => new FormGlyph();

    measure(format: TimeFormatter, layout: Layout, spacingPx: number): Size {
        const hasSeconds = format.resolution === TimeResolution.Seconds;

        const lineHeight = StaticFormGlyph.layoutInfo.height;
        const separatorWidth = 48;
        const pairWidth = 352; // max width of a pair of digits.

        switch (layout) {
            case Layout.Horizontal:
                const digitsWidth = 816; // Measured with DebugMeasureClock
                const spacingWidth =
                    spacingPx * (hasSeconds ? 5 + Glyph.SecondScale : 4);

                return new Size(
                    digitsWidth + separatorWidth + spacingWidth,
                    lineHeight
                );

            case Layout.Vertical:
                return new Size(
                    pairWidth + spacingPx,
                    lineHeight * (2 + (hasSeconds ? Glyph.SecondScale : 0)) +
                        spacingPx * 2
                );

            case Layout.Wrapped:
                return new Size(
                    pairWidth * 2 + spacingPx * 4,
                    lineHeight * (1 + (hasSeconds ? Glyph.SecondScale : 0)) +
                        spacingPx
                );
        }
    }
}
