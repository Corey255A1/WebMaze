//Corey Wunderlich 2022
//https://www.wundervisionenvisionthefuture.com/
export class PlayerInputs {
    private _analogs: Map<string, number>;
    private _digitals: Map<string, boolean>;
    private _digital_callback: null | ((name: string, value: boolean) => void);
    private _analog_callback: null | ((name: string, value: number) => void);
    constructor() {
        this._analogs = new Map<string, number>();
        this._digitals = new Map<string, boolean>();
        this._digital_callback = null;
        this._analog_callback = null;
    }

    public SetAnalogChangeCallback(callback: ((name: string, value: number) => void)) {
        this._analog_callback = callback;
    }
    public SetDigitalChangeCallback(callback: ((name: string, value: boolean) => void)) {
        this._digital_callback = callback;
    }

    public AddAnalog(name: string, initial: number) {
        this._analogs.set(name, initial);
    }
    public AddDigital(name: string, initial: boolean) {
        this._digitals.set(name, initial);
    }
    public SetAnalog(name: string, value: number) {
        if (!this._analogs.has(name)) { throw "Not an input option"; }
        this._analogs.set(name, value);
        if (this._analog_callback != null) { this._analog_callback(name, value); }
    }
    public SetDigital(name: string, value: boolean) {
        if (!this._digitals.has(name)) { throw "Not an input option"; }
        this._digitals.set(name, value);
        if (this._digital_callback != null) { this._digital_callback(name, value); }
    }
    public GetAnalog(name: string) {
        if (!this._analogs.has(name)) { throw "Not an input option"; }
        return this._analogs.get(name);
    }
    public GetDigital(name: string) {
        if (!this._digitals.has(name)) { throw "Not an input option"; }
        return this._digitals.get(name);
    }
}