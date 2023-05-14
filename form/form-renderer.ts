import { BaseClockRenderer, TimeFormat } from "../render";
import { Options, Paints } from "../render/types";
import { FormFont } from "./form-font";
import { FormGlyph } from "./form-glyph";

const defaultPaints: Paints = {
    strokeWidth: 0,
    colors: ["#FF6D00", "#FFC400", "#FFFFFF"],
};

const defaultOptions: Options = {
    glyphMorphMillis: 800,
    format: TimeFormat.Default,
};

export class FormRenderer extends BaseClockRenderer<FormFont, FormGlyph> {
    constructor(
        paints: Paints = defaultPaints,
        options: Options = defaultOptions
    ) {
        super(paints, options);
    }

    buildFont(): FormFont {
        return new FormFont();
    }
}
