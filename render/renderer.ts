import { Font } from "./font";
import { Rect, Size } from "./geometry";
import { Glyph, GlyphStateLock } from "./glyph";
import { progress } from "./math";
import { Canvas, Options, Paints, PaintStyle } from "./types";

// const debugMap = [
//     ["0", "1"],
//     // ["1", "2"],
//     // ["2", "3"],
//     // ["3", "4"],
//     // ["4", "5"],
//     // ["5", "6"],
//     // ["6", "7"],
//     // ["7", "8"],
//     // ["8", "9"],
//     ["9", "0"],
//     // ["_", "_"],
//     // [":", ":"],
//     // ["2", "1"],
//     // ["1", "1"],
//     // ["3", "0"],
//     // ["5", "0"],
//     // ["2", " "],
//     // ["2", "0"],
// ];

const debugMap = [
    [0, 1],
    [0, 1],
    [":", ":"],
    [0, 1],
    [0, 1],
    [":", ":"],
    [0, 1],
    [0, 1],
];

const debugStartString = debugMap.map(it => it[0].toString()).join("");
const debugEndString = debugMap.map(it => it[1].toString()).join("");

const debugTimeStep = 1;

export interface ClockRenderer<T extends Font<G>, G extends Glyph> {
    options: Options;
    update: () => void;
    updateGlyphs: (now: string, next: string) => void;
    draw: (ctx: Canvas) => void;
    setAvailableSize: (availableSize: Size) => Size;
    attach: (canvasElement: HTMLCanvasElement) => void;
    detach: () => void;
}

export enum MeasureStrategy {
    Fit, // Respect the existing boundaries of the container.
    Fill, // Use existing value for either width or height to determine the other.
}

export interface RenderOptions {
    debug?: boolean;
    measureStrategy?: MeasureStrategy;
}

export const DefaultRenderOptions: RenderOptions = {
    debug: false,
    measureStrategy: MeasureStrategy.Fit,
};

