import { TimeFormat } from "./format";
import { Glyph } from "./glyph";

export interface Font<G extends Glyph> {
    getGlyph: (index: number) => G;
    getWidestTime: () => Record<keyof typeof TimeFormat, string>;
}

export abstract class BaseFont<G extends Glyph> implements Font<G> {
    abstract getGlyph: (index: number) => G;

    getWidestTime = (): Record<keyof typeof TimeFormat, string> => {
        return {
            HH_MM_SS_24: "00:00:00",
            HH_MM_SS_12: "00:00:00",
        };
    };
}
