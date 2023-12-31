import { BaseFont } from "core/font";
import { Size } from "core/geometry";
import { Layout, TimeFormatter } from "core/options/types";
import { StaticFormGlyph } from "form/form-glyph";
import { Io18Glyph, StaticIo19Glyph } from "io18/io18-glyph";

export class Io18Font extends BaseFont<Io18Glyph> {
    getGlyph = () => new Io18Glyph();

    measure = (
        format: TimeFormatter,
        layout: Layout,
        spacingPx: number,
    ): Size => {
        // TODO
        return new Size(
            StaticIo19Glyph.layoutInfo.width * format.roles.length,
            StaticFormGlyph.layoutInfo.height,
        );
    };
}
