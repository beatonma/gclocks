import { Canvas } from "core/render/types";

export const timeit = (block: () => void) => {
    const start = performance.now();
    block();
    const end = performance.now();
    console.debug(`timeit: ${end - start}ms`);
};

export class PerformanceTracker {
    previousTimestamp: number;

    frameComplete(canvas: Canvas) {
        const now = performance.now();
        if (this.previousTimestamp) {
            const duration = Math.round(now - this.previousTimestamp);
            const fps = Math.round(1000 / duration);
            canvas.text("white", `${duration}ms`, 50, 50);
        }
        this.previousTimestamp = now;
    }
}
