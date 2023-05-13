const hoursMinsSeconds = (date: Date) => {
    return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
    };
};

type TimeFormatter = (date: Date) => string;
const TimeFormat: Record<string, (date: Date) => string> = {
    HH_MM_SS_24: (date: Date) => {
        const { hours, minutes, seconds } = hoursMinsSeconds(date);
        return `${hours}:${minutes}:${seconds}`;
    },
};

interface Options {
    format: TimeFormatter;
    glyphMorphDuration: 800;
}

interface ClockRenderer<T extends Font<G>, G extends Glyph> {
    options: Options;
    update: () => void;
    updateGlyphs: (now: string, next: string) => void;
}

abstract class BaseClockRenderer<T extends Font<G>, G extends Glyph>
    implements ClockRenderer<T, G>
{
    font: T;
    glyphs: G[];
    glyphCount: number;
    untilNextFrameMillis: number = 0;
    animatedGlyphCount: number = 0;
    animatedGlyphIndices: number[] = [];
    animationTime: number = 0;
    characterHeight: number;

    options: Options;
    paints: Paints;

    constructor(paints: Paints, options: Options) {
        this.options = options;
        this.paints = paints;
    }

    update() {
        // const now = new Date();
        // const nowString = this.options.format(now);
        //
        // const next = new Date(now);
        // next.setSeconds(now.getSeconds() + 1, 0);
        // const nextString = this.options.format(next);
        //
        // this.updateGlyphs(nowString, nextString);

        this.updateGlyphs("01", "02");
    }

    updateGlyphs(now: string, next: string) {
        let animatedGlyphCount = 0;
        let glyphCount = 0;

        for (let i = 0; i < now.length; i++) {
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

        // TODO reverse animated glyph indices?
        //  Not sure why but it was done in original.

        this.glyphCount = glyphCount;
        this.animatedGlyphCount = animatedGlyphCount;
        this.animationTime = 0;
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.layoutPass((glyph, glyphAnimationProgress, rect) => {
            if (glyphAnimationProgress == 1) {
                glyph.key = glyph.getCanonicalEndGlyph();
                glyphAnimationProgress = 0;
            }

            ctx.save();
            ctx.translate(rect.left, rect.top);
            glyph.draw(ctx, glyphAnimationProgress);
            ctx.restore();
        });
    }

    layoutPass(callback: LayoutPassCallback) {
        this.layoutPassHorizontal(callback);
    }

    layoutPassHorizontal(visitGlyph: LayoutPassCallback) {
        const scale = 1;
        let x = 0;

        for (let i = 0; i < this.glyphCount; i++) {
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
            const glyphHeight = this.characterHeight * scale;
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

        return progress(this.animationTime, 0, this.options.glyphMorphDuration);
    }
}

type LayoutPassCallback = (
    glyph: Glyph,
    glyphAnimationProgress: number,
    rect: Rect
) => void;

/**
 * Return normalized progress (0..1) of value relative to the range of min..max.
 */
const progress = (value: number, min: number, max: number): number =>
    Math.max(0, Math.min(1, (value - min) / (max - min)));
