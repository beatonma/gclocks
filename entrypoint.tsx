import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { FormRenderer } from "./form";
import { FormOptions } from "./form/form-renderer";
import { TimeFormat } from "./render";
import { Rect, Size } from "./render/geometry";
import { ClockRenderer } from "./render/renderer";
import { canvasExtensions } from "./render/canvas";
import "./clocks.scss";

canvasExtensions();

const CONTAINER_ID = "clocks_container";
const container = () => document.getElementById(CONTAINER_ID);

enum Clocks {
    Form,
    // Io16,
    // Io18,
}

const renderers: Record<Clocks, (debug: boolean) => ClockRenderer<any, any>> = {
    [Clocks.Form]: (debug: boolean) =>
        new FormRenderer({ ...FormOptions }, { debug: debug }),
};

interface ClockProps {
    clock: Clocks;
    debug?: boolean;
}
export const Clock = (props: ClockProps) => {
    const { clock: defaultClock, debug = false } = props;
    const [size, setSize] = useState<Size>(Size.ofElement(container()));
    const [clock, setClock] = useState(defaultClock);
    const [renderer, setRenderer] = useState<ClockRenderer<any, any>>(
        renderers[clock](debug)
    );
    const canvasRef = useRef<HTMLCanvasElement>();

    useEffect(() => {
        const resize = (toElement: Element = container()) => {
            setSize(renderer.setAvailableSize(Size.ofElement(toElement)));
        };
        window.addEventListener("resize", () => resize());
        renderer.attach(canvasRef.current);
        resize(canvasRef.current);

        return () => {
            renderer.detach();
            window.removeEventListener("resize", () => resize());
        };
    }, [renderer]);

    useEffect(() => {
        setRenderer(renderers[clock](debug));
    }, [clock]);

    return (
        <canvas
            ref={canvasRef}
            className="clock"
            width={size.width}
            height={size.height}
        />
    );
};

export const DebugMeasureClock = () => {
    useEffect(() => {
        const time = new Date(2023, 5, 16, 0, 0, 0);
        let renderer = new FormRenderer({
            ...FormOptions,
            format: TimeFormat.SS,
        });

        const secondsBounds = new Rect();
        for (let s = 0; s < 60; s++) {
            time.setSeconds(s);
            renderer.debugMeasure(time, secondsBounds);
        }
        console.log(`Seconds: ${secondsBounds}`);

        renderer = new FormRenderer({
            ...FormOptions,
            format: TimeFormat.MM,
        });
        const minutesBounds = new Rect();
        for (let m = 0; m < 60; m++) {
            time.setMinutes(m);
            renderer.debugMeasure(time, minutesBounds);
        }
        console.log(`Minutes: ${minutesBounds}`);

        renderer = new FormRenderer({
            ...FormOptions,
            format: TimeFormat.HH_24,
        });
        const hoursBounds = new Rect();
        for (let h = 0; h < 24; h++) {
            time.setHours(h);
            renderer.debugMeasure(time, hoursBounds);
        }
        console.log(`Hours: ${hoursBounds}`);
    }, []);

    return <></>;
};

const attachApp = (dom: Document | Element = document) => {
    const container = dom.querySelector(`#${CONTAINER_ID}`);

    if (container) {
        const root = createRoot(container);
        root.render(
            <>
                {/*<DebugMeasureClock />*/}
                {/*<Clock clock={Clocks.Form} debug={true} />*/}
                <Clock clock={Clocks.Form} />
            </>
        );
    } else {
        console.warn(`Root container not found! #${CONTAINER_ID}`);
    }
};

attachApp();
