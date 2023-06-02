import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { DebugBoundaryRenderer } from "./core/render/debug";
import { ClockLayout } from "./core/render/clock-layout";
import { Paints } from "./core/render/types";
import { Options } from "./core/options/types";
import { FormRenderer } from "./form";
import { FormFont } from "./form/form-font";
import { FormOptions } from "./form/form-renderer";
import { TimeFormat } from "./core";
import { Size } from "./core/geometry";
import { ClockAnimator as ClockCoordinator } from "./core/render/clock-animator";
import { canvasExtensions } from "./core/canvas";
import "./clocks.scss";
import { measureFormClock } from "./core/precompute";

canvasExtensions();

const CONTAINER_ID = "clocks_container";
const container = () => document.getElementById(CONTAINER_ID);

enum Clocks {
    Form,
    // Io16,
    // Io18,
}

const renderers: Record<Clocks, () => ClockCoordinator<any>> = {
    [Clocks.Form]: () =>
        new ClockCoordinator(new ClockLayout(new FormFont(), FormOptions), [
            new DebugBoundaryRenderer(),
            new FormRenderer(),
        ]),
};

interface ClockProps {
    clockType: Clocks;
}
export const Clock = (props: ClockProps) => {
    const { clockType } = props;
    const [size, setSize] = useState<Size>(Size.ofElement(container()));
    const clock = useRef(renderers[clockType]());
    const canvasRef = useRef<HTMLCanvasElement>();
    const [paints, setPaints] = useState(clock.current?.getPaints());
    const [options, setOptions] = useState(clock.current?.getOptions());
    const [settingsVisible, setSettingsVisible] = useState(false);

    useEffect(() => {
        const resize = (toElement: Element = container()) => {
            setSize(clock.current.setAvailableSize(Size.ofElement(toElement)));
        };

        window.addEventListener("resize", () => resize());
        clock.current.attach(canvasRef.current);
        resize(canvasRef.current);

        return () => {
            clock.current?.detach();
            window.removeEventListener("resize", () => resize());
        };
    }, [canvasRef.current]);

    useEffect(() => {
        setPaints(clock.current?.getPaints());
        setOptions(clock.current?.getOptions());
    }, [clock]);

    useEffect(() => {
        clock.current?.setPaints(paints);
    }, [paints]);

    useEffect(() => {
        clock.current?.setOptions(options);
    }, [options]);

    return (
        <div className="clock-container">
            <canvas
                ref={canvasRef}
                className="clock"
                width={size.width}
                height={size.height}
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
        </div>
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
    return <div className="clock-options"></div>;
};

export const DebugMeasureClock = () => {
    useEffect(() => {
        measureFormClock(TimeFormat.HH_MM_SS_24);
    }, []);

    return <></>;
};

const attachApp = (dom: Document | Element = document) => {
    const container = dom.querySelector(`#${CONTAINER_ID}`);

    if (container) {
        const root = createRoot(container);
        root.render(
            <>
                <Clock clockType={Clocks.Form} />
                {/*<DebugMeasureClock />*/}
            </>
        );
    } else {
        console.warn(`Root container not found! #${CONTAINER_ID}`);
    }
};

attachApp();
