import { Font } from "./font";
import { Glyph } from "./glyph";
import { BaseClockRenderer } from "./renderer";

abstract class BaseClock<
    T extends BaseClockRenderer<F, G>,
    F extends Font<G>,
    G extends Glyph
> {
    renderer: T;

    draw(ctx: CanvasRenderingContext2D) {
        this.renderer.update();
        this.renderer.draw(ctx);
    }
}
