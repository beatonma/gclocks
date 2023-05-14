import { BaseFont } from "../render";
import { DebugGlyph } from "./debug-glyph";

export class DebugFont extends BaseFont<DebugGlyph> {
    isMonospace = true;

    getGlyph = (index: number) => new DebugGlyph();
}
