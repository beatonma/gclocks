import { BaseFont, TimeFormat } from "../render";
import { Size } from "../render/geometry";
import { Glyph } from "../render/glyph";
import { Layout, TimeFormatter } from "../render/types";
import { FormGlyph, StaticFormGlyph } from "./form-glyph";

export class FormFont extends BaseFont<FormGlyph> {
    getGlyph = (index: number) => new FormGlyph();

    measure(format: TimeFormatter, layout: Layout, spacingPx: number): Size {
        const hasSeconds = format.roles.length > 5;

        const lineHeight = StaticFormGlyph.layoutInfo.height;

        switch (layout) {
            case Layout.Horizontal:
                return new Size(
                    (hasSeconds ? 1104 : 672) +
                        spacingPx * (format.roles.length - 1),
                    lineHeight
                );

            case Layout.Vertical:
                return new Size(
                    336 + spacingPx,
                    lineHeight * (2 + (hasSeconds ? Glyph.SecondScale : 0))
                );

            case Layout.Wrapped:
                return new Size(
                    672 + spacingPx * 4,
                    lineHeight * (1 + (hasSeconds ? Glyph.SecondScale : 0))
                );
        }
    }
}
