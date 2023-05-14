import { Font } from "./font";
import { Rect, rect } from "./geometry";
import { Glyph, GlyphStateLock } from "./glyph";
import { progress } from "./math";
import { Options, Paints } from "./types";

export interface ClockRenderer<T extends Font<G>, G extends Glyph> {
    options: Options;
    update: () => void;
    updateGlyphs: (now: string, next: string) => void;
    draw: (ctx: CanvasRenderingContext2D) => void;
}

export abstract class BaseClockRenderer<T extends Font<G>, G extends Glyph>
    implements ClockRenderer<T, G>
{
    font: T;
    glyphs: G[];
    locks: GlyphStateLock[];
    stringLength: number;
    animatedGlyphCount: number = 0;
    animatedGlyphIndices: number[];
    animationTime: number = 0;

    options: Options;
    paints: Paints;

    constructor(paints: Paints, options: Options) {
        this.options = options;
        this.paints = paints;
        this.font = this.buildFont();

        this.stringLength = options.format(new Date()).length;
        this.glyphs = new Array(this.stringLength);
        this.locks = new Array(this.stringLength);

        for (let i = 0; i < this.stringLength; i++) {
            this.glyphs[i] = this.font.getGlyph(i);
            this.locks[i] = GlyphStateLock.None;
        }
    }

    abstract buildFont(): T;

    update() {
        const now = new Date();
        const nowString = this.options.format(now);

        this.animationTime = (this.animationTime + 0.1) % 1000; // TODO this is just to slow down
        // this.animationTime = now.getMilliseconds();

        const next = new Date(now);
        next.setSeconds(now.getSeconds() + 1, 0);
        const nextString = this.options.format(next);

        // this.updateGlyphs(nowString, nextString);

        this.updateGlyphs("01:23:45", "12:34:56");
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

    draw(ctx: CanvasRenderingContext2D) {
        this.layoutPass((glyph, glyphAnimationProgress, rect) => {
            if (glyphAnimationProgress == 1) {
                glyph.key = glyph.getCanonicalEndGlyph();
                glyphAnimationProgress = 0;
            }

            ctx.save();
            ctx.translate(rect.left, rect.top);
            glyph.draw(ctx, glyphAnimationProgress, this.paints);
            ctx.restore();
        });
    }

    layoutPass(callback: LayoutPassCallback) {
        this.layoutPassHorizontal(callback);
    }

    layoutPassHorizontal(visitGlyph: LayoutPassCallback) {
        const scale = 1;
        let x = 0;

        for (let i = 0; i < this.stringLength; i++) {
            const glyph = this.glyphs[i];
            glyph.scale = scale;

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

            const glyphWidth = glyph.getWidthAtProgress(glyphProgress);
            const glyphHeight = glyph.height * scale;
            const left = x;
            const top = 0;
            const right = left + glyphWidth + this.paints.strokeWidth;
            const bottom = top + glyphHeight + this.paints.strokeWidth;

            visitGlyph(glyph, glyphProgress, rect(left, top, right, bottom));
            x += glyphWidth + this.paints.strokeWidth;
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
}

type LayoutPassCallback = (
    glyph: Glyph,
    glyphAnimationProgress: number,
    rect: Rect
) => void;
