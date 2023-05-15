import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./clocks.scss";
import { FormRenderer } from "./form";
import { ClockRenderer } from "./render/renderer";
import { canvasExtensions } from "./render/canvas";

canvasExtensions();

const CONTAINER_ID = "clocks_container";

enum Clocks {
    Form,
    // Io16,
    // Io18,
}

const renderers: Record<Clocks, () => ClockRenderer<any, any>> = {
    [Clocks.Form]: () => new FormRenderer(),
};

export const Clock = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    const [clock, setClock] = useState(Clocks.Form);
    const [renderer, setRenderer] = useState<ClockRenderer<any, any>>(
        renderers[clock]
    );

    useEffect(() => {
        const resize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        renderer.setAvailableSize(width, height);
    }, [renderer, width, height]);

    useEffect(() => {
        setRenderer(renderers[clock]);
    }, [clock]);

    return (
        <Canvas
            width={width}
            height={height}
            renderer={(ctx, w, h) => {
                ctx.clearRect(0, 0, w, h);
                renderer.update();
                renderer.draw(ctx);
            }}
        />
    );
};

interface CanvasProps {
    width: number;
    height: number;
    renderer: (
        canvas: CanvasRenderingContext2D,
        width: number,
        height: number
    ) => void;
    animated?: boolean;
}
const Canvas = (props: CanvasProps) => {
    const { width, height, renderer, animated = true } = props;
    const canvasRef = useRef<HTMLCanvasElement>();
    const tickRef = useRef<number>();

    useEffect(() => {
        const tick = () => {
            const canvas = canvasRef.current?.getContext("2d");
            if (canvas != undefined) {
                renderer(canvas, width, height);
            }
            tickRef.current = requestAnimationFrame(tick);
        };

        tickRef.current = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(tickRef.current);
    }, [width, height]);

    return <canvas ref={canvasRef} width={width} height={height} />;
};

const attachApp = (dom: Document | Element = document) => {
    const container = dom.querySelector(`#${CONTAINER_ID}`);

    if (container) {
        const root = createRoot(container);
        root.render(<Clock />);
    } else {
        console.warn(`Root container not found! #${CONTAINER_ID}`);
    }
};

attachApp();
