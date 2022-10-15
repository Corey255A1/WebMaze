export class Vector{
    private _x:number;
    private _y:number;
    constructor(x:number,y:number){
        this._y = y;
        this._x = x;
    }
    public get X(){return this._x;}
    public get Y(){return this._y;}

    public Add(v:Vector):Vector{
        return new Vector(this._x + v.X, this._y + v.Y);
    }
    public Reverse():Vector{
        return new Vector(this._x * -1, this._y * -1);
    }
    public Equals(v:Vector):boolean{
        return this._x == v.X && this._y == v.Y;
    }
}