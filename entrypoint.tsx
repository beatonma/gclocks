import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./clocks.scss";

const CONTAINER_ID = "clocks_container";

enum Clocks {
    Form,
    Io16,
    Io18,
}

export const Clock = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const resize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    return (
        <Canvas
            width={width}
            height={height}
            renderer={(ctx, w, h) => {
                ctx.fillStyle = "green";
                ctx.fillRect(0, 0, w / 2, h / 2);
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
            setTimeout(() => {
                tickRef.current = requestAnimationFrame(tick);
            }, 1000);
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
