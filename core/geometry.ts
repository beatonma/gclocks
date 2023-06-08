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
        this.set(left, top, right, bottom);
    }

    /**
     * Update the boundaries of this Rect to fully include the other.
     *
     * Returns true if this resulted in our boundaries changing.
     * Returns false if other Rect was already within our boundaries.
     */
    include = (other: Rect): boolean => {
        const originalArea = this.area();
        this.left = Math.min(this.left, other.left);
        this.top = Math.min(this.top, other.top);
        this.right = Math.max(this.right, other.right);
        this.bottom = Math.max(this.bottom, other.bottom);
        return this.area() !== originalArea;
    };

    copy = (other: Rect) => {
        this.left = other.left;
        this.top = other.top;
        this.right = other.right;
        this.bottom = other.bottom;
    };

    area = () => this.width() * this.height();

    set = (left: number, top: number, right: number, bottom: number) => {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;

        if (left > right) {
            this.left = right;
            this.right = left;
        }
        if (top > bottom) {
            this.top = bottom;
            this.bottom = top;
        }
        return this;
    };

    width = () => this.right - this.left;
    height = () => this.bottom - this.top;

    toSize = () => new Size(this.width(), this.height());
    isEmpty = (): boolean => this.area() === 0;

    *[Symbol.iterator]() {
        yield this.left;
        yield this.top;
        yield this.right;
        yield this.bottom;
    }

    toString = () =>
        `Rect(${this.left}, ${this.top}, ${this.right}, ${this.bottom})`;
}

export class Size {
    width: number;
    height: number;

    constructor(width: number = 0, height: number = 0) {
        this.width = width;
        this.height = height;
    }

    scaledBy = (factor: number): Size =>
        new Size(
            Math.floor(this.width * factor),
            Math.floor(this.height * factor)
        );

    isEmpty = () => this.width === 0 || this.height === 0;

    *[Symbol.iterator]() {
        yield this.width;
        yield this.height;
    }

    toString = () => `${this.width} x ${this.height}`;
}

export namespace Size {
    export const ofElement = (element: Element) =>
        new Size(element.clientWidth, element.clientHeight);
}
