import { describe, expect, test } from "@jest/globals";
import { Rect } from "./geometry";

describe("Geometry tests", () => {
    test("Rect.include()", () => {
        const main = new Rect();
        expect(main.width()).toBe(0);
        expect(main.height()).toBe(0);

        main.include(new Rect(0, 0, 10, 15));
        expect(main.width()).toBe(10);
        expect(main.height()).toBe(15);

        main.include(new Rect(-5, 5, 8, 18));
        expect(main.left).toBe(-5);
        expect(main.top).toBe(0);
        expect(main.right).toBe(10);
        expect(main.bottom).toBe(18);
        expect(main.width()).toBe(15);
        expect(main.height()).toBe(18);

        const reversed = new Rect(10, 5, -3, -4);
        expect(reversed.width()).toBe(13);
        expect(reversed.height()).toBe(9);
    });
});
