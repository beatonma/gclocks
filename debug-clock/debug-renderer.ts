import { BaseClockRenderer } from "../render";
import { DebugFont } from "./debug-font";
import { DebugGlyph } from "./debug-glyph";

export class DebugRenderer extends BaseClockRenderer<DebugFont, DebugGlyph> {
    buildFont(): DebugFont {
        return new DebugFont();
    }
}
