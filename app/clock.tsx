import React, { useEffect, useRef } from "react";
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
    clockType: ClockType;
    embeddedSettings: string;
    context: ClockContext;
}

export const useClockAnimator = (props: ClockContainerProps) => {
    const { clockType, context, embeddedSettings } = props;

    return useRef(renderers[clockType](context, embeddedSettings));
};

interface ClockProps {
    clock: ClockAnimator<any>;
    size: Size;
}

export const Clock = (props: ClockProps) => {
    const { clock, size } = props;

    const canvasRef = useRef<HTMLCanvasElement>();

    useEffect(() => {
        clock.attach(canvasRef.current);

        return () => clock?.detach();
    }, [canvasRef.current]);

    return (
        <canvas
            ref={canvasRef}
            className="clock"
            width={size?.width ?? window.innerWidth}
            height={size?.height ?? 0}
        />
    );
};
