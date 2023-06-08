import React, { HTMLProps, useEffect, useRef, useState } from "react";
import { Size } from "../core/geometry";
import { ClockAnimator } from "../core/render/clock-animator";
import { ClockLayout } from "../core/render/clock-layout";
import { FormFont } from "../form/form-font";
import { FormOptions, FormPaints, FormRenderer } from "../form/form-renderer";
import { Settings } from "../settings/settings";

export enum ClockType {
    Form = "form",
    // Io16,
    // Io18,
}

const renderers: Record<
    ClockType,
    (defaultSettings?: string) => ClockAnimator<any>
> = {
    [ClockType.Form]: (defaultSettings?: string) => {
        const paints = Settings.parseUrlPaints(
            FormPaints,
            defaultSettings ?? ""
        );
        const options = Settings.parseUrlOptions(
            FormOptions,
            defaultSettings ?? ""
        );

        return new ClockAnimator(new ClockLayout(new FormFont(), options), [
            // new DebugBoundaryRenderer(),
            new FormRenderer(paints),
        ]);
    },
};

export interface ClockContainerProps {
    element: HTMLElement;
    clockType: ClockType;
    embeddedSettings: string;
}

export const useClockAnimator = (props: ClockContainerProps) => {
    const { clockType, embeddedSettings } = props;

    const clock = useRef(renderers[clockType](embeddedSettings));

    return clock;
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
        const resize = (toElement: Element = parentElement) => {
            setSize(clock.setAvailableSize(Size.ofElement(toElement)));
        };

        window.addEventListener("resize", () => resize());
        clock.attach(canvasRef.current);
        resize(canvasRef.current);

        return () => {
            clock?.detach();
            window.removeEventListener("resize", () => resize());
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
