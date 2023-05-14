interface CanvasRenderingContext2D {
    text(text: string, x: number, y: number, color: string): void;
}

export const canvasExtensions = () => {
    Object.defineProperty(CanvasRenderingContext2D.prototype, "text", {
        value: function (text: string, x: number, y: number, color: string) {
            this.fillStyle = color;
            this.fillText(text, x, y);
        },
    });
};
