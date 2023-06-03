import { Alignment } from "../options/alignment";
import { Font } from "../font";
import { Rect, Size } from "../geometry";
import { Glyph, GlyphRole, GlyphStateLock } from "../glyph";
import { progress } from "../math";
import { Options } from "../options/options";
import { Layout } from "../options/types";

// TODO Add a small space around the clock to allow for paint stroke lines to stay within bounds.
const OutlinePaddingPx = 8;

export enum MeasureStrategy {
    Fit, // Respect the existing boundaries of the container.
    Fill, // Use existing value for either width or height to determine the other.
}

export class ClockLayout<G extends Glyph> {
    font: Font<G>;
    options: Options;

    /**
     * The maximum size the clock can be with 1x scaling.
     * Based on the values of `options.format` and `options.layout`.
     */
    nativeSize: Size;

    /**
     * The size that is given to us for rendering within.
     */
    availableSize: Size = new Size();

    /**
     * The size that the clock actually uses *at some point*. The actual rendered
     * clock may not use all of this space at any given time, but will need it
     * at least once per day.
     *
     * This must be <= availableSize.
     *
     * Horizontal alignment is applied relative to this area.
     *
     * Equivalent to nativeSize * scale.
     */
    measuredSize: Size;

    /**
     * The size of *each line* of the *current* time.
     * Only valid for a single animation frame.
     *
     * This must be <= measuredSize
     */
    currentNativeSize: Size[];

    scale: number = 0;
    readonly measureStrategy: MeasureStrategy;
    readonly layoutPassRect: Rect = new Rect();

    stringLength: number;
    glyphs: G[];
    locks: GlyphStateLock[];

    animationTimeMillis: number = 0;
    animatedGlyphIndices: number[];
    animatedGlyphCount: number;

    constructor(font: Font<G>, options: Options) {
        this.font = font;
        this.measureStrategy = MeasureStrategy.Fit;
        this.setOptions(options);
    }

    setOptions = (options: Options) => {
        const font = this.font;
        this.options = options;
        this.nativeSize = font.measure(
            options.format,
            options.layout,
            options.spacingPx
        );

        this.stringLength = options.format.apply(new Date()).length;

        this.glyphs = new Array(this.stringLength);
        this.locks = new Array(this.stringLength);

        for (let i = 0; i < this.stringLength; i++) {
            this.glyphs[i] = this.options.format.applyRole(font.getGlyph(i), i);
            this.locks[i] = GlyphStateLock.None;
        }
    };

    isDrawable = (): boolean =>
        this.scale !== 0 && !this.measuredSize.isEmpty();

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

    /**
     * Measure the size of the clock for the current animation frame and
     * pass the determined transforms to the draw function.
     *
     * This is required for correct application of alignment relative to the
     * drawable space available for each row/component of the clock.
     */
    onDraw(draw: (translation: [number, number], scale: number) => void) {
        const drawBounds = new Rect();
        const lines: Size[] = [];
        let currentLine: Rect = new Rect();

        this.layoutPass((glyph, glyphAnimationProgress, rect) => {
            drawBounds.include(rect);

            if (rect.top !== currentLine.top) {
                if (!currentLine.isEmpty()) {
                    lines.push(currentLine.toSize());
                }
                currentLine.copy(rect);
            } else {
                currentLine.include(rect);
            }
        });

        if (!currentLine.isEmpty()) {
            lines.push(currentLine.toSize());
        }

        this.currentNativeSize = lines;
        const { scale, measuredSize } = this;

        const translation = Alignment.apply(
            this.options.alignment,
            drawBounds.toSize().scaledBy(scale),
            measuredSize
        );

        draw(translation, scale);

        this.currentNativeSize = undefined;
    }

    layoutPass(callback: LayoutPassCallback) {
        switch (this.options.layout) {
            case Layout.Horizontal:
                return this.layoutPassHorizontal(callback);
            case Layout.Vertical:
                return this.layoutPassVertical(callback);
            case Layout.Wrapped:
                return this.layoutPassWrapped(callback);
            default:
                throw `Unhandled layout: ${this.options.layout}`;
        }
    }

    layoutPassHorizontal(visitGlyph: LayoutPassCallback) {
        const { stringLength } = this;
        const { spacingPx, alignment } = this.options;
        let x = 0;

        for (let i = 0; i < stringLength; i++) {
            const {
                glyph,
                glyphVisible,
                glyphProgress,
                glyphWidth,
                glyphHeight,
            } = this.updateGlyph(i);

            if (!glyphVisible) continue;

            const left = x;
            const top = Alignment.applyVertical(
                alignment,
                glyphHeight,
                glyph.layoutInfo.height
            );
            const right = left + glyphWidth;
            const bottom = top + glyphHeight;

            visitGlyph(
                glyph,
                glyphProgress,
                this.layoutPassRect.set(left, top, right, bottom)
            );
            x += glyphWidth + spacingPx * glyph.scale;
        }
    }

