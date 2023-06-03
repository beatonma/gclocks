import { ClockRenderer, DefaultOptions, TimeFormat } from "../core";
import {
    HorizontalAlignment,
    Layout,
    Options,
    VerticalAlignment,
} from "../core/options/types";
import { Paints, PaintStyle } from "../core/render/types";

export const FormPaints: Paints = {
    defaultPaintStyle: PaintStyle.Fill,
    strokeWidth: 0,
    colors: ["#FF6D00", "#FFC400", "#FFFFFF"],
};

export const FormOptions: Options = {
    ...DefaultOptions,
    format: TimeFormat.HH_MM_SS_24,
    layout: Layout.Wrapped,
    alignment: HorizontalAlignment.End | VerticalAlignment.Top,
};

export class FormRenderer extends ClockRenderer {
    constructor() {
        super(FormPaints);
    }
}
