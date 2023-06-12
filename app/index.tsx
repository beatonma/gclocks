import React from "react";
import { createRoot } from "react-dom/client";
import { canvasExtensions } from "../core/canvas";
import { ClockContainerProps, ClockType } from "./clock";
import { EmbeddedClock } from "./embedded";
import { ClockWithSettings } from "./webapp";

canvasExtensions();

/**
 * How is this clock being displayed?
 */
export enum ClockContext {
    /**
     * The clock controls the entire view, customisable settings.
     * */
    Webapp = "webapp",
    /**
     * Embedded in a page, locked settings.
     * */
    Embedded = "embedded",
}

export const renderClockApp = (container: HTMLElement) => {
    const root = createRoot(container);
    const context = (container.dataset.context ??
        ClockContext.Webapp) as ClockContext;
    const embeddedSettings = container.dataset.settings;
    const clockType =
        (container.dataset.clock as ClockType.Form) ?? ClockType.Form;

    // Apply defaults to container.
    container.dataset.context = context;
    container.dataset.clockType = clockType;
    root.render(
        <ClockApp
            clockType={clockType}
            context={context}
            embeddedSettings={embeddedSettings}
        />
    );
};

const ClockApp = (props: ClockContainerProps) => {
    switch (props.context) {
        case ClockContext.Embedded:
            return <EmbeddedClock {...props} />;

        case ClockContext.Webapp:
            return <ClockWithSettings {...props} />;
    }
};
