import { useEffect, useState } from "react";
import { TimeFormat } from "../core";
import {
    Alignment,
    HorizontalAlignment,
    VerticalAlignment,
} from "../core/options/alignment";
import { Options, OptionsInit } from "../core/options/options";
import { Layout } from "../core/options/types";
import { ClockAnimator } from "../core/render/clock-animator";

import { Paints } from "../core/render/types";

export const useClockSettings = (
    clock?: ClockAnimator<any>
): [
    Paints,
    (setState: Paints) => void,
    Options,
    (setState: Options) => void,
    boolean,
    (setState: boolean) => void
] => {
    const [paints, setPaints] = useState(clock?.getPaints());
    const [options, setOptions] = useState(clock?.getOptions());
    const [settingsVisible, setSettingsVisible] = useState(false);

    useEffect(() => {
        const urlPaints = PersistentSettings.parseUrlPaints(paints);
        setPaints(urlPaints);

        const urlOptions = PersistentSettings.parseUrlOptions(options);
        setOptions(urlOptions);
    }, [clock]);

    useEffect(() => {
        clock?.setPaints(paints);
        PersistentSettings.setUrlPaints(paints);
    }, [paints]);

    useEffect(() => {
        clock?.setOptions(options);
        PersistentSettings.setUrlOptions(options);
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

export namespace PersistentSettings {
    const Separator = "__";

    export const listOf = (...args: string[]): string => args.join(Separator);
    export const splitList = (value: string): string[] =>
        value.split(Separator);

    export const parseUrlOptions = (
        defaults: Options,
        params?: string
    ): Options => {
        const opts = paramsToOptions(params ?? location.search);

        return defaults.merge(opts);
    };

    export const setUrlOptions = (
        options: Options,
        params?: string
    ): URLSearchParams => {
        const updated = optionsToParams(
            options,
            new URLSearchParams(params ?? location.search)
        );

        history.replaceState({}, null, `?${updated}`);

        return updated;
    };

    export const setUrlPaints = (paints: Paints, params?: string) => {
        const searchParams = new URLSearchParams(params ?? location.search);

        searchParams.set("colors", listOf(...paints.colors));
        history.replaceState({}, null, `?${searchParams}`);
        return searchParams;
    };

    export const parseUrlPaints = (
        defaults: Paints,
        params?: string
    ): Paints => {
        const searchParams = new URLSearchParams(params ?? location.search);

        const colorsString = decodeURIComponent(searchParams.get("colors"));
        if (!!colorsString) {
            let documentStyle: CSSStyleDeclaration = undefined;

            const colors = splitList(colorsString)
                .map(it => {
                    if (/--.+/.test(it)) {
                        if (!documentStyle) {
                            documentStyle = getComputedStyle(
                                document.documentElement
                            );
                        }
                        return documentStyle.getPropertyValue(it);
                    }
                    return it;
                })
                .filter(Boolean);

            if (colors.length === defaults.colors.length) {
                defaults.colors = colors;
            }
        }

        return defaults;
    };

    const optionsToParams = (
        options: Options,
        params: URLSearchParams
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
            format: options.format.name,
            glyphMorphMillis: `${options.glyphMorphMillis}`,
            spacingPx: `${options.spacingPx}`,
            alignment: PersistentSettings.listOf(
                horizontalAlignment,
                verticalAlignment
            ),
            layout: Layout[options.layout],
        };

        Object.entries(serialized).forEach(([key, value]) => {
            params.set(key, value);
        });
        return params;
    };

    const paramsToOptions = (params: string): Options => {
        const searchParams = new URLSearchParams(params);

        const formatKey: keyof Options = "format";
        const glyphMorphMillisKey: keyof Options = "glyphMorphMillis";
        const spacingPxKey: keyof Options = "spacingPx";
        const alignmentKey: keyof Options = "alignment";
        const layoutKey: keyof Options = "layout";

        const parsed: OptionsInit = {
            format: undefined,
            glyphMorphMillis:
                parseInt(searchParams.get(glyphMorphMillisKey)) || undefined,
            spacingPx: parseInt(searchParams.get(spacingPxKey)) || undefined,
            alignment: undefined,
            layout: undefined,
        };

        if (searchParams.has(formatKey)) {
            const formatterName = searchParams.get(
                formatKey
            ) as keyof typeof TimeFormat;
            parsed.format = TimeFormat[formatterName];
        }

        if (searchParams.has(alignmentKey)) {
            const alignmentName = searchParams.get(alignmentKey);
            const [horizontal, vertical] =
                PersistentSettings.splitList(alignmentName);

            parsed.alignment =
                HorizontalAlignment[
                    horizontal as keyof typeof HorizontalAlignment
                ] |
                VerticalAlignment[vertical as keyof typeof VerticalAlignment];
        }

        if (searchParams.has(layoutKey)) {
            const layoutName = searchParams.get(layoutKey);
            parsed.layout = Layout[layoutName as keyof typeof Layout];
        }

        return new Options(parsed);
    };

    const updateUrlParams = (params: URLSearchParams) => {
        history.replaceState({}, null, `?${params}`);
    };
}
