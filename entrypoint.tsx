import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { FormRenderer } from "./form";
import { FormOptions } from "./form/form-renderer";
import { TimeFormat } from "./render";
import { Rect, Size } from "./render/geometry";
import { ClockRenderer } from "./render/renderer";
import { canvasExtensions } from "./render/canvas";
import "./clocks.scss";
import { measureFormClock } from "./render/precompute";

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
    const { clock, debug = false } = props;
    const [size, setSize] = useState<Size>(Size.ofElement(container()));
    const renderer = useRef(renderers[clock](debug));
    const canvasRef = useRef<HTMLCanvasElement>();

    useEffect(() => {
        const resize = (toElement: Element = container()) => {
            setSize(
                renderer.current.setAvailableSize(Size.ofElement(toElement))
            );
        };

        window.addEventListener("resize", () => resize());
        renderer.current.attach(canvasRef.current);
        resize(canvasRef.current);

        return () => {
            renderer.current?.detach();
            window.removeEventListener("resize", () => resize());
        };
    }, [canvasRef.current]);

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
                <Clock clock={Clocks.Form} debug={true} />
                {/*<DebugMeasureClock />*/}
            </>
        );
    } else {
        console.warn(`Root container not found! #${CONTAINER_ID}`);
    }
};

attachApp();
