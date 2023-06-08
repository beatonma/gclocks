import React from "react";
import { createRoot } from "react-dom/client";
import { canvasExtensions } from "../core/canvas";
import { ClockType } from "./clock";
import { EmbeddedClock } from "./embedded";
import { ClockWithSettings } from "./webapp";

canvasExtensions();

enum Context {
    Webapp = "webapp", // The clock controls the entire view, customisable settings.
    Embedded = "embedded", // Embedded in a page, locked settings.
}

export const renderClockApp = (container: HTMLElement) => {
    const root = createRoot(container);
    const context = container.dataset.context ?? Context.Webapp;
    const customSettings = container.dataset.settings;
    const clockType =
        (container.dataset.clock as ClockType.Form) ?? ClockType.Form;

    switch (context) {
        case Context.Embedded:
            root.render(
                <EmbeddedClock
                    element={container}
                    clockType={clockType}
                    embeddedSettings={customSettings}
                />
            );
            break;
        case Context.Webapp:
            root.render(
                <ClockWithSettings
                    element={container}
                    clockType={clockType}
                    embeddedSettings={customSettings}
                />
            );
            break;
    }
};
