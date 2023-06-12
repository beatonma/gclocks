import React, { useEffect } from "react";
import { Settings } from "../settings/settings";
import { Clock, ClockContainerProps, useClockAnimator } from "./clock";

export const EmbeddedClock = (props: ClockContainerProps) => {
    const { embeddedSettings } = props;
    const clock = useClockAnimator(props);

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

    return <Clock clock={clock.current} />;
};
