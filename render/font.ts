interface Font<G extends Glyph> {
    isMonospace: boolean;
    getGlyph: (index: number) => G;
    // drawPath: (ctx: CanvasRenderingContext2D, path: CanvasPath) => void;
}

abstract class BaseFont<G extends Glyph> implements Font<G> {
    isMonospace: boolean;

    // drawPath(ctx: CanvasRenderingContext2D, path: CanvasPath): void {
    //     const scale = 1.0;
    //
    //     ctx.scale(scale, scale);
    // }

    getGlyph: (index: number) => G;
}
