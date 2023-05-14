export interface Rect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export const rect = (
    left: number,
    top: number,
    right: number,
    bottom: number
): Rect => ({
    left: left,
    top: top,
    right: right,
    bottom: bottom,
});
