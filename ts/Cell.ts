export class Cell{
    private _front:Cell|null;
    private _right:Cell|null;
    private _back:Cell|null;
    private _left:Cell|null;
    constructor(){
        this._front = null;
        this._right = null;
        this._back = null;
        this._left = null;
        
    }
    public get Front():Cell|null{ return this._front; }
    public get Right():Cell|null{ return this._right; }
    public get Back():Cell|null{ return this._back; }
    public get Left():Cell|null{ return this._left; }
    public set Front(value:Cell|null){ this._front = value; }
    public set Right(value:Cell|null){ this._right = value; }
    public set Back(value:Cell|null){ this._back = value; }
    public set Left(value:Cell|null){ this._left = value; }
}