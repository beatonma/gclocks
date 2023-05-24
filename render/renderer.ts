import { Align } from "./alignment";
import { Font } from "./font";
import { Rect, Size } from "./geometry";
import { Glyph, GlyphStateLock } from "./glyph";
import { progress } from "./math";
import { PerformanceTracker } from "./metrics";
import { Canvas, Layout, Options, Paints, PaintStyle } from "./types";

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
    [9, 0],
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
    [9, 0],
    ["_", "_"],
    [":", ":"],
    [2, 1],
    [1, 1],
    [3, 0],
    [5, 0],
    [2, " "],
    [2, 0],
];

const debugStartString = debugMap.map(it => it[0].toString()).join("");
const debugEndString = debugMap.map(it => it[1].toString()).join("");

const debugTimeStep = 1;

export interface ClockRenderer<T extends Font<G>, G extends Glyph> {
    options: Options;
    paints: Paints;
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
    nextFrameDelayRef: ReturnType<typeof setTimeout> = undefined;

    font: T;
    glyphs: G[];
    locks: GlyphStateLock[];
    stringLength: number;
    animatedGlyphCount: number = 0;
    animatedGlyphIndices: number[];

    animationTimeAbsolute: Date;
    /**
     * Current position of the animation.
     */
    animationTimeMillis: number = 0;

    availableSize: Size = new Size();
    measuredSize: Size = new Size();
    nativeSize: Size = new Size();

    scale: number = 0;
    measureStrategy: MeasureStrategy;
    isDebug: boolean;

    options: Options;
    paints: Paints;

    performanceTracker: PerformanceTracker;

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

        if (renderOptions.debug) {
            this.performanceTracker = new PerformanceTracker();
        }
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

        clearTimeout(this.nextFrameDelayRef);
        cancelAnimationFrame(this.animationFrameRef);

        this.tick();

        return this.measuredSize;
    }

    update(date?: Date) {
        if (this.isDebug) return this.updateDebug();

        const now = date ?? new Date();
        const nowString = this.options.format.apply(now);

        const next = new Date(now);
        next.setSeconds(now.getSeconds() + 1, 0);
        const nextString = this.options.format.apply(next);

        this.animationTimeAbsolute = now;
        this.animationTimeMillis = now.getMilliseconds();
        this.updateGlyphs(nowString, nextString);
    }

    updateDebug() {
        this.animationTimeMillis =
            (this.animationTimeMillis + debugTimeStep) %
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

    measureFrame(): Size {
        const drawBounds = new Rect();

        this.layoutPass((glyph, glyphAnimationProgress, rect) => {
            drawBounds.include(rect);
        });
        return drawBounds.toSize().scaledBy(this.scale);
    }

    draw(canvas: Canvas) {
        if (this.scale === 0) return;
        if (this.measuredSize.isEmpty()) return;

        const [availableWidth, availableHeight] = this.availableSize;
        const { paints, scale } = this;

        // Reset canvas and paint attributes
        canvas.clearRect(0, 0, availableWidth, availableHeight);
        canvas.paintStyle = paints.defaultPaintStyle;
        canvas.lineCap = canvas.lineJoin = "round";
        canvas.lineWidth = paints.strokeWidth;

        const [x, y] = Align.apply(
            this.options.alignment,
            this.measureFrame(),
            this.measuredSize
        );

        canvas.withTranslation(x, y, () => {
            canvas.withScaleUniform(scale, 0, 0, () => {
                this.layoutPass((glyph, glyphAnimationProgress, rect) => {
                    canvas.withTranslation(rect.left, rect.top, () => {
                        canvas.withScaleUniform(glyph.scale, 0, 0, () => {
                            glyph.draw(canvas, glyphAnimationProgress, paints);
                        });
                    });

                    if (this.isDebug) {
                        // Show boundary
                        canvas.withPaintStyle(PaintStyle.Stroke, () => {
                            canvas.paintRect("black", rect);
                        });
                    }
                });
            });
        });

        this.performanceTracker?.frameComplete(canvas);
    }

    layoutPass(callback: LayoutPassCallback) {
        switch (this.options.layout) {
            case Layout.Horizontal:
                return this.layoutPassHorizontal(callback);
            case Layout.Vertical:
            case Layout.Wrapped:
                throw `Unhandled layout: ${this.options.layout}`;
        }
    }

    layoutPassHorizontal(visitGlyph: LayoutPassCallback) {
        const { glyphs, stringLength } = this;
        const { spacingPx, alignment } = this.options;
        let x = 0;
        const rect = new Rect();

        for (let i = 0; i < stringLength; i++) {
            const glyph = glyphs[i];
            if (glyph.scale === 0) continue;

            let glyphProgress = this.getGlyphAnimationProgress(i);

            if (glyphProgress === 1) {
                glyph.key = glyph.getCanonicalEndGlyph();
                glyphProgress = 0;
            }

            if (glyphProgress !== 0) {
                glyph.setActivating();
                if (i > 0) {
                    const previousGlyph = glyphs[i - 1];
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
                alignment,
                glyphHeight,
                glyph.layoutInfo.height
            );
            const right = left + glyphWidth;
            const bottom = top + glyphHeight;

            visitGlyph(
                glyph,
                glyphProgress,
                rect.set(left, top, right, bottom)
            );
            x += glyphWidth + spacingPx * glyph.scale;
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

        return progress(
            this.animationTimeMillis,
            0,
            this.options.glyphMorphMillis
        );
    }

    tick() {
        if (!this.canvas) return;
        this.update();
        this.draw(this.canvas);

        const { animationTimeMillis } = this;
        const { glyphMorphMillis, format } = this.options;

        const scheduleNext = () => {
            this.animationFrameRef = requestAnimationFrame(() => this.tick());
        };

        if (animationTimeMillis < glyphMorphMillis) {
            scheduleNext();
        } else {
            const nextFrameDelay = 1000 - animationTimeMillis;
            this.nextFrameDelayRef = setTimeout(scheduleNext, nextFrameDelay);
        }
    }

    attach(canvasElement: HTMLCanvasElement) {
        this.canvas = canvasElement.getContext("2d");

        this.tick();
    }

    detach() {
        this.canvas = null;
        clearTimeout(this.nextFrameDelayRef);
        cancelAnimationFrame(this.animationFrameRef);
    }

    debugMeasure(date: Date, bounds: Rect): Rect {
        this.update(date);
        for (let ms = 0; ms < this.options.glyphMorphMillis; ms++) {
            this.animationTimeMillis = ms;
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
