import { describe, expect, test } from "@jest/globals";
import { Align } from "./alignment";
import { Size } from "../geometry";
import { HorizontalAlignment, VerticalAlignment } from "./types";

describe("Alignment tests", () => {
    test("Align.applyHorizontal is correct", () => {
        expect(
            Align.applyHorizontal(HorizontalAlignment.Start, 10, 20, 3)
        ).toBe(0);
        expect(
            Align.applyHorizontal(HorizontalAlignment.Center, 10, 20, 3)
        ).toBe(5);
        expect(Align.applyHorizontal(HorizontalAlignment.End, 10, 20, 3)).toBe(
            10
        );
        expect(Align.applyHorizontal(HorizontalAlignment.None, 10, 20, 3)).toBe(
            3
        );
    });

    test("Align.applyVertical is correct", () => {
        expect(Align.applyVertical(VerticalAlignment.Top, 10, 20, 3)).toBe(0);
        expect(Align.applyVertical(VerticalAlignment.Center, 10, 20, 3)).toBe(
            5
        );
        expect(Align.applyVertical(VerticalAlignment.Bottom, 10, 20, 3)).toBe(
            10
        );
        expect(Align.applyVertical(VerticalAlignment.None, 10, 20, 3)).toBe(3);
    });

    test("Align.apply is correct", () => {
        expect(
            Align.apply(
                VerticalAlignment.Center | HorizontalAlignment.Center,
                new Size(13, 17),
                new Size(19, 29)
            )
        ).toEqual([3, 6]);
    });
});
