import React, { useEffect, useRef, useState } from "react";
import { Size } from "../core/geometry";
import { Settings } from "../settings/settings";
import { Clock, ClockContainerProps, useClockAnimator } from "./clock";

export const EmbeddedClock = (props: ClockContainerProps) => {
    const { embeddedSettings } = props;
    const clock = useClockAnimator(props);
    const backgroundRef = useRef<HTMLDivElement>();
    const [size, setSize] = useState<Size>(
        Size.ofElement(backgroundRef.current)
    );

    useEffect(() => {
        const refreshCss = () => {
            const clock_ = clock.current;
            const paints = Settings.parseUrlPaints(
                clock_.getPaints(),
                embeddedSettings
            );
            const options = Settings.parseUrlOptions(
                clock_.getOptions(),
                embeddedSettings
            );

            clock_.setPaints(paints);
            clock_.setOptions(options);
        };

        window.addEventListener("themechange", refreshCss);
        return () => window.removeEventListener("themechange", refreshCss);
    }, []);

    useEffect(() => {
        const resize = () => {
            const available = Size.ofElement(backgroundRef.current);
            const measured = clock.current.setAvailableSize(available);

            setSize(measured);
        };

        const resizer = new ResizeObserver(resize);
        resizer.observe(backgroundRef.current);
        return () => resizer.unobserve(backgroundRef.current);
    }, [backgroundRef.current]);

    return (
        <div className="clock-background" ref={backgroundRef}>
            <Clock clock={clock.current} size={size} />
        </div>
    );
};
