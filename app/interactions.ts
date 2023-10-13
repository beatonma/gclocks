import { distance } from "core/math";
import {
    Alignment,
    HorizontalAlignment,
    VerticalAlignment,
} from "core/options/alignment";
import { MouseEvent, Touch, TouchEvent, useEffect, useState } from "react";

const SlopPx = 8;
const ClickDurationMaxMillis = 300;

type Position = [number, number];

/**
 * An object that can be destructured as event handlers for an HTMLElement.
 */
export interface ClockTouchHandler {}

interface DragEvents extends ClockTouchHandler {
    onMouseDown: (ev: MouseEvent) => void;
    onMouseMove: (ev: MouseEvent) => void;
    onMouseUp: (ev: MouseEvent) => void;
    onMouseLeave: (ev: MouseEvent) => void;
    onTouchStart: (ev: TouchEvent) => void;
    onTouchMove: (ev: TouchEvent) => void;
    onTouchEnd: (ev: TouchEvent) => void;
    onTouchCancel: (ev: TouchEvent) => void;
}

type InputEvent = MouseEvent | Touch;

export const useTouchBehaviour = (
    onDrag: (distanceX: number, distanceY: number, location: Alignment) => void,
    onClick?: () => void,
): DragEvents => {
    const [location, setLocation] = useState<Alignment>();
    const [startTime, setStartTime] = useState<number>();
    const [down, setDown] = useState<Position>();
    const [previous, setPrevious] = useState<Position>();
    const [current, setCurrent] = useState<Position>();

    useEffect(() => {
        if (current && previous) {
            onDrag(
                current[0] - previous[0],
                current[1] - previous[1],
                location,
            );
        }
        setPrevious(current);
    }, [current]);

    const startGesture = (ev: InputEvent) => {
        setLocation(getTouchLocation(ev));
        setDown([ev.clientX, ev.clientY]);
        setStartTime(performance.now());
    };

    const onMove = (ev: InputEvent) => {
        if (down) {
            setCurrent([ev.clientX, ev.clientY]);
        }
    };

    const endGesture = (ev: InputEvent) => {
        const endTime = performance.now();

        if (endTime - startTime < ClickDurationMaxMillis) {
            const [x1, y1] = down;
            const [x2, y2] = [ev.clientX, ev.clientY];

            const moveDistance = distance(x1, y1, x2, y2);
            if (moveDistance < SlopPx) {
                onClick?.();
            }
        }

        cancel();
    };

    const cancel = () => {
        setLocation(undefined);
        setDown(undefined);
        setStartTime(undefined);
        setPrevious(undefined);
        setCurrent(undefined);
    };

    return {
        onMouseDown: startGesture,
        onTouchStart: (ev: TouchEvent) => startGesture(ev.touches[0]),
        onMouseMove: onMove,
        onTouchMove: (ev: TouchEvent) => onMove(ev.touches[0]),
        onMouseUp: endGesture,
        onTouchEnd: (ev: TouchEvent) => endGesture(ev.touches[0]),
        onMouseLeave: cancel,
        onTouchCancel: cancel,
    };
};

const getTouchLocation = (ev: InputEvent): Alignment => {
    const target = ev.target as HTMLElement;

    const targetWidth = target.clientWidth;
    const targetHeight = target.clientHeight;
    const x = ev.clientX - target.offsetLeft;
    const y = ev.clientY - target.offsetTop;

    const edgeSizeFraction = 0.25;
    const widthEdgePx = edgeSizeFraction * targetWidth;
    const heightEdgePx = edgeSizeFraction * targetHeight;

    let location = 0;

    if (x < widthEdgePx) {
        location = location | HorizontalAlignment.Start;
    } else if (x > targetWidth - widthEdgePx) {
        location = location | HorizontalAlignment.End;
    } else {
        location = location | HorizontalAlignment.Center;
    }

    if (y < heightEdgePx) {
        location = location | VerticalAlignment.Top;
    } else if (y > targetHeight - heightEdgePx) {
        location = location | VerticalAlignment.Bottom;
    } else {
        location = location | VerticalAlignment.Center;
    }

    return location;
};
