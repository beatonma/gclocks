import { describe, test, expect } from "@jest/globals";
import { TimeFormat } from "../core";
import {
    HorizontalAlignment,
    VerticalAlignment,
} from "../core/options/alignment";
import { Options } from "../core/options/options";
import { Layout } from "../core/options/types";
import { PersistentSettings } from "./settings";

const DefaultOptions = () =>
    new Options({
        alignment: HorizontalAlignment.Start | VerticalAlignment.Top,
        format: TimeFormat.H_MM_SS_24,
        glyphMorphMillis: 800,
        layout: Layout.Wrapped,
        spacingPx: 16,
    });

describe("Settings persistence tests", () => {
    describe("Restoring", () => {
        const parse = (params: string) =>
            PersistentSettings.parseUrlOptions(DefaultOptions(), params);

        test("Options are restored from search query params", () => {
            const result = parse(
                "?alignment=End__Bottom&glyphMorphMillis=500&format=HH_MM_SS_12&layout=Horizontal&spacingPx=32"
            );
            expect(result.alignment).toBe(
                HorizontalAlignment.End | VerticalAlignment.Bottom
            );
            expect(result.format).toBe(TimeFormat.HH_MM_SS_12);
            expect(result.glyphMorphMillis).toBe(500);
            expect(result.layout).toBe(Layout.Horizontal);
            expect(result.spacingPx).toBe(32);
        });

        test("Undefined options are not overwritten", () => {
            const result = parse(
                "?glyphMorphMillis=500&format=HH_MM_SS_12&layout=Horizontal"
            );
            // Unchanged
            expect(result.spacingPx).toBe(16);
            expect(result.alignment).toBe(
                HorizontalAlignment.Start | VerticalAlignment.Top
            );
            // Updated
            expect(result.glyphMorphMillis).toBe(500);
            expect(result.layout).toBe(Layout.Horizontal);
        });

        test("alignment parsing is correct", () => {
            expect(parse("?alignment=Center__Center").alignment).toBe(
                HorizontalAlignment.Center | VerticalAlignment.Center
            );
            expect(parse("?alignment=Center__Default").alignment).toBe(
                HorizontalAlignment.Center | VerticalAlignment.Default
            );
        });
    });

    describe("Saving", () => {
        test("Options are added to search params", () => {
            const result = PersistentSettings.setUrlOptions(
                DefaultOptions(),
                ""
            );

            expect(result.get("format")).toBe("H_MM_SS_24");
        });

        test("Options do not remove unrelated params", () => {
            const result = PersistentSettings.setUrlOptions(
                DefaultOptions(),
                "?unrelated=312"
            );

            expect(result.get("unrelated")).toBe("312");
            expect(result.get("format")).toBe("H_MM_SS_24");
        });
    });
});
