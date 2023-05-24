import { Size } from "./geometry";
import { Alignment, HorizontalAlignment, VerticalAlignment } from "./types";

export namespace Align {
    export const apply = (
        alignment: Alignment,
        object: Size,
        space: Size,
        defaultX: number = 0,
        defaultY: number = 0
    ): [number, number] => {
        return [
            applyHorizontal(
                getHorizontalAlignment(alignment),
                object.width,
                space.width,
                defaultX
            ),
            applyVertical(
                getVerticalAlignment(alignment),
                object.height,
                space.height,
                defaultY
            ),
        ];
    };

    export const applyHorizontal = (
        alignment: Alignment,
        objectWidth: number,
        spaceWidth: number,
        defaultX: number = 0
    ): number => {
        if (
            HorizontalAlignment.Start ===
            (alignment & HorizontalAlignment.Start)
        ) {
            return 0;
        }
        if (
            HorizontalAlignment.Center ===
            (alignment & HorizontalAlignment.Center)
        ) {
            return (spaceWidth - objectWidth) / 2;
        }
        if (HorizontalAlignment.End === (alignment & HorizontalAlignment.End)) {
            return spaceWidth - objectWidth;
        }

        return defaultX;
    };

    export const applyVertical = (
        gravity: Alignment,
        objectHeight: number,
        spaceHeight: number,
        defaultY: number = 0
    ): number => {
        if (VerticalAlignment.Top === (gravity & VerticalAlignment.Top)) {
            return 0;
        }
        if (VerticalAlignment.Center === (gravity & VerticalAlignment.Center)) {
            return (spaceHeight - objectHeight) / 2;
        }
        if (VerticalAlignment.Bottom === (gravity & VerticalAlignment.Bottom)) {
            return spaceHeight - objectHeight;
        }
        return defaultY;
    };

    const getHorizontalAlignment = (
        alignment: Alignment
    ): HorizontalAlignment =>
        alignment &
        (HorizontalAlignment.Center |
            HorizontalAlignment.Start |
            HorizontalAlignment.End);

    const getVerticalAlignment = (alignment: Alignment): VerticalAlignment =>
        alignment &
        (VerticalAlignment.Center |
            VerticalAlignment.Top |
            VerticalAlignment.Bottom);
}
