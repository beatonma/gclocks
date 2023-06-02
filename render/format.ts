import { Glyph, GlyphRole } from "./glyph";
import { TimeFormatter } from "./types";

export enum TimeResolution {
    Hours,
    Minutes,
    Seconds,
}

const Roles = {
    HH_MM_SS: [
        GlyphRole.Hour,
        GlyphRole.Hour,
        GlyphRole.Separator_Hours_Minutes,
        GlyphRole.Minute,
        GlyphRole.Minute,
        GlyphRole.Separator_Minutes_Seconds,
        GlyphRole.Second,
        GlyphRole.Second,
    ],
    HH_MM: [
        GlyphRole.Hour,
        GlyphRole.Hour,
        GlyphRole.Separator_Hours_Minutes,
        GlyphRole.Minute,
        GlyphRole.Minute,
    ],
    HH: [GlyphRole.Hour, GlyphRole.Hour],
    MM: [GlyphRole.Minute, GlyphRole.Minute],
    SS: [GlyphRole.Second, GlyphRole.Second],
};

const timeFormatter = (
    name: string,
    resolution: TimeResolution,
    roles: GlyphRole[],
    apply: (date: Date) => string
): TimeFormatter => new TimeFormatterImpl(name, resolution, roles, apply);

class TimeFormatterImpl implements TimeFormatter {
    name: string;
    resolution: TimeResolution;
    roles: GlyphRole[];
    apply: (date: Date) => string;

    constructor(
        name: string,
        resolution: TimeResolution,
        roles: GlyphRole[],
        apply: (date: Date) => string
    ) {
        this.name = name;
        this.resolution = resolution;
        this.roles = roles;
        this.apply = apply;
    }

    applyRole<T extends Glyph>(glyph: T, index: number): T {
        glyph.setRole(this.roles[index]);
        return glyph;
    }

    toString = () => this.name;
}

const hoursMinsSeconds = (date: Date) => {
    return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
    };
};

const zeroPad = (value: number): string => value.toString().padStart(2, "0");

export const TimeFormat = {
    // 24-hour, zero-padded hours, minutes, seconds
    HH_MM_SS_24: timeFormatter(
        "HH_MM_SS_24",
        TimeResolution.Seconds,
        Roles.HH_MM_SS,
        (date: Date) => {
            const { hours, minutes, seconds } = hoursMinsSeconds(date);
            return `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
        }
    ),

    // 24-hour, non-padded hours, minutes, seconds
    H_MM_SS_24: timeFormatter(
        "H_MM_SS_24",
        TimeResolution.Seconds,
        Roles.HH_MM_SS,
        (date: Date) => {
            const { hours, minutes, seconds } = hoursMinsSeconds(date);
            return `${hours}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
        }
    ),

    // 12-hour, zero-padded hours, minutes, seconds
    HH_MM_SS_12: timeFormatter(
        "HH_MM_SS_12",
        TimeResolution.Seconds,
        Roles.HH_MM_SS,
        (date: Date) => {
            const { hours, minutes, seconds } = hoursMinsSeconds(date);
            return `${zeroPad(hours % 12)}:${zeroPad(minutes)}:${zeroPad(
                seconds
            )}`;
        }
    ),

    // 12-hour, non-padded hours, minutes, seconds
    H_MM_SS_12: timeFormatter(
        "H_MM_SS_12",
        TimeResolution.Seconds,
        Roles.HH_MM_SS,
        (date: Date) => {
            const { hours, minutes, seconds } = hoursMinsSeconds(date);
            return `${hours % 12}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
        }
    ),

    // Hours and minutes only
    HH_MM_24: timeFormatter(
        "HH_MM_24",
        TimeResolution.Minutes,
        Roles.HH_MM,
        (date: Date) => {
            const { hours, minutes, seconds } = hoursMinsSeconds(date);
            return `${zeroPad(hours)}:${zeroPad(minutes)}`;
        }
    ),
    H_MM_24: timeFormatter(
        "H_MM_24",
        TimeResolution.Minutes,
        Roles.HH_MM,
        (date: Date) => {
            const { hours, minutes, seconds } = hoursMinsSeconds(date);
            return `${hours}:${zeroPad(minutes)}`;
        }
    ),
    HH_MM_12: timeFormatter(
        "HH_MM_12",
        TimeResolution.Minutes,
        Roles.HH_MM,
        (date: Date) => {
            const { hours, minutes, seconds } = hoursMinsSeconds(date);
            return `${zeroPad(hours % 12)}:${zeroPad(minutes)}`;
        }
    ),
    H_MM_12: timeFormatter(
        "H_MM_12",
        TimeResolution.Minutes,
        Roles.HH_MM,
        (date: Date) => {
            const { hours, minutes, seconds } = hoursMinsSeconds(date);
            return `${hours % 12}:${zeroPad(minutes)}`;
        }
    ),

    // Fragments, used for debugging.
    HH_24: timeFormatter(
        "HH_24",
        TimeResolution.Hours,
        Roles.HH,
        (date: Date) => {
            const { hours } = hoursMinsSeconds(date);
            return `${zeroPad(hours)}`;
        }
    ),
    H_24: timeFormatter(
        "H_24",
        TimeResolution.Hours,
        Roles.HH,
        (date: Date) => {
            const { hours } = hoursMinsSeconds(date);
            return hours.toString();
        }
    ),
    HH_12: timeFormatter(
        "HH_12",
        TimeResolution.Hours,
        Roles.HH,
        (date: Date) => {
            const { hours } = hoursMinsSeconds(date);
            return `${zeroPad(hours % 12)}`;
        }
    ),
    H_12: timeFormatter(
        "H_12",
        TimeResolution.Hours,
        Roles.HH,
        (date: Date) => {
            const { hours } = hoursMinsSeconds(date);
            return (hours % 12).toString();
        }
    ),
    MM: timeFormatter("MM", TimeResolution.Minutes, Roles.MM, (date: Date) => {
        const { minutes } = hoursMinsSeconds(date);
        return `${zeroPad(minutes)}`;
    }),
    SS: timeFormatter("SS", TimeResolution.Seconds, Roles.SS, (date: Date) => {
        const { seconds } = hoursMinsSeconds(date);
        return `${zeroPad(seconds)}`;
    }),
};
