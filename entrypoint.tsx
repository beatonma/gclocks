import React, { useEffect } from "react";
import "./clocks.scss";
import { renderClockApp } from "./app";
import { TimeFormat } from "./core";
import { measureFormClock } from "./core/precompute";

const CONTAINER_ID = "clocks_container";

export const DebugMeasureClock = () => {
    useEffect(() => {
        measureFormClock(TimeFormat.HH_MM_SS_24);
    }, []);

    return <></>;
};

const attachApp = (dom: Document | Element = document) => {
    const container = dom.querySelector(`#${CONTAINER_ID}`) as HTMLElement;

    if (container) {
        renderClockApp(container);
    } else {
        console.warn(`Root container not found! #${CONTAINER_ID}`);
    }
};

attachApp();
