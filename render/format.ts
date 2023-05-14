import { TimeFormatter } from "./types";

const hoursMinsSeconds = (date: Date) => {
    return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
    };
};

const zeroPad = (value: number): string => value.toString().padStart(2, "0");

export const TimeFormat: Record<string, TimeFormatter> = {
    HH_MM_SS_24: (date: Date) => {
        const { hours, minutes, seconds } = hoursMinsSeconds(date);
        return `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    },
};
