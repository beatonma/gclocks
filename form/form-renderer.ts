import { BaseClockRenderer, DefaultOptions, TimeFormat } from "../render";
import { DefaultRenderOptions, RenderOptions } from "../render/renderer";
import { Options, Paints, PaintStyle } from "../render/types";
import { FormFont } from "./form-font";
import { FormGlyph } from "./form-glyph";

export const FormPaints: Paints = {
    defaultPaintStyle: PaintStyle.Fill,
    strokeWidth: 0,
    colors: ["#FF6D00", "#FFC400", "#FFFFFF"],
};

export const FormOptions: Options = {
    ...DefaultOptions,
    format: TimeFormat.HH_MM_SS_24,
};

export class FormRenderer extends BaseClockRenderer<FormFont, FormGlyph> {
    constructor(
        options: Options = FormOptions,
        renderOptions: RenderOptions = DefaultRenderOptions,
        paints: Paints = FormPaints
    ) {
        super(paints, options, renderOptions);
    }

    buildFont(): FormFont {
        return new FormFont();
    }
}
