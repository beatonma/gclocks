import { Clock, ClockContainerProps, useClockAnimator } from "app/clock";
import { useTouchBehaviour } from "app/interactions";
import { ClockSettings } from "app/webapp/settings";
import { Rect, Size } from "core/geometry";
import { constrain } from "core/math";
import {
    Alignment,
    HorizontalAlignment,
    VerticalAlignment,
} from "core/options/alignment";
import React, { useEffect, useRef, useState } from "react";
import { useClockSettings } from "settings/settings";

export const ClockWithSettings = (props: ClockContainerProps) => {
    const clock = useClockAnimator(props);

    const [paints, setPaints, options, setOptions, isEditMode, setEditMode] =
        useClockSettings(clock.current);

    const backgroundRef = useRef<HTMLDivElement>();
    const resizableWrapperRef = useRef<HTMLDivElement>();

    const [size, setSize] = useState<Size>(
        Size.ofElement(resizableWrapperRef.current),
    );

    // CSS padding used to position the clock within .clock-wrapper
    const [padding, setPadding] = useState({});
    const [resizeFlag, requestResize] = useFlag();

    const setFractionalBounds = (rect: Rect) => {
        setOptions({ ...options, bounds: rect });
    };

    useEffect(() => {
        const resizer = new ResizeObserver(requestResize);
        resizer.observe(backgroundRef.current);

        return () => resizer.unobserve(backgroundRef.current);
    }, [backgroundRef.current]);

    const bounds = resolveBounds(
        options.bounds,
        Size.ofElement(backgroundRef.current),
    );

    const resizeControls = useTouchBehaviour(
        (x, y, location) => {
            if (!isEditMode) return;
            setFractionalBounds(
                boundsToFractional(
                    updateBoundsFromDrag(bounds, x, y, location),
                    Size.ofElement(backgroundRef.current),
                ),
            );
        },
        () => setEditMode(prev => !prev),
    );

    useEffect(() => {
        const available = new Size(bounds.width(), bounds.height());
        const measured = clock.current.setAvailableSize(available);

        setFractionalBounds(options.bounds);
        setSize(measured);

        setPadding({
            paddingLeft: bounds.left,
            paddingTop: bounds.top,
            paddingRight:
                Math.min(
                    resizableWrapperRef.current.clientWidth,
                    window.innerWidth,
                ) - bounds.right,
            paddingBottom:
                Math.min(
                    resizableWrapperRef.current.clientHeight,
                    window.innerHeight,
                ) - bounds.bottom,
        });
    }, [options.layout, options.bounds, options.spacingPx, resizeFlag]);

    return (
        <>
            <div
                className="clock-background"
                ref={backgroundRef}
                style={{
                    backgroundColor: clock.current.getOptions().backgroundColor,
                }}
                data-is-edit-mode={isEditMode}
            >
                <div
                    className="clock-wrapper"
                    style={{ ...padding }}
                    ref={resizableWrapperRef}
                >
                    <Clock clock={clock.current} size={size} />
                </div>

                <div
                    className="resizer"
                    style={{
                        top: bounds.top,
                        left: bounds.left,
                        width: bounds.width(),
                        height: bounds.height(),
                    }}
                    {...resizeControls}
                />
            </div>

            <ClockSettings
                isVisible={isEditMode}
                hideSettings={() => setEditMode(false)}
                options={options}
                setOptions={setOptions}
                paints={paints}
                setPaints={setPaints}
            />
        </>
    );
};

const boundsToFractional = (bounds: Rect, containerSize: Size) => {
    const { width, height } = containerSize;
    return new Rect(
        constrain(bounds.left / width, 0, 1),
        constrain(bounds.top / height, 0, 1),
        constrain(bounds.right / width, 0, 1),
        constrain(bounds.bottom / height, 0, 1),
    );
};

const resolveBounds = (fractional: Rect, containerSize: Size) => {
    const { width, height } = containerSize;
    return new Rect(
        fractional.left * width,
        fractional.top * height,
        fractional.right * width,
        fractional.bottom * height,
    );
};

const useFlag = (): [unknown, () => void] => {
    const [flag, setFlag] = useState(false);
    const toggleFlag = () => {
        setFlag(prevFlag => !prevFlag);
    };

    return [flag, toggleFlag];
};

const updateBoundsFromDrag = (
    existingFractionalBounds: Rect,
    dragX: number,
    dragY: number,
    dragArea: Alignment,
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
