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

    //To-Do - Optimize .. Combine walls in like directions
    CreateWalls(cell:MazeCell){//:Mesh|null{
        if(!cell.Connected){ return; }
        const x = this._cell_size*cell.Position.X;
        const y = this._cell_size*cell.Position.Y;
        let walls:Array<Mesh> = [];
        if(cell.Front == MazeWall){
            //const wall = MeshBuilder.CreatePlane("wall",{size:this._cell_size});
            const wall = MeshBuilder.CreateBox("wall", {width:this._cell_size+0.5,height:this._cell_size+0.5,depth:0.5})
            wall.material = this._wall_material;
            wall.position.set(x,this._cell_size/2,y+this._cell_size/2);
            wall.checkCollisions = true;
            //wall.rotate(Axis.X, Math.PI/2);
            walls.push(wall);
        }
        if(cell.Right == MazeWall){
            //const wall = MeshBuilder.CreatePlane("wall",{size:this._cell_size});
            const wall = MeshBuilder.CreateBox("wall", {width:this._cell_size+0.5,height:this._cell_size+0.5,depth:0.5})
            wall.material = this._wall_material;
            wall.position.set(x+this._cell_size/2,this._cell_size/2,y);
            wall.checkCollisions = true;
            wall.rotate(Axis.Y, Math.PI/2);
            walls.push(wall);
        }

        if(cell.Back == MazeWall){
            //const wall = MeshBuilder.CreatePlane("wall",{size:this._cell_size});
            const wall = MeshBuilder.CreateBox("wall", {width:this._cell_size+0.5,height:this._cell_size+0.5,depth:0.5})
            wall.material = this._wall_material;
            wall.position.set(x,this._cell_size/2,y-this._cell_size/2);
            wall.checkCollisions = true;
            wall.rotate(Axis.Y, Math.PI);
            walls.push(wall);
        }

        if(cell.Left == MazeWall){
            //const wall = MeshBuilder.CreatePlane("wall",{size:this._cell_size});
            const wall = MeshBuilder.CreateBox("wall", {width:this._cell_size+0.5,height:this._cell_size+0.5,depth:0.5})
            wall.material = this._wall_material;
            wall.position.set(x-this._cell_size/2,this._cell_size/2,y);
            wall.checkCollisions = true;
            wall.rotate(Axis.Y, -Math.PI/2);
            walls.push(wall);
        }

        //return Mesh.MergeMeshes(walls);
    }

    CreateMaze():Mesh|null{

        const floor = MeshBuilder.CreateGround("floor", {width:this._maze.SizeX*(this._cell_size+1), height:this._maze.SizeY*(this._cell_size+1)})
        floor.material = this._wall_material;
        floor.position.set((this._maze.SizeX*this._cell_size)/2,0,(this._maze.SizeY*this._cell_size)/2);
        floor.checkCollisions = true;

        const iterator = this._maze.CellsItr();
        let itr_ptr = iterator.next();
        let cells:Array<Mesh> = [];
        while(itr_ptr.done == false){
            //const cell:Mesh|null = this.CreateCell(itr_ptr.value);
            this.CreateWalls(itr_ptr.value);
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