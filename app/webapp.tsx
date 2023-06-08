import React, { useEffect, useState } from "react";
import { Options } from "../core/options/options";
import { Paints } from "../core/render/types";
import { useClockSettings } from "../settings/settings";
import { Clock, ClockContainerProps, useClockAnimator } from "./clock";

export const ClockWithSettings = (props: ClockContainerProps) => {
    const { element } = props;
    const clock = useClockAnimator(props);
    const [
        paints,
        setPaints,
        options,
        setOptions,
        settingsVisible,
        setSettingsVisible,
    ] = useClockSettings(element, clock.current);

    return (
        <>
            <Clock
                clock={clock.current}
                parentElement={element}
                onClick={() => setSettingsVisible(!settingsVisible)}
            />

            <ClockSettings
                isVisible={settingsVisible}
                hideSettings={() => setSettingsVisible(false)}
                options={options}
                setOptions={setOptions}
                paints={paints}
                setPaints={setPaints}
            />
        </>
    );
};

interface ClockOptionProps {
    options: Options;
    setOptions: (options: Options) => void;
}
interface ClockPaintProps {
    paints: Paints;
    setPaints: (paints: Paints) => void;
}
type ClockSettingsProps = {
    isVisible: boolean;
    hideSettings: () => void;
} & ClockOptionProps &
    ClockPaintProps;
const ClockSettings = (props: ClockSettingsProps) => {
    const { isVisible, hideSettings, options, setOptions, paints, setPaints } =
        props;

    if (!isVisible) return null;

    return (
        <div className="clock-settings">
            <ClockPaints paints={paints} setPaints={setPaints} />
            <ClockOptions options={options} setOptions={setOptions} />
            <button onClick={() => hideSettings()}>Close</button>
        </div>
    );
};

const ClockPaints = (props: ClockPaintProps) => {
    const { paints, setPaints } = props;
    const [colors, setColors] = useState(paints.colors);

    useEffect(() => {
        setColors(paints.colors);
    }, [paints]);

    return (
        <div className="clock-paints">
            {colors.map((color, index) => {
                return (
                    <input
                        key={index}
                        type="color"
                        value={color}
                        className="clock-paint-color"
                        onChange={ev => {
                            const newColors = [...colors];
                            newColors[index] = ev.target.value;
                            setPaints({ ...paints, colors: newColors });
                        }}
                    />
                );
            })}
        </div>
    );
};
const ClockOptions = (props: ClockOptionProps) => {
    return <div className="clock-options">TODO options</div>;
};
