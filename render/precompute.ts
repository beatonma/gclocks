import { FormRenderer } from "../form";
import { FormOptions } from "../form/form-renderer";
import { Rect } from "./geometry";
import { TimeFormatter } from "./types";

export const measureFormClock = (format: TimeFormatter) => {
    console.log(`measure ${format}`);
    const time = new Date(2023, 4, 16, 0, 0, 0);
    let renderer = new FormRenderer({
        ...FormOptions,
        spacingPx: 0,
        format: format,
    });

    const bounds = new Rect();
    let widest: string = undefined;
    for (let s = 0; s < 60 * 60 * 24; s++) {
        time.setSeconds(time.getSeconds() + 1);
        const result = renderer.debugMeasure(time, bounds);
        if (result) widest = result;
    }
    console.info(`Max boundary: ${widest}: ${bounds} (format=${format})`);

    return `Max boundary: ${widest}: ${bounds} (format=${format})`;
};
