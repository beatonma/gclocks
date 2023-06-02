import { FormFont } from "../form/form-font";
import { FormOptions } from "../form/form-renderer";
import { Rect } from "./geometry";
import { TimeFormatter } from "./options/types";
import { ClockLayout } from "./render/clock-layout";

export const measureFormClock = (format: TimeFormatter) => {
    console.log(`measure ${format}`);
    const time = new Date(2023, 4, 16, 0, 0, 0);

    const layout = new ClockLayout(new FormFont(), {
        ...FormOptions,
        spacingPx: 0,
        format: format,
    });

    const bounds = new Rect();
    let widest: string = undefined;
    for (let s = 0; s < 60 * 60 * 24; s++) {
        time.setSeconds(time.getSeconds() + 1);
        const result = debugMeasure(layout, time, bounds);
        if (result) widest = result;
    }
    console.info(`Max boundary: ${widest}: ${bounds} (format=${format})`);

    return `Max boundary: ${widest}: ${bounds} (format=${format})`;
};

const debugMeasure = (layout: ClockLayout<any>, date: Date, bounds: Rect) => {
    layout.update(date);
    let changed = false;
    for (let ms = 0; ms < layout.options.glyphMorphMillis; ms += 10) {
        layout.animationTimeMillis = ms;
        layout.layoutPass((glyph, glyphAnimationProgress, rect) => {
            changed = bounds.include(rect) || changed;
        });
    }

    if (changed) return layout.glyphs.map(it => it.key).join(" ");
};
