import { Size } from "../geometry";
import { Glyph } from "../glyph";
import { Options } from "../options/options";
import { ClockLayout } from "./clock-layout";
import { ClockRenderer } from "./renderer";

import { Canvas, Paints } from "./types";

export class ClockAnimator<G extends Glyph> {
    layout: ClockLayout<G>;
    renderers: ClockRenderer[];

    canvas: Canvas;
    animationFrameRef: number = undefined;
    nextFrameDelayRef: ReturnType<typeof setTimeout> = undefined;

    constructor(layout: ClockLayout<G>, renderers: ClockRenderer[]) {
        this.layout = layout;
        this.renderers = renderers;
    }

    primaryRenderer = () => this.renderers[this.renderers.length - 1];

    setOptions = (options: Options) => {
        this.layout.setOptions(options);
    };

    setPaints = (paints: Paints) => {
        this.primaryRenderer().setPaints(paints);
    };

    getOptions = () => this.layout.options;
    getPaints = () => this.primaryRenderer().paints;

    setAvailableSize = (available: Size) =>
        this.layout.setAvailableSize(available);

    tick = () => {
        this.layout.update();

        this.resetCanvas();

        this.renderers.forEach(renderer =>
            renderer.draw(this.canvas, this.layout)
        );

        const scheduleNext = () => {
            this.animationFrameRef = requestAnimationFrame(() => this.tick());
        };

        const { animationTimeMillis, options } = this.layout;
        if (animationTimeMillis < options.glyphMorphMillis) {
            scheduleNext();
        } else {
            const nextFrameDelay = 1000 - animationTimeMillis;
            this.nextFrameDelayRef = setTimeout(scheduleNext, nextFrameDelay);
        }
    };

    attach(canvasElement: HTMLCanvasElement) {
        this.canvas = canvasElement.getContext("2d");

        this.tick();
    }

    detach() {
        this.canvas = null;
        clearTimeout(this.nextFrameDelayRef);
        cancelAnimationFrame(this.animationFrameRef);
    }

    onRescale = (scale: number) => {
        clearTimeout(this.nextFrameDelayRef);
        cancelAnimationFrame(this.animationFrameRef);
        this.tick();
    };

    resetCanvas = () => {
        const canvas = this.canvas;
        const [measuredWidth, measuredHeight] = this.layout.measuredSize;
        canvas.clearRect(0, 0, measuredWidth, measuredHeight);
        canvas.lineCap = canvas.lineJoin = "round";
    };
}
