import { TimeFormatter } from "./types";

const hoursMinsSeconds = (date: Date) => {
    return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
    };
};

const zeroPad = (value: number): string => value.toString().padStart(2, "0");
const formatHourMinSec_24 = (date: Date) => {
    const { hours, minutes, seconds } = hoursMinsSeconds(date);
    return `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
};

export const TimeFormat: Record<string, TimeFormatter> = {
    Default: formatHourMinSec_24,
    HH_MM_SS_24: formatHourMinSec_24,
    HH_MM_SS_12: (date: Date) => {
        const { hours, minutes, seconds } = hoursMinsSeconds(date);
        return `${zeroPad(hours % 12)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    },
};
