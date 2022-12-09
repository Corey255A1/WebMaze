//Corey Wunderlich 2022
//https://www.wundervisionenvisionthefuture.com/
import { Maze } from "./Maze";
import { MazeCell, MazeWall } from "./MazeCell";

export class Maze2D {
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _maze: Maze;
    private _wall_width: number;
    private _wall_height: number;
    constructor(canvas: HTMLCanvasElement, maze: Maze) {
        this._canvas = canvas;
        this._maze = maze;
        let ctx = this._canvas.getContext('2d');
        if (ctx == null) { throw "Could not get 2D Context"; }
        this._context = ctx;
        this._context.fillStyle = 'black';
        this._context.strokeStyle = 'white';
        this._context.lineWidth = 2;
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        this._wall_width = this._canvas.width / maze.SizeX;
        this._wall_height = this._canvas.height / maze.SizeY;
    }

    get Image(): ImageData {
        return this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
    }

    CreateWalls(ctx: CanvasRenderingContext2D, cell: MazeCell) {
        if (!cell.Connected) { return; }
        const x = this._wall_width * cell.Position.X;
        const y = this._wall_height * cell.Position.Y;

        ctx.beginPath();
        if (cell.Front == MazeWall) {
            ctx.moveTo(x, y + this._wall_height);
            ctx.lineTo(x + this._wall_width, y + this._wall_height);
        }
        if (cell.Right == MazeWall) {
            ctx.moveTo(x + this._wall_width, y + this._wall_height);
            ctx.lineTo(x + this._wall_width, y);
        }

        if (cell.Back == MazeWall) {
            ctx.moveTo(x + this._wall_width, y);
            ctx.lineTo(x, y);
        }

        if (cell.Left == MazeWall) {
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + this._wall_height);
        }
        ctx.stroke();
    }

    CreateMaze() {
        const iterator = this._maze.CellsItr();
        let itr_ptr = iterator.next();
        while (itr_ptr.done == false) {
            this.CreateWalls(this._context, itr_ptr.value);
            itr_ptr = iterator.next();
        }
    }
}