import { ClockRenderer, DefaultOptions } from "core/index";
import { Options } from "core/options/options";
import { Paints, PaintStyle } from "core/render/types";

export const Io18Paints: Paints = {
    defaultPaintStyle: PaintStyle.Fill,
    strokeWidth: 8,
    colors: ["red", "green", "blue", "white"],
};

export const Io18Options: Options = {
    ...DefaultOptions,
};

export class Io18Renderer extends ClockRenderer {
    constructor(paints: Paints = Io18Paints) {
        super(paints);
    }
}
