import { Canvas, Paints } from "./types";

type OnStateChange = (state: GlyphState) => void;

export enum GlyphState {
    Unused,
    Inactive,
    Active,
    Activating,
    Deactivating,
    Appearing,
    DisappearingFromActive,
    DisappearingFromInactive,
    Disappeared,
}

export enum GlyphStateLock {
    None,
    Active,
    Inactive,
}

export interface Glyph {
    state: GlyphState;
    lock: GlyphStateLock;
    key: string;
    onStateChange?: OnStateChange;
    scale: number;

    draw: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;

    setActivating: () => void;
    setDeactivating: () => void;
    setActive: () => void;
    setInactive: () => void;
    setAppearing: () => void;
    setDisappearing: () => void;

    getWidthAtProgress: (progress: number) => number;

    getCanonicalStartGlyph: () => string;
    getCanonicalEndGlyph: () => string;
}

export abstract class BaseGlyph implements Glyph {
    state: GlyphState = GlyphState.Appearing;
    lock: GlyphStateLock = GlyphStateLock.None;
    key = "0";
    onStateChange?: OnStateChange;
    scale: number = 1;

    constructor(onStateChange?: OnStateChange) {
        this.onStateChange = onStateChange;
    }

    stateAnimTime: number = 0;
    deactivationStartedTime: number = 0;
    height: number;

    abstract getWidthAtProgress: (progress: number) => number;
    abstract draw0_1: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw1_2: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw2_3: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw3_4: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw4_5: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw5_6: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw6_7: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw7_8: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw8_9: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw9_0: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw__1: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw__2: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw1__: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw2__: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw2_1: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw2_0: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw3_0: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw5_0: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract draw_: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;
    abstract drawSeparator: (
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ) => void;

    setState(state: GlyphState) {
        const stateChanged = this.state !== state;
        this.state = state;

        this.stateAnimTime = 0;
        this.deactivationStartedTime =
            state === GlyphState.Deactivating ? Date.now() : 0;

        if (stateChanged) this.onStateChange?.(state);
    }

    /**
     * Returns true if the current lock prevents transit to targetState.
     * @param targetState
     */
    isStateLocked(targetState: GlyphState): boolean {
        // TODO maybe..?
        return this.lock !== GlyphStateLock.None;
    }

    setActivating() {
        if (this.isStateLocked(GlyphState.Activating)) return;

        switch (this.state) {
            case GlyphState.Inactive:
                this.setState(GlyphState.Activating);
                break;
            case GlyphState.Deactivating:
                this.setState(GlyphState.Deactivating); // Reset animation.
                break;
        }
    }

    setDeactivating() {
        if (this.isStateLocked(GlyphState.Deactivating)) return;

        if (this.state === GlyphState.Active) {
            this.setState(GlyphState.Deactivating);
        }
    }

    setActive() {
        if (this.isStateLocked(GlyphState.Active)) return;

        if (
            [GlyphState.Activating, GlyphState.Appearing].includes(this.state)
        ) {
            this.setState(GlyphState.Active);
        } else {
            this.setActivating();
        }
    }

    setInactive() {
        if (this.isStateLocked(GlyphState.Inactive)) return;

        // BLAH
        if (this.state === GlyphState.Deactivating) {
            this.setState(GlyphState.Inactive);
        }
    }

    setAppearing() {
        this.setState(GlyphState.Appearing);
    }

    setDisappearing() {
        if (
            [
                GlyphState.Activating,
                GlyphState.Active,
                GlyphState.Deactivating,
            ].includes(this.state)
        ) {
            this.setState(GlyphState.DisappearingFromActive);
        } else {
            this.setState(GlyphState.DisappearingFromInactive);
        }
    }

    setDisappeared() {
        this.setState(GlyphState.Disappeared);
    }

    getCanonicalStartGlyph() {
        return this.key[0];
    }

    getCanonicalEndGlyph() {
        return this.key[this.key.length - 1];
    }

    draw(
        canvas: CanvasRenderingContext2D,
        progress: number,
        paints: Paints
    ): void {
        canvas.fillStyle = "#00000033";
        canvas.fillRect(0, 0, this.getWidthAtProgress(progress), this.height);

        switch (this.key) {
            case "0":
            case "0_1":
                this.draw0_1(canvas, progress, paints);
                break;
            case "1":
            case "1_2":
                this.draw1_2(canvas, progress, paints);
                break;
            case "2":
            case "2_3":
                this.draw2_3(canvas, progress, paints);
                break;
            case "3":
            case "3_4":
                this.draw3_4(canvas, progress, paints);
                break;
            case "4":
            case "4_5":
                this.draw4_5(canvas, progress, paints);
                break;
            case "5":
            case "5_6":
                this.draw5_6(canvas, progress, paints);
                break;
            case "6":
            case "6_7":
                this.draw6_7(canvas, progress, paints);
                break;
            case "7":
            case "7_8":
                this.draw7_8(canvas, progress, paints);
                break;
            case "8":
            case "8_9":
                this.draw8_9(canvas, progress, paints);
                break;
            case "9":
            case "9_0":
                this.draw9_0(canvas, progress, paints);
                break;
            case " _1":
                this.draw__1(canvas, progress, paints);
                break;
            case " _2":
                this.draw__2(canvas, progress, paints);
                break;
            case "1_ ":
                this.draw1__(canvas, progress, paints);
                break;
            case "2_ ":
                this.draw2__(canvas, progress, paints);
                break;
            case "2_1":
                this.draw2_1(canvas, progress, paints);
                break;
            case "2_0":
                this.draw2_0(canvas, progress, paints);
                break;
            case "3_0":
                this.draw3_0(canvas, progress, paints);
                break;
            case "5_0":
                this.draw5_0(canvas, progress, paints);
                break;
            case " ":
                this.draw_(canvas, progress, paints);
                break;
            case ":":
                this.drawSeparator(canvas, progress, paints);
                break;
            default:
                console.warn(`Unknown key ${this.key}`);
        }
    }

    stroke(canvas: Canvas, paints: Paints, colorIndex: number) {
        canvas.strokeStyle = `${paints.strokeWidth}px ${paints.colors[colorIndex]}`;
        canvas.stroke();
    }
}
