interface Rect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

const rect = (left: number, top: number, right: number, bottom: number) => ({
    left: left,
    top: top,
    right: right,
    bottom: bottom,
});