export abstract class BaseClockRenderer<T extends Font<G>, G extends Glyph>
    implements ClockRenderer<T, G>
{
    canvas: Canvas = undefined;
    animationFrameRef: number = undefined;

    font: T;
    glyphs: G[];
    locks: GlyphStateLock[];
    stringLength: number;
    animatedGlyphCount: number = 0;
    animatedGlyphIndices: number[];
    animationTime: number = 0;

    availableSize: Size = new Size();
    measuredSize: Size = new Size();
    nativeSize: Size = new Size();
    scale: number = 1;
    measureStrategy: MeasureStrategy;
    isDebug: boolean;

    options: Options;
    paints: Paints;

    abstract buildFont(): T;

    protected constructor(
        paints: Paints,
        options: Options,
        renderOptions: RenderOptions = DefaultRenderOptions
    ) {
        this.options = options;
        this.paints = paints;
        this.font = this.buildFont();
        this.measureStrategy =
            renderOptions.measureStrategy ??
            DefaultRenderOptions.measureStrategy;
        this.isDebug = renderOptions.debug ?? DefaultRenderOptions.debug;

        this.stringLength = options.format.apply(new Date()).length;
        if (this.isDebug) {
            this.stringLength = debugStartString.length;
        }
        this.glyphs = new Array(this.stringLength);
        this.locks = new Array(this.stringLength);

        for (let i = 0; i < this.stringLength; i++) {
            this.glyphs[i] = this.options.format.applyRole(
                this.font.getGlyph(i),
                i
            );
            this.locks[i] = GlyphStateLock.None;
        }
        this.nativeSize = this.font.measure(
            options.format,
            options.layout,
            options.spacingPx
        );
    }

    setAvailableSize(available: Size): Size {
        this.availableSize = available;

        const { width: availableWidth, height: availableHeight } = available;
        if (availableWidth === 0 && availableHeight === 0) {
            this.scale = 0;
            return;
        }
        const { width: nativeWidth, height: nativeHeight } = this.nativeSize;

        const strategy =
            availableHeight === 0 ? MeasureStrategy.Fill : this.measureStrategy;

        switch (strategy) {
            case MeasureStrategy.Fit:
                const widthRatio = availableWidth / nativeWidth;
                const heightRatio = availableHeight / nativeHeight;
                const scale = Math.min(widthRatio, heightRatio);

                return this.setScale(scale);

            case MeasureStrategy.Fill:
                if (availableWidth > 0) {
                    return this.setScale(availableWidth / nativeWidth);
                } else {
                    return this.setScale(availableHeight / nativeHeight);
                }
        }
    }

    /**
     * Returns measuredSize after applying the given scale.
     */
    setScale(scale: number): Size {
        this.scale = scale;
        this.measuredSize = this.nativeSize.scaledBy(scale);
        return this.measuredSize;
    }

    update(date?: Date) {
        if (this.isDebug) return this.updateDebug();

        const now = date ?? new Date();
        const nowString = this.options.format.apply(now);

        const next = new Date(now);
        next.setSeconds(now.getSeconds() + 1, 0);
        const nextString = this.options.format.apply(next);

        this.animationTime = now.getMilliseconds();
        this.updateGlyphs(nowString, nextString);
    }

    updateDebug() {
        this.animationTime =
            (this.animationTime + debugTimeStep) %
            this.options.glyphMorphMillis;
        this.updateGlyphs(debugStartString, debugEndString);
    }

    updateGlyphs(now: string, next: string) {
        this.animatedGlyphIndices = [];
        let animatedGlyphCount = 0;
        let glyphCount = 0;

        for (let i = 0; i < this.stringLength; i++) {
            const fromChar = now[i];
            const nextChar = next[i];

            const glyph = this.glyphs[i];
            let key;
            if (fromChar === nextChar) {
                key = fromChar;
                glyph.setActivating();
            } else {
                this.animatedGlyphIndices[animatedGlyphCount++] = i;
                key = `${fromChar}_${nextChar}`;
                glyph.setDeactivating();
            }
            glyph.key = key;
            this.glyphs[glyphCount++] = glyph;
        }

        this.animatedGlyphCount = animatedGlyphCount;
    }

    draw(canvas: Canvas) {
        if (this.scale === 0) return;
        canvas.clearRect(
            0,
            0,
            this.availableSize.width,
            this.availableSize.height
        );
        canvas.paintStyle = this.paints.defaultPaintStyle;
        canvas.withScaleUniform(this.scale, 0, 0, () => {
            this.layoutPass((glyph, glyphAnimationProgress, rect) => {
                canvas.withPaintStyle(PaintStyle.Stroke, () => {
                    canvas.paintRect(
                        "black",
                        rect.left,
                        rect.top,
                        rect.right,
                        rect.bottom
                    );
                });

                if (glyphAnimationProgress == 1) {
                    glyph.key = glyph.getCanonicalEndGlyph();
                    glyphAnimationProgress = 0;
                }

                canvas.withTranslation(rect.left, rect.top, () => {
                    canvas.withScaleUniform(glyph.scale, 0, 0, () => {
                        glyph.draw(canvas, glyphAnimationProgress, this.paints);
                    });
                });
            });
        });
    }

    layoutPass(callback: LayoutPassCallback) {
        this.layoutPassHorizontal(callback);
    }

    layoutPassHorizontal(visitGlyph: LayoutPassCallback) {
        const [alignX, alignY] = Align.split(this.options.alignment);
        let x = 0;

        for (let i = 0; i < this.stringLength; i++) {
            const glyph = this.glyphs[i];

            const glyphProgress = this.getGlyphAnimationProgress(i);

            if (glyphProgress !== 0) {
                glyph.setActivating();
                if (i > 0) {
                    const previousGlyph = this.glyphs[i - 1];
                    const previousCanonical =
                        previousGlyph.getCanonicalStartGlyph();
                    if (
                        previousCanonical !== "#" &&
                        previousCanonical !== ":"
                    ) {
                        previousGlyph.setActivating();
                    }
                }
            }

            const glyphWidth =
                glyph.getWidthAtProgress(glyphProgress) * glyph.scale;
            const glyphHeight = glyph.layoutInfo.height * glyph.scale;
            const left = x;
            const top = Align.applyVertical(
                0,
                glyphHeight,
                glyph.layoutInfo.height,
                alignY
            );
            const right = left + glyphWidth;
            const bottom = top + glyphHeight;

            visitGlyph(
                glyph,
                glyphProgress,
                new Rect(left, top, right, bottom)
            );
            x += glyphWidth;
        }
    }

    getGlyphAnimationProgress(glyphIndex: number) {
        let index = -1;
        for (let i = 0; i < this.animatedGlyphCount; i++) {
            if (this.animatedGlyphIndices[i] === glyphIndex) {
                index = i;
                break;
            }
        }

        if (index < 0) {
            // Glyphs that are not currently animating rendered at t=0.
            return 0;
        }

        return progress(this.animationTime, 0, this.options.glyphMorphMillis);
    }

    tick() {
        if (!this.canvas) return;
        this.update();
        this.draw(this.canvas);
        this.animationFrameRef = requestAnimationFrame(() => this.tick());
    }

    attach(canvas: HTMLCanvasElement) {
        this.canvas = canvas.getContext("2d");
        this.tick();
    }

    detach() {
        console.log("detach");
        cancelAnimationFrame(this.animationFrameRef);
        this.canvas = null;
    }

    debugMeasure(date: Date, bounds: Rect): Rect {
        this.update(date);
        for (let ms = 0; ms < this.options.glyphMorphMillis; ms++) {
            this.animationTime = ms;
            this.layoutPass((glyph, glyphAnimationProgress, rect) => {
                bounds.include(rect);
            });
        }
        return bounds;
    }
}

type LayoutPassCallback = (
    glyph: Glyph,
    glyphAnimationProgress: number,
    rect: Rect
) => void;
