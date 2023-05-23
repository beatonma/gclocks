import { Alignment, HorizontalAlignment, VerticalAlignment } from "./types";

export namespace Align {
    export const apply = (
        x: number,
        y: number,
        objectWidth: number,
        objectHeight: number,
        spaceWidth: number,
        spaceHeight: number,
        alignment: Alignment
    ): [number, number] => {
        return [
            applyHorizontal(
                x,
                objectWidth,
                spaceWidth,
                getHorizontalAlignment(alignment)
            ),
            applyVertical(
                y,
                objectHeight,
                spaceHeight,
                getVerticalAlignment(alignment)
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
        originalX: number,
        objectWidth: number,
        spaceWidth: number,
        gravity: HorizontalAlignment
    ): number => {
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
        originalY: number,
        objectHeight: number,
        spaceHeight: number,
        gravity: VerticalAlignment
    ): number => {
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
