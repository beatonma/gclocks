import { Glyph, GlyphRole } from "./glyph";
import { TimeFormatter } from "./types";

const hoursMinsSeconds = (date: Date) => {
    return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
    };
};

const zeroPad = (value: number): string => value.toString().padStart(2, "0");

const Roles = {
    HH_MM_SS: [
        GlyphRole.Hour,
        GlyphRole.Hour,
        GlyphRole.Separator,
        GlyphRole.Minute,
        GlyphRole.Minute,
        GlyphRole.Separator,
        GlyphRole.Second,
        GlyphRole.Second,
    ],
    HH_MM: [
        GlyphRole.Hour,
        GlyphRole.Hour,
        GlyphRole.Separator,
        GlyphRole.Minute,
        GlyphRole.Minute,
    ],
    HH: [GlyphRole.Hour, GlyphRole.Hour],
    MM: [GlyphRole.Minute, GlyphRole.Minute],
    SS: [GlyphRole.Second, GlyphRole.Second],
};
const timeFormatter = (
    roles: GlyphRole[],
    apply: (date: Date) => string
): TimeFormatter => {
    return {
        roles: roles,
        apply: apply,
        applyRole: <T extends Glyph>(glyph: T, index: number): T => {
            glyph.setRole(roles[index]);
            return glyph;
        },
    };
};

export const TimeFormat = {
    // 24-hour, zero-padded hours, minutes, seconds
    HH_MM_SS_24: timeFormatter(Roles.HH_MM_SS, (date: Date) => {
        const { hours, minutes, seconds } = hoursMinsSeconds(date);
        return `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    }),

    // 24-hour, non-padded hours, minutes, seconds
    H_MM_SS_24: timeFormatter(Roles.HH_MM_SS, (date: Date) => {
        const { hours, minutes, seconds } = hoursMinsSeconds(date);
        return `${hours}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    }),

    // 12-hour, zero-padded hours, minutes, seconds
    HH_MM_SS_12: timeFormatter(Roles.HH_MM_SS, (date: Date) => {
        const { hours, minutes, seconds } = hoursMinsSeconds(date);
        return `${zeroPad(hours % 12)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    }),

    // 12-hour, non-padded hours, minutes, seconds
    H_MM_SS_12: timeFormatter(Roles.HH_MM_SS, (date: Date) => {
        const { hours, minutes, seconds } = hoursMinsSeconds(date);
        return `${hours % 12}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    }),

    // Hours and minutes only
    HH_MM_24: timeFormatter(Roles.HH_MM, (date: Date) => {
        const { hours, minutes, seconds } = hoursMinsSeconds(date);
        return `${zeroPad(hours)}:${zeroPad(minutes)}`;
    }),
    H_MM_24: timeFormatter(Roles.HH_MM, (date: Date) => {
        const { hours, minutes, seconds } = hoursMinsSeconds(date);
        return `${hours}:${zeroPad(minutes)}`;
    }),
    HH_MM_12: timeFormatter(Roles.HH_MM, (date: Date) => {
        const { hours, minutes, seconds } = hoursMinsSeconds(date);
        return `${zeroPad(hours % 12)}:${zeroPad(minutes)}`;
    }),
    H_MM_12: timeFormatter(Roles.HH_MM, (date: Date) => {
        const { hours, minutes, seconds } = hoursMinsSeconds(date);
        return `${hours % 12}:${zeroPad(minutes)}`;
    }),

    // Fragments, used for debugging.
    HH_24: timeFormatter(Roles.HH, (date: Date) => {
        const { hours } = hoursMinsSeconds(date);
        return `${zeroPad(hours)}`;
    }),
    H_24: timeFormatter(Roles.HH, (date: Date) => {
        const { hours } = hoursMinsSeconds(date);
        return hours.toString();
    }),
    HH_12: timeFormatter(Roles.HH, (date: Date) => {
        const { hours } = hoursMinsSeconds(date);
        return `${zeroPad(hours % 12)}`;
    }),
    H_12: timeFormatter(Roles.HH, (date: Date) => {
        const { hours } = hoursMinsSeconds(date);
        return (hours % 12).toString();
    }),
    MM: timeFormatter(Roles.MM, (date: Date) => {
        const { minutes } = hoursMinsSeconds(date);
        return `${zeroPad(minutes)}`;
    }),
    SS: timeFormatter(Roles.SS, (date: Date) => {
        const { seconds } = hoursMinsSeconds(date);
        return `${zeroPad(seconds)}`;
    }),
};
