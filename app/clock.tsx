import React, { HTMLProps, useEffect, useRef, useState } from "react";
import { Size } from "../core/geometry";
import { Options } from "../core/options/options";
import { ClockAnimator } from "../core/render/clock-animator";
import { ClockLayout, MeasureStrategy } from "../core/render/clock-layout";
import { FormFont } from "../form/form-font";
import { FormOptions, FormPaints, FormRenderer } from "../form/form-renderer";
import { Settings } from "../settings/settings";
import { ClockContext } from "./index";

export enum ClockType {
    Form = "form",
    // Io16,
    // Io18,
}

const contextMeasureStrategy = (context: ClockContext) => {
    switch (context) {
        case ClockContext.Embedded:
            return MeasureStrategy.FillWidth;
        case ClockContext.Webapp:
        default:
            return MeasureStrategy.Fit;
    }
};

const renderers: Record<
    ClockType,
    (context: ClockContext, defaultSettings: string) => ClockAnimator<any>
> = {
    [ClockType.Form]: (context: ClockContext, defaultSettings: string) => {
        const paints = Settings.parseUrlPaints(
            { ...FormPaints },
            defaultSettings ?? ""
        );
        const options = Settings.parseUrlOptions(
            new Options(FormOptions),
            defaultSettings ?? ""
        );

        return new ClockAnimator(
            new ClockLayout(
                new FormFont(),
                options,
                contextMeasureStrategy(context)
            ),
            [
                // new DebugBoundaryRenderer(),
                new FormRenderer(paints),
            ]
        );
    },
};

export interface ClockContainerProps {
    element: HTMLElement;
    clockType: ClockType;
    embeddedSettings: string;
    context: ClockContext;
}

export const useClockAnimator = (props: ClockContainerProps) => {
    const { clockType, context, embeddedSettings } = props;

    return useRef(renderers[clockType](context, embeddedSettings));
};

export interface ClockProps {
    clock: ClockAnimator<any>;
    parentElement: HTMLElement;
}

export const Clock = (props: ClockProps & HTMLProps<HTMLCanvasElement>) => {
    const {
        clock,
        parentElement,
        width: ignoredWidth,
        height: ignoredHeight,
        ...rest
    } = props;

    const [size, setSize] = useState<Size>(Size.ofElement(parentElement));
    const canvasRef = useRef<HTMLCanvasElement>();

    useEffect(() => {
        const resize = () => {
            const elementSize = Size.ofElement(parentElement);

            setSize(clock.setAvailableSize(elementSize));
        };
        const resizeObserver = new ResizeObserver(resize);

        resizeObserver.observe(parentElement);

        clock.attach(canvasRef.current);
        resize();

        return () => {
            clock?.detach();
            resizeObserver.unobserve(parentElement);
        };
    }, [canvasRef.current]);

    return (
        <canvas
            ref={canvasRef}
            className="clock"
            width={size?.width ?? window.innerWidth}
            height={size?.height ?? 0}
            {...rest}
        />
    );
};
