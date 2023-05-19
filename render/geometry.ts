export class Rect {
    left: number;
    top: number;
    right: number;
    bottom: number;

    constructor(
        left: number = 0,
        top: number = 0,
        right: number = 0,
        bottom: number = 0
    ) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    include(other: Rect): Rect {
        this.left = Math.min(this.left, other.left);
        this.top = Math.min(this.top, other.top);
        this.right = Math.max(this.right, other.right);
        this.bottom = Math.max(this.bottom, other.bottom);
        return this;
    }

    toString() {
        return `Rect(${this.left}, ${this.top}, ${this.right}, ${this.bottom})`;
    }
}

export class Size {
    width: number;
    height: number;

    constructor(width: number = 0, height: number = 0) {
        this.width = width;
        this.height = height;
    }

    *[Symbol.iterator]() {
        yield this.width;
        yield this.height;
    }

    scaledBy(factor: number): Size {
        return new Size(
            Math.floor(this.width * factor),
            Math.floor(this.height * factor)
        );
    }

    toString = () => `${this.width} x ${this.height}`;
}

export namespace Size {
    export const ofElement = (element: Element) =>
        new Size(element.scrollWidth, element.scrollHeight);
}
