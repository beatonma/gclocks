import { renderClockApp } from "./app";
import "./clocks.scss";
import { TimeFormat } from "./core";
import { measureFormClock } from "./core/precompute";
import React, { useEffect } from "react";

const CONTAINER_ID = "clocks_container";

export const DebugMeasureClock = () => {
    useEffect(() => {
        measureFormClock(TimeFormat.HH_MM_SS_24);
    }, []);

    return <></>;
};

const attachApp = (dom: Document | Element = document) => {
    const containers = dom.querySelectorAll(
        `#${CONTAINER_ID}, .clock-container`,
    );

    containers.forEach((it: HTMLElement) => {
        renderClockApp(it);
    });
};

attachApp();
