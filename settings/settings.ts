import { Rect } from "core/geometry";
import { DefaultOptions, TimeFormat } from "core/index";
import {
    Alignment,
    HorizontalAlignment,
    VerticalAlignment,
} from "core/options/alignment";
import { Options, OptionsInit } from "core/options/options";
import { Layout, TimeFormatter } from "core/options/types";
import { ClockAnimator } from "core/render/clock-animator";
import { Paints } from "core/render/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const useClockSettings = (
    clock?: ClockAnimator<any>,
): [
    Paints,
    Dispatch<SetStateAction<Paints>>,
    Options,
    Dispatch<SetStateAction<Options>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
] => {
    const [paints, setPaints] = useState(clock?.getPaints());
    const [options, setOptions] = useState(clock?.getOptions());
    const [settingsVisible, setSettingsVisible] = useState(true);

    useEffect(() => {
        const urlPaints = Settings.parseUrlPaints(paints);
        setPaints(urlPaints);

        const urlOptions = Settings.parseUrlOptions(options);
        setOptions(urlOptions);
    }, [clock]);

    useEffect(() => {
        clock?.setPaints(paints);
        Settings.setUrlPaints(paints);
    }, [paints]);

    useEffect(() => {
        clock?.setOptions(options);
        Settings.setUrlOptions(options);
    }, [options]);

    return [
        paints,
        setPaints,
        options,
        setOptions,
        settingsVisible,
        setSettingsVisible,
    ];
};

export namespace Settings {
    const Separator = "__";
    let updateHistoryStateTimer: ReturnType<typeof setTimeout> = undefined;

    const updateHistoryState = (query: string) => {
        // Apply rate-limiting to history state updates to avoid throttling by browser.
        const RateLimitMillis = 250;

        if (updateHistoryStateTimer) {
            clearTimeout(updateHistoryStateTimer);
        }
        updateHistoryStateTimer = setTimeout(() => {
            history.replaceState({}, null, query);
        }, RateLimitMillis);
    };

    const PaintParam: Record<keyof Paints, keyof Paints> = {
        colors: "colors",
        defaultPaintStyle: "defaultPaintStyle",
        strokeWidth: "strokeWidth",
    };

    const OptionParam: Record<keyof OptionsInit, keyof OptionsInit> = {
        format: "format",
        glyphMorphMillis: "glyphMorphMillis",
        spacingPx: "spacingPx",
        alignment: "alignment",
        layout: "layout",
        backgroundColor: "backgroundColor",
        bounds: "bounds",
    };

    export const listOf = (...args: string[]): string =>
        encodeURIComponent(args.join(Separator));
    export const splitList = (value: string): string[] =>
        decodeURIComponent(value).split(Separator);

    export const parseUrlOptions = (
        defaults: Options,
        params?: string,
    ): Options => {
        const opts = paramsToOptions(params ?? location.search);

        return defaults.merge(opts);
    };

    export const setUrlOptions = (
        options: Options,
        params?: string,
    ): URLSearchParams => {
        const updated = optionsToParams(
            options,
            new URLSearchParams(params ?? location.search),
        );

        updateHistoryState(`?${updated}`);

        return updated;
    };

    export const setUrlPaints = (paints: Paints, params?: string) => {
        const searchParams = new URLSearchParams(params ?? location.search);

        searchParams.set(PaintParam.colors, listOf(...paints.colors));
        updateHistoryState(`?${searchParams}`);
        return searchParams;
    };

    export const parseUrlPaints = (
        defaults: Paints,
        params?: string,
    ): Paints => {
        const searchParams = new URLSearchParams(params ?? location.search);

        const colorsString = decodeURIComponent(
            searchParams.get(PaintParam.colors),
        );
        if (!!colorsString) {
            const colors = splitList(colorsString)
                .map(Parse.color)
                .filter(Boolean);

            if (colors.length === defaults.colors.length) {
                defaults.colors = colors;
            }
        }

        return defaults;
    };

    const optionsToParams = (
        options: Options,
        params: URLSearchParams,
    ): URLSearchParams => {
        const horizontalAlignment =
            HorizontalAlignment[
                Alignment.getHorizontalAlignment(options.alignment)
            ];
        const verticalAlignment =
            VerticalAlignment[
                Alignment.getVerticalAlignment(options.alignment)
            ];

        const serialized: Record<string, string> = {
            [OptionParam.format]: options.format.name,
            [OptionParam.glyphMorphMillis]: `${options.glyphMorphMillis}`,
            [OptionParam.spacingPx]: `${options.spacingPx}`,
            [OptionParam.alignment]: Settings.listOf(
                horizontalAlignment,
                verticalAlignment,
            ),
            [OptionParam.layout]: Layout[options.layout],
            [OptionParam.backgroundColor]: options.backgroundColor,
            [OptionParam.bounds]: Settings.listOf(
                ...[...options.bounds].map(floatToString),
            ),
        };

        Object.entries(serialized).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });
        return params;
    };

    const paramsToOptions = (params: string): Options => {
        const searchParams = new URLSearchParams(params);

        const parsed: OptionsInit = {
            format: Parse.timeFormat(searchParams.get(OptionParam.format)),
            glyphMorphMillis:
                parseInt(searchParams.get(OptionParam.glyphMorphMillis)) ||
                undefined,
            spacingPx:
                parseInt(searchParams.get(OptionParam.spacingPx)) || undefined,
            alignment: Parse.alignment(searchParams.get(OptionParam.alignment)),
            layout: Parse.layout(searchParams.get(OptionParam.layout)),
            backgroundColor: Parse.color(
                searchParams.get(OptionParam.backgroundColor),
            ),
            bounds: Parse.bounds(searchParams.get(OptionParam.bounds)),
        };

        return new Options(parsed);
    };
}

namespace Parse {
    import splitList = Settings.splitList;
    export const color = (color: string) => {
        if (/--.+/.test(color)) {
            const documentStyle = getComputedStyle(document.documentElement);
            return documentStyle.getPropertyValue(color);
        }
        return color;
    };

    export const alignment = (value: string): Alignment => {
        if (!value) return null;
        const [horizontal, vertical] = Settings.splitList(value);

        return (
            HorizontalAlignment[
                horizontal as keyof typeof HorizontalAlignment
            ] | VerticalAlignment[vertical as keyof typeof VerticalAlignment]
        );
    };

    export const layout = (value: string): Layout => {
        if (!value) return null;
        return Layout[value as keyof typeof Layout];
    };

    export const timeFormat = (value: string): TimeFormatter => {
        if (!value) return null;
        return TimeFormat[value as keyof typeof TimeFormat];
    };

    export const bounds = (value: string): Rect => {
        const values = splitList(value);

        try {
            if (values.length === 4) {
                return new Rect(...values.map(parseFloat));
            }
        } catch {
            console.warn(
                `Unexpected value for bounds: '${value}'. Using default bounds instead.`,
            );
        }
        return DefaultOptions.bounds;
    };
}

const floatToString = (float: number): string => {
    const formattedNumber = float.toFixed(3);
    return parseFloat(formattedNumber).toString();
};
