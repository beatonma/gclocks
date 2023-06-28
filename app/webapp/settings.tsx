import React, {
    ChangeEvent,
    HTMLProps,
    useEffect,
    useId,
    useState,
} from "react";
import { DefaultOptions } from "../../core";
import { Options, OptionsInit } from "../../core/options/options";
import { Layout } from "../../core/options/types";
import { Paints } from "../../core/render/types";

interface ClockSettingsProps {
    options: Options;
    setOptions: (options: Options) => void;
    paints: Paints;
    setPaints: (paints: Paints) => void;
}
export const ClockSettings = (
    props: { isVisible: boolean; hideSettings: () => void } & ClockSettingsProps
) => {
    const { isVisible, hideSettings, ...rest } = props;

    if (!isVisible) return <ClockSettingsHint />;

    return (
        <div className="clock-settings">
            <section className="settings-group">
                <ClockPaints {...rest} />
            </section>

            <section className="settings-group">
                <ClockOptions {...rest} />
            </section>

            <div className="buttons-group">
                <button onClick={() => window.location.assign("?")}>
                    Reset
                </button>
                <button onClick={() => hideSettings()}>Close</button>
            </div>
        </div>
    );
};

const ClockPaints = (props: ClockSettingsProps) => {
    const { paints, setPaints, options, setOptions } = props;
    const [colors, setColors] = useState(paints.colors);

    useEffect(() => {
        setColors(paints.colors);
    }, [paints]);

    return (
        <div className="clock-paints">
            {colors.map((color, index) => {
                return (
                    <ColorInput
                        key={index}
                        color={color}
                        onChange={newColor => {
                            const newColors = [...colors];
                            newColors[index] = newColor;
                            setPaints({ ...paints, colors: newColors });
                        }}
                        title={`Color #${index + 1}`}
                    />
                );
            })}

            <ColorInput
                color={
                    options.backgroundColor ?? DefaultOptions.backgroundColor
                }
                onChange={newColor => {
                    setOptions(
                        new Options({ ...options, backgroundColor: newColor })
                    );
                }}
                title="Background"
            />
        </div>
    );
};

const ClockOptions = (props: ClockSettingsProps) => {
    const { options, setOptions } = props;

    const updateOptions = (newOptions: OptionsInit) => {
        const result = new Options({ ...options, ...newOptions });
        console.log(result);
        setOptions(result);
    };

    console.log(options.layout);

    return (
        <div className="clock-options">
            <Select
                label="Layout"
                values={namedKeys(Layout)}
                value={Layout.Wrapped}
                onChange={newValue => {
                    console.log(`onChange ${newValue}`);
                    updateOptions({
                        layout: Layout[newValue as keyof typeof Layout],
                    });
                }}
            />

            <IntInput
                label="Spacing (pixels)"
                value={options.spacingPx}
                onChange={newValue => updateOptions({ spacingPx: newValue })}
            />

            <p>
                You can alter the clock size and position by dragging its
                boundaries while settings are visible.
            </p>
        </div>
    );
};

const ClockSettingsHint = () => {
    const [showHint, setShowHint] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setShowHint(false);
        }, 2000);
    }, []);

    if (!showHint) return null;

    return (
        <div className="clock-settings">
            Click on the clock to show customisation options.
        </div>
    );
};

const ColorInput = (props: {
    color: string;
    onChange: (newColor: string) => void;
    title?: string;
}) => {
    const { color, onChange, title } = props;
    return (
        <input
            type="color"
            value={color}
            className="clock-paint-color"
            onChange={ev => onChange(ev.target.value)}
            title={title}
        />
    );
};

const IntInput = (props: {
    label: string;
    value: number;
    onChange: (newValue: number) => void;
}) => {
    const { label, value, onChange } = props;
    const id = useId();

    return (
        <div className="input-wrapper">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type="number"
                value={value}
                onChange={ev => onChange(parseInt(ev.target.value))}
                min={0}
            />
        </div>
    );
};

const Select = <T extends object>(props: {
    label: string;
    values: string[];
    value: any;
    onChange: (newValue: string) => void;
}) => {
    const { label, values, value, onChange } = props;
    const id = useId();

    return (
        <div className="input-wrapper">
            <label htmlFor={id}>{label}</label>

            <select
                id={id}
                value={value.toString()}
                onChange={ev => onChange(ev.target.value)}
            >
                {values.map(it => (
                    <option key={it} value={it.toString()}>
                        {it.toString()}
                    </option>
                ))}
            </select>
        </div>
    );
};

const namedKeys = (obj: object) =>
    Object.keys(obj).filter(it => isNaN(parseInt(it)));
