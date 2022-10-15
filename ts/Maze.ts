import { MazeCell, MazeWall } from "./MazeCell";
import { Vector } from "./Vector";

export class Maze{
    private _size_x:number;
    private _size_y:number;
    private _grid:Array<Array<MazeCell>>;
    constructor(size_x:number, size_y:number){
        this._size_x = size_x;
        this._size_y = size_y;
        this._grid = [];
        for(let y=0;y<this._size_y;y++){
            let row:Array<MazeCell> = [];
            for(let x=0;x<this._size_x;x++){
                const c = new MazeCell(x,y);
                if(y==0){ c.Back = MazeWall; }
                else if(y==this._size_y-1){c.Front = MazeWall; }
                if(x == 0){ c.Left = MazeWall; }
                else if(x==this._size_x-1){c.Right = MazeWall; }
                row.push(c);
            }
            this._grid.push(row);
        }
    }
    get SizeX():number { return this._size_x; }
    get SizeY():number { return this._size_y; }

    public *CellsItr(){
        for(let y=0;y<this._size_y;y++){
            for(let x=0;x<this._size_x;x++){
                yield this._grid[y][x];
            }
        }
        return;
    }

    public GetCell(v:Vector):MazeCell|null{
        return this.GetCellXY(v.X, v.Y);
    }
    public GetCellXY(x:number,y:number):MazeCell|null{
        if(x<0 || x>=this._size_x || y<0 || y>=this._size_y){ return MazeWall; }
        return this._grid[y][x];
    }

    public Finalize(){
        const iterator = this.CellsItr();
        let itr_ptr = iterator.next();
        while(itr_ptr.done == false){
            itr_ptr.value.Barricade();
            itr_ptr = iterator.next();
        }
    }

    public static Generate(start_x:number, start_y:number, width:number, height:number):Maze{
        const maze = new Maze(width,height);
            let current_cell:MazeCell|null = maze.GetCellXY(start_x,start_y);
            if(current_cell==null){ throw "Invalid Start Coordinates"; }
            
            current_cell.Connected = true;
            // const end_point = new Vector(99,99);
            const path_stack = [];
            //While we are not at the endpoint
            //while(!current_cell.Position.Equals(end_point)){
            while(true){
                
                //console.log(`${current_cell.Position.X} ${current_cell.Position.Y}`);
                //get all possible directions to move
                let vectors = current_cell.AvailableVectors;
                //If there is no where to go, back up
                if(vectors.length == 0){
                    //If there are no more cells to back up..
                    //then something weird is happening break out
                    if(path_stack.length == 0){ break; }

                    let stack_pop = path_stack.pop();
                    if(stack_pop == undefined) { throw "The Path Stack is corrupt" }
                    current_cell = stack_pop;
                    continue;
                }

                //Choose a random direction from available vectors
                let index = Math.floor(Math.random() * vectors.length);
                let next_vector = vectors[index];
                let reverse_next_vector = next_vector.Reverse();
                
                let next_cell_position = current_cell.Position.Add(next_vector);
                const next_cell = maze.GetCell(next_cell_position);
                if(next_cell == null){ throw "Something bad happened"; }
                //If the cell in the chosen direction is already connected
                //Wall us off from going that way and try again.
                if(next_cell.Connected){
                    current_cell.SetCellVector(next_vector, MazeWall);
                    continue;
                }
                //Make our connections between cells and move to the next cell
                current_cell.SetCellVector(next_vector, next_cell);
                next_cell.SetCellVector(reverse_next_vector, current_cell);

                path_stack.push(current_cell);
                current_cell = next_cell;
                current_cell.Connected = true;
                
            }
            console.log(`${current_cell.Position.X} ${current_cell.Position.Y}`);
            maze.Finalize();
            return maze;
    }
}