import { Maze } from "./Maze";
import { Maze2D } from "./Maze2D";

export class Maze2DMain{
    private _maze:Maze | null;
    private _maze_renderer:Maze2D | null;
    private _maze_element:HTMLCanvasElement | null;
    constructor(canvas_id:string){
        this._maze_element = document.getElementById(canvas_id) as HTMLCanvasElement;
        if(this._maze_element == null){ throw "Canvas Not Found"; }

        this._maze = null;
        this._maze_renderer = null;
    }

    public Generate():Maze{
        this._maze = Maze.Generate(0,0,100,100);
        if(this._maze_element != null){
            this._maze_renderer = new Maze2D(this._maze_element, this._maze);
            this._maze_renderer.render();
        }
        return this._maze;
    }
}