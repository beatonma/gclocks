import { describe, expect, test } from "@jest/globals";
import { constrain, progress, toRadians } from "core/math";

describe("webapp.clocks math", () => {
    test("math.constrain", () => {
        expect(constrain(0.5, 0, 1)).toBe(0.5);
        expect(constrain(1.5, 0, 1)).toBe(1);
        expect(constrain(-1, 0, 1)).toBe(0);
    });

    test("math.progress", () => {
        expect(progress(10, 0, 100)).toBe(0.1);
        expect(progress(10, 10, 100)).toBe(0);
        expect(progress(20, 10, 100)).toBe(1 / 9);
    });

    test("math.toRadians", () => {
        expect(toRadians(0)).toBe(0);
        expect(toRadians(90)).toBe(Math.PI / 2);
        expect(toRadians(180)).toBe(Math.PI);
        expect(toRadians(270)).toBe((Math.PI * 3) / 2);
        expect(toRadians(360)).toBe(2 * Math.PI);

        expect(toRadians(-90)).toBe(-Math.PI / 2);
    });
});
