export const constrain = (
    value: number,
    min: number = 0.0,
    max: number = 1.0
): number => Math.max(Math.min(value, max), min);

export const distance = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

/**
 * Return normalized progress (0..1) of value relative to the range of min..max.
 */
export const progress = (value: number, min: number, max: number): number =>
    constrain((value - min) / (max - min), 0.0, 1.0);

export const interpolate = (
    progress: number,
    min: number = 0.0,
    max: number = 1.0
): number => min + (max - min) * progress;

export const accelerate5 = (value: number) => Math.pow(1 - value, 5);
export const decelerate5 = (value: number) => 1 - accelerate5(value);
export const decelerate3 = (value: number) => 1 - Math.pow(1 - value, 3);
export const decelerate2 = (value: number) => 1 - Math.pow(1 - value, 2);

export const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
