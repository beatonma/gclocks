import { describe, expect, test } from "@jest/globals";
import { Size } from "core/geometry";
import {
    Alignment,
    HorizontalAlignment,
    VerticalAlignment,
} from "core/options/alignment";

describe("Alignment tests", () => {
    test("Align.applyHorizontal is correct", () => {
        expect(
            Alignment.applyHorizontal(HorizontalAlignment.Start, 10, 20, 3),
        ).toBe(0);
        expect(
            Alignment.applyHorizontal(HorizontalAlignment.Center, 10, 20, 3),
        ).toBe(5);
        expect(
            Alignment.applyHorizontal(HorizontalAlignment.End, 10, 20, 3),
        ).toBe(10);
        expect(
            Alignment.applyHorizontal(HorizontalAlignment.Default, 10, 20, 3),
        ).toBe(3);
    });

    test("Alignment.applyVertical is correct", () => {
        expect(Alignment.applyVertical(VerticalAlignment.Top, 10, 20, 3)).toBe(
            0,
        );
        expect(
            Alignment.applyVertical(VerticalAlignment.Center, 10, 20, 3),
        ).toBe(5);
        expect(
            Alignment.applyVertical(VerticalAlignment.Bottom, 10, 20, 3),
        ).toBe(10);
        expect(
            Alignment.applyVertical(VerticalAlignment.Default, 10, 20, 3),
        ).toBe(3);
    });

    test("Alignment.apply is correct", () => {
        expect(
            Alignment.apply(
                VerticalAlignment.Center | HorizontalAlignment.Center,
                new Size(13, 17),
                new Size(19, 29),
            ),
        ).toEqual([3, 6]);
    });
});
