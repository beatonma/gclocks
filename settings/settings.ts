import { useEffect, useState } from "react";
import { Options } from "../core/options/options";
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
        const urlOptions = PersistentSettings.parseUrlOptions(options);
        setOptions(urlOptions);
    }, [clock]);

    useEffect(() => {
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
    export const parseUrlOptions = (
        defaults: Options,
        params?: string
    ): Options => {
        const opts = Options.fromSearchParams(params ?? location.search);

        return defaults.merge(opts);
    };

    export const setUrlOptions = (options: Options, params?: string) => {
        const updated = options
            .updateSearchParams(new URLSearchParams(params ?? location.search))
            .toString();

        history.replaceState({}, null, `?${updated}`);

        return updated;
    };
}
