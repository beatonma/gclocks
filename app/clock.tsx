import React, { useEffect, useRef, useState } from "react";
import { Rect, Size } from "../core/geometry";
import {
    Alignment,
    HorizontalAlignment,
    VerticalAlignment,
} from "../core/options/alignment";
import { Options } from "../core/options/options";
import { ClockAnimator } from "../core/render/clock-animator";
import { ClockLayout, MeasureStrategy } from "../core/render/clock-layout";
import { FormFont } from "../form/form-font";
import { FormOptions, FormPaints, FormRenderer } from "../form/form-renderer";
import { Settings } from "../settings/settings";
import { ClockContext } from "./index";
import { useTouchBehaviour } from "./interactions";

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
    editMode?: boolean;
}

export const Clock = (props: ClockProps) => {
    const { clock, editMode = true } = props;

    const canvasRef = useRef<HTMLCanvasElement>();
    const backgroundRef = useRef<HTMLDivElement>();
    const resizableWrapperRef = useRef<HTMLDivElement>();
    const [size, setSize] = useState<Size>(
        Size.ofElement(resizableWrapperRef.current)
    );
    const [bounds, setBounds] = useState(new Rect());
    const [padding, setPadding] = useState({});

    useEffect(() => {
        clock.attach(canvasRef.current);

        return () => {
            clock?.detach();
        };
    }, [canvasRef.current]);

    useEffect(() => {
        const resize = () => {
            const available = Size.ofElement(backgroundRef.current);

            setBounds(
                new Rect(
                    bounds.left,
                    bounds.top,
                    bounds.left + available.width,
                    bounds.top + available.height
                )
            );
        };

        const resizer = new ResizeObserver(resize);
        resizer.observe(backgroundRef.current);

        return () => resizer.unobserve(backgroundRef.current);
    }, [backgroundRef.current]);

    useEffect(() => {
        const available = new Size(bounds.width(), bounds.height());
        const measured = clock.setAvailableSize(available);

        setSize(measured);

        setPadding({
            paddingLeft: bounds.left,
            paddingTop: bounds.top,
            paddingRight:
                Math.min(
                    resizableWrapperRef.current.clientWidth,
                    window.innerWidth
                ) - bounds.right,
            paddingBottom:
                Math.min(
                    resizableWrapperRef.current.clientHeight,
                    window.innerHeight
                ) - bounds.bottom,
        });
    }, [bounds]);

    useEffect(() => {
        const available = Size.ofElement(resizableWrapperRef.current);

        setBounds(new Rect(0, 0, available.width, available.height));
    }, []);

    const resizeControls = useTouchBehaviour((x, y, location) =>
        setBounds(updateBounds(bounds, x, y, location))
    );

    return (
        <div
            className="clock-background"
            ref={backgroundRef}
            style={{
                backgroundColor: clock.getOptions().backgroundColor,
            }}
        >
            <div
                className="clock-resizable-wrapper"
                style={{ ...padding }}
                ref={resizableWrapperRef}
            >
                <canvas
                    ref={canvasRef}
                    className="clock"
                    width={size?.width ?? window.innerWidth}
                    height={size?.height ?? 0}
                />
            </div>

            <div
                className="resizer"
                style={{
                    position: "absolute",
                    top: bounds.top,
                    left: bounds.left,
                    width: bounds.width(),
                    height: bounds.height(),
                    backgroundColor: "#00ff0055",
                }}
                {...resizeControls}
            ></div>
        </div>
    );
};

const updateBounds = (
    bounds: Rect,
    x: number,
    y: number,
    location: Alignment
): Rect => {
    const [horizontal, vertical] = Alignment.unpack(location);
    const newBounds = new Rect(...bounds);

    if (location === (HorizontalAlignment.Center | VerticalAlignment.Center)) {
        return newBounds.constrainedTranslate(x, y);
    }

    switch (horizontal) {
        case HorizontalAlignment.Start:
            newBounds.left = newBounds.left + x;
            break;
        case HorizontalAlignment.End:
            newBounds.right = newBounds.right + x;
            break;
    }

    switch (vertical) {
        case VerticalAlignment.Top:
            newBounds.top = newBounds.top + y;
            break;
        case VerticalAlignment.Bottom:
            newBounds.bottom = newBounds.bottom + y;
            break;
    }

    return newBounds;
};
