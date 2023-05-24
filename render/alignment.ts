import { Alignment, HorizontalAlignment, VerticalAlignment } from "./types";

export namespace Align {
    export const apply = (
        alignment: Alignment,
        objectWidth: number,
        objectHeight: number,
        spaceWidth: number,
        spaceHeight: number,
        x: number = 0,
        y: number = 0
    ): [number, number] => {
        return [
            applyHorizontal(
                getHorizontalAlignment(alignment),
                objectWidth,
                spaceWidth,
                x
            ),
            applyVertical(
                getVerticalAlignment(alignment),
                objectHeight,
                spaceHeight,
                y
            ),
        ];
    };

    export const split = (
        alignment: Alignment
    ): [HorizontalAlignment, VerticalAlignment] => [
        getHorizontalAlignment(alignment),
        getVerticalAlignment(alignment),
    ];

    export const applyHorizontal = (
        gravity: HorizontalAlignment,
        objectWidth: number,
        spaceWidth: number,
        originalX: number = 0
    ): number => {
        if (
            HorizontalAlignment.Start ===
            (gravity & HorizontalAlignment.Start)
        ) {
            return 0;
        }
        if (
            HorizontalAlignment.Center ===
            (gravity & HorizontalAlignment.Center)
        ) {
            return (spaceWidth - objectWidth) / 2;
        }
        if (HorizontalAlignment.End === (gravity & HorizontalAlignment.End)) {
            return spaceWidth - objectWidth;
        }

        return originalX;
    };

    export const applyVertical = (
        gravity: VerticalAlignment,
        objectHeight: number,
        spaceHeight: number,
        originalY: number = 0
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
        return originalY;
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
