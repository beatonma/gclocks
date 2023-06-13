import React, { useEffect, useRef, useState } from "react";
import { Rect, Size } from "../core/geometry";
import { constrain } from "../core/math";
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

    // Size of the canvas element.
    const [size, setSize] = useState<Size>(
        Size.ofElement(resizableWrapperRef.current)
    );

    // Boundary of the available space for the clock, expressed as a fraction of the parent element dimensions.
    const [fractionalBounds, setFractionalBounds] = useState(
        new Rect(0, 0, 1, 1)
    );

    // CSS padding used to position the clock within .clock-resizable-wrapper
    const [padding, setPadding] = useState({});
    const [resizeFlag, requestResize] = useFlag();

    const bounds = resolveBounds(
        fractionalBounds,
        Size.ofElement(backgroundRef.current)
    );

    const resizeControls = useTouchBehaviour((x, y, location) =>
        setFractionalBounds(
            boundsToFractional(
                updateBoundsFromDrag(bounds, x, y, location),
                Size.ofElement(backgroundRef.current)
            )
        )
    );

    useEffect(() => {
        clock.attach(canvasRef.current);

        return () => clock?.detach();
    }, [canvasRef.current]);

    useEffect(() => {
        const resizer = new ResizeObserver(requestResize);
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
    }, [fractionalBounds, resizeFlag]);

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

const updateBoundsFromDrag = (
    existingFractionalBounds: Rect,
    dragX: number,
    dragY: number,
    dragArea: Alignment
): Rect => {
    const [horizontal, vertical] = Alignment.unpack(dragArea);
    const newBounds = new Rect(...existingFractionalBounds);

    if (dragArea === (HorizontalAlignment.Center | VerticalAlignment.Center)) {
        return newBounds.constrainedTranslate(dragX, dragY);
    }

    switch (horizontal) {
        case HorizontalAlignment.Start:
            newBounds.left = newBounds.left + dragX;
            break;
        case HorizontalAlignment.End:
            newBounds.right = newBounds.right + dragX;
            break;
    }

    switch (vertical) {
        case VerticalAlignment.Top:
            newBounds.top = newBounds.top + dragY;
            break;
        case VerticalAlignment.Bottom:
            newBounds.bottom = newBounds.bottom + dragY;
            break;
    }

    return newBounds;
};

const boundsToFractional = (bounds: Rect, containerSize: Size) => {
    const { width, height } = containerSize;
    return new Rect(
        constrain(bounds.left / width, 0, 1),
        constrain(bounds.top / height, 0, 1),
        constrain(bounds.right / width, 0, 1),
        constrain(bounds.bottom / height, 0, 1)
    );
};

const resolveBounds = (fractional: Rect, containerSize: Size) => {
    const { width, height } = containerSize;
    return new Rect(
        fractional.left * width,
        fractional.top * height,
        fractional.right * width,
        fractional.bottom * height
    );
};

const useFlag = (): [unknown, () => void] => {
    const [flag, setFlag] = useState(false);
    const toggleFlag = () => {
        setFlag(prevFlag => !prevFlag);
    };

    return [flag, toggleFlag];
};
