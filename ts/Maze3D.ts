import { Maze } from "./Maze";
import { Axis, Color3, Material, Mesh, MeshBuilder, Scene, StandardMaterial } from "babylonjs";
import { MazeCell, MazeWall } from "./MazeCell";
export class Maze3D{
    private _maze:Maze;
    private _scene:Scene;
    private _cell_size:number;
    private _wall_material:StandardMaterial;
    constructor(scene:Scene, maze:Maze, size:number){
        this._maze = maze;
        this._scene = scene;
        this._cell_size = size;
        this._wall_material = new StandardMaterial("wall_mat", this._scene);
        this._wall_material.diffuseColor = new Color3(0.5,0,0);
    }

    CreateCell(cell:MazeCell){//:Mesh|null{
        if(!cell.Connected){ return null; }
        const x = this._cell_size*cell.Position.X;
        const y = this._cell_size*cell.Position.Y;
        const floor = MeshBuilder.CreatePlane("wall",{size:this._cell_size});
        floor.material = this._wall_material;
        floor.position.set(x,0,y);
        floor.rotate(Axis.X, Math.PI/2);
        floor.checkCollisions = true;
        let walls:Array<Mesh> = [];
        if(cell.Front == MazeWall){
            const wall = MeshBuilder.CreatePlane("wall",{size:this._cell_size});
            wall.material = this._wall_material;
            wall.position.set(x,this._cell_size/2,y+this._cell_size/2);
            wall.checkCollisions = true;
            //wall.rotate(Axis.X, Math.PI/2);
            walls.push(wall);
        }
        if(cell.Right == MazeWall){
            const wall = MeshBuilder.CreatePlane("wall",{size:this._cell_size});
            wall.material = this._wall_material;
            wall.position.set(x+this._cell_size/2,this._cell_size/2,y);
            wall.checkCollisions = true;
            wall.rotate(Axis.Y, Math.PI/2);
            walls.push(wall);
        }

        if(cell.Back == MazeWall){
            const wall = MeshBuilder.CreatePlane("wall",{size:this._cell_size});
            wall.material = this._wall_material;
            wall.position.set(x,this._cell_size/2,y-this._cell_size/2);
            wall.checkCollisions = true;
            wall.rotate(Axis.Y, Math.PI);
            walls.push(wall);
        }

        if(cell.Left == MazeWall){
            const wall = MeshBuilder.CreatePlane("wall",{size:this._cell_size});
            wall.material = this._wall_material;
            wall.position.set(x-this._cell_size/2,this._cell_size/2,y);
            wall.checkCollisions = true;
            wall.rotate(Axis.Y, -Math.PI/2);
            walls.push(wall);
        }

        //return Mesh.MergeMeshes(walls);
    }

    CreateMaze():Mesh|null{
        const iterator = this._maze.CellsItr();
        let itr_ptr = iterator.next();
        let cells:Array<Mesh> = [];
        while(itr_ptr.done == false){
            //const cell:Mesh|null = this.CreateCell(itr_ptr.value);
            this.CreateCell(itr_ptr.value);
            // if(cell != null){
            //     cell.checkCollisions = true;
            //     cells.push(cell);
            // }
            itr_ptr = iterator.next();
        }
        return null;
        //return Mesh.MergeMeshes(cells);
    }
}