import { BaseFont } from "../render";
import { FormGlyph } from "./form-glyph";

export class FormFont extends BaseFont<FormGlyph> {
    isMonospace = true;

    getGlyph = (index: number) => new FormGlyph();
}