    layoutPassVertical(visitGlyph: LayoutPassCallback) {
        const { stringLength } = this;
        const { spacingPx, alignment } = this.options;

        const maxLineWidth = !!this.currentNativeSize
            ? this.currentNativeSize
                  .map(it => it.width)
                  .reduce((total, current) => Math.max(total, current))
            : 0;
        let currentLineIndex = 0;
        let x = !!this.currentNativeSize
            ? Alignment.applyHorizontal(
                  alignment,
                  this.currentNativeSize[currentLineIndex].width,
                  maxLineWidth
              )
            : 0;
        let y = 0;

        for (let i = 0; i < stringLength; i++) {
            const {
                glyph,
                glyphVisible,
                glyphProgress,
                glyphWidth,
                glyphHeight,
            } = this.updateGlyph(i);

            if (glyph.key === ":") {
                currentLineIndex += 1;

                if (this.currentNativeSize === undefined) {
                    x = 0;
                } else {
                    x = Alignment.applyHorizontal(
                        alignment,
                        this.currentNativeSize[currentLineIndex].width,
                        maxLineWidth
                    );
                }
                y += glyph.layoutInfo.height + spacingPx;
                continue;
            }

            if (!glyphVisible) continue;

            const left = x;
            const top = y;
            const right = left + glyphWidth;
            const bottom = top + glyphHeight;

            visitGlyph(
                glyph,
                glyphProgress,
                this.layoutPassRect.set(left, top, right, bottom)
            );
            x += glyphWidth + spacingPx * glyph.scale;
        }
    }

    layoutPassWrapped(visitGlyph: LayoutPassCallback) {
        const { stringLength } = this;
        const { spacingPx, alignment } = this.options;

        const maxLineWidth = !!this.currentNativeSize
            ? this.currentNativeSize
                  .map(it => it.width)
                  .reduce((total, current) => Math.max(total, current))
            : 0;
        let currentLineIndex = 0;
        let x = !!this.currentNativeSize
            ? Alignment.applyHorizontal(
                  alignment,
                  this.currentNativeSize[currentLineIndex].width,
                  maxLineWidth
              )
            : 0;
        let y = 0;

        for (let i = 0; i < stringLength; i++) {
            const {
                glyph,
                glyphVisible,
                glyphProgress,
                glyphWidth,
                glyphHeight,
            } = this.updateGlyph(i);

            if (glyph.role === GlyphRole.Separator_Minutes_Seconds) {
                currentLineIndex += 1;

                if (this.currentNativeSize === undefined) {
                    x = 0;
                } else {
                    x = Alignment.applyHorizontal(
                        alignment,
                        this.currentNativeSize[currentLineIndex].width,
                        maxLineWidth
                    );
                }
                y += glyph.layoutInfo.height + spacingPx;
                continue;
            }

            if (!glyphVisible) continue;

            const left = x;
            const top = y;
            const right = left + glyphWidth;
            const bottom = top + glyphHeight;

            visitGlyph(
                glyph,
                glyphProgress,
                this.layoutPassRect.set(left, top, right, bottom)
            );
            x += glyphWidth + spacingPx * glyph.scale;
        }
    }

    updateGlyph(index: number): GlyphStatus<G> {
        const { glyphs } = this;
        const glyph = glyphs[index];
        if (glyph.scale === 0) return { glyph: glyph, glyphVisible: false };

        let glyphProgress = this.getGlyphAnimationProgress(index);

        if (glyphProgress === 1) {
            glyph.key = glyph.getCanonicalEndGlyph();
            glyphProgress = 0;
        }

        if (glyphProgress !== 0) {
            glyph.setActivating();
            if (index > 0) {
                const previousGlyph = this.glyphs[index - 1];
                const previousCanonical =
                    previousGlyph.getCanonicalStartGlyph();
                if (previousCanonical !== "#" && previousCanonical !== ":") {
                    previousGlyph.setActivating();
                }
            }
        }

        const glyphWidth =
            glyph.getWidthAtProgress(glyphProgress) * glyph.scale;
        const glyphHeight = glyph.layoutInfo.height * glyph.scale;

        return {
            glyph: glyph,
            glyphVisible: true,
            glyphProgress: glyphProgress,
            glyphWidth: glyphWidth,
            glyphHeight: glyphHeight,
        };
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

    update(date?: Date) {
        const now = date ?? new Date();
        const nowString = this.options.format.apply(now);

        const next = new Date(now);
        next.setSeconds(now.getSeconds() + 1, 0);
        const nextString = this.options.format.apply(next);

        this.animationTimeMillis = now.getMilliseconds();
        this.updateGlyphs(nowString, nextString);
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
}

interface GlyphStatus<G extends Glyph> {
    glyph: G;
    glyphVisible: boolean;
    glyphProgress?: number;
    glyphWidth?: number;
    glyphHeight?: number;
}

type LayoutPassCallback = (
    glyph: Glyph,
    glyphAnimationProgress: number,
    rect: Rect
) => void;
