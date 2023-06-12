import { Size } from "../geometry";

export enum HorizontalAlignment {
    Default = 0,
    Start = 1 << 0, // 1
    Center = 1 << 1, // 2
    End = 1 << 2, // 4
}

export enum VerticalAlignment {
    Default = 0,
    Top = 1 << 3, // 8
    Center = 1 << 4, // 16
    Bottom = 1 << 5, // 32
}

export type Alignment = HorizontalAlignment | VerticalAlignment;

export namespace Alignment {
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

    export const getHorizontalAlignment = (
        alignment: Alignment
    ): HorizontalAlignment =>
        alignment &
        (HorizontalAlignment.Center |
            HorizontalAlignment.Start |
            HorizontalAlignment.End);

    export const getVerticalAlignment = (
        alignment: Alignment
    ): VerticalAlignment =>
        alignment &
        (VerticalAlignment.Center |
            VerticalAlignment.Top |
            VerticalAlignment.Bottom);

    export const unpack = (
        alignment: Alignment
    ): [HorizontalAlignment, VerticalAlignment] => [
        getHorizontalAlignment(alignment),
        getVerticalAlignment(alignment),
    ];
}
