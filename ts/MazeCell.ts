import { Vector } from "./Vector";
import { Cell } from "./Cell";
export const FrontVector:Vector = new Vector(0,1);
export const RightVector:Vector = new Vector(1,0);
export const BackVector:Vector = new Vector(0,-1);
export const LeftVector:Vector = new Vector(-1,0);


export class MazeCell extends Cell{
    private _position:Vector;
    private _connected:boolean;
    constructor(x:number,y:number){
        super();
        this._position = new Vector(x,y);
        this._connected = false;
    }

    public set Connected(value){
        this._connected = value;
    }
    public get Connected(){ return this._connected; }

    public get Position(){
        return this._position;
    }

    public get AvailableVectors():Array<Vector>{
        const directions = new Array<Vector>();
        if(this.Front == null) { directions.push(FrontVector); }
        if(this.Right == null) { directions.push(RightVector); }
        if(this.Back == null) { directions.push(BackVector); }
        if(this.Left == null) { directions.push(LeftVector); }
        return directions;
    }
    

    public get ConnectionCount():number{
        let count = 0
        if(this.Front != null){ count++; }
        if(this.Right != null){ count++; }
        if(this.Back != null){ count++; }
        if(this.Left != null){ count++; }
        return count;
    }
    public Barricade(){
        if(this.Front == null) { this.Front = MazeWall; }
        if(this.Right == null) { this.Right = MazeWall; }
        if(this.Back == null) { this.Back = MazeWall; }
        if(this.Left == null) { this.Left = MazeWall; }
    }

    public  SetCellVector(v:Vector, cell:MazeCell){
        if(FrontVector.Equals(v)) { this.Front = cell; }
        else if(RightVector.Equals(v)) { this.Right = cell; }
        else if(BackVector.Equals(v)) { this.Back = cell; }
        else if(LeftVector.Equals(v)) { this.Left = cell; }
    }

    public GetCellVector(v:Vector):MazeCell|null {
        if(FrontVector.Equals(v)) { return this.Front as MazeCell; }
        if(RightVector.Equals(v)) { return this.Right as MazeCell; }
        if(BackVector.Equals(v)) { return this.Back as MazeCell; }
        if(LeftVector.Equals(v)) { return this.Left as MazeCell; }

        return null;
    }
}

export const MazeWall:MazeCell = new MazeCell(-1,-1);