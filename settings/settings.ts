import { useEffect, useState } from "react";
import { TimeFormat } from "../core";
import { Options } from "../core/options/types";
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
        clock?.setPaints(paints);
    }, [paints]);

    useEffect(() => {
        clock?.setOptions(options);
    }, [options]);

    useEffect(() => {
        const urlOptions = parseUrlOptions(options);
        console.log(`parsed from url: ${JSON.stringify(urlOptions)}`);
        setOptions(urlOptions);
    }, [clock]);

    useEffect(() => {
        setUrlOptions(options);
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

const parseUrlOptions = (defaults: Options) => {
    const search: Record<string, any> = Object.fromEntries(
        new URLSearchParams(location.search)
    );

    Object.entries(search).forEach(([key, value]) => {
        search[key] = parseInt(value) || value;
    });

    const formatKey: keyof Options = "format";
    if (formatKey in search) {
        const formatterName = search[formatKey] as keyof typeof TimeFormat;
        search[formatKey] = TimeFormat[formatterName];
    }
    return {
        ...defaults,
        ...search,
    };
};

const setUrlOptions = (options: Options) => {
    const currentUrlOptions = location.search;

    const newUrlOptions = new URLSearchParams(
        Object.entries(options)
    ).toString();

    if (currentUrlOptions !== newUrlOptions) {
        history.replaceState({}, null, `?${newUrlOptions}`);
    }
};
