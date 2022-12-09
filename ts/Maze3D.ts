//Corey Wunderlich 2022
//https://www.wundervisionenvisionthefuture.com/
import { Maze } from "./Maze";
import { Axis, Color3, Material, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { MazeCell, MazeWall } from "./MazeCell";
import { Maze3DWall } from "./Maze3DWall";
export class Maze3D {
    private _maze: Maze;
    private _scene: Scene;
    private _cell_size: number;
    private _wall_material: StandardMaterial;
    private _wall_material_highlight: StandardMaterial;
    private _walls: Map<MazeCell, Array<Maze3DWall>>;
    private _wall_params: any;
    constructor(scene: Scene, maze: Maze, size: number) {
        this._maze = maze;
        this._scene = scene;
        this._cell_size = size;
        this._wall_material = new StandardMaterial("wall_material", this._scene);
        this._wall_material.diffuseColor = new Color3(0.5, 0, 0);
        this._wall_material_highlight = new StandardMaterial("wall_material_highlight", this._scene);
        this._wall_material_highlight.diffuseColor = new Color3(0.1, 0.1, 0.5);
        this._walls = new Map<MazeCell, Array<Maze3DWall>>();

        this._wall_params = { width: this._cell_size + 0.5, height: this._cell_size + 0.5, depth: 0.5 };
    }

    private CreateWalls(cell: MazeCell): Array<Maze3DWall> | null {
        if (!cell.Connected) { return null; }
        const x = this._cell_size * cell.Position.X;
        const y = this._cell_size * cell.Position.Y;
        let walls: Array<Maze3DWall> = [];
        if (cell.Front == MazeWall) {
            const wall = new Maze3DWall(
                this._wall_params, this._wall_material, this._wall_material_highlight); //MeshBuilder.CreateBox("wall", this._wall_params);
            wall.Mesh.position.set(x, this._cell_size / 2, y + this._cell_size / 2);
            walls.push(wall);
        }

        if (cell.Right == MazeWall) {
            const wall = new Maze3DWall(
                this._wall_params, this._wall_material, this._wall_material_highlight); //MeshBuilder.CreateBox("wall", this._wall_params);
            wall.Mesh.position.set(x + this._cell_size / 2, this._cell_size / 2, y);
            wall.Mesh.rotate(Axis.Y, Math.PI / 2);
            walls.push(wall);
        }

        if (cell.Back == MazeWall) {
            const wall = new Maze3DWall(
                this._wall_params, this._wall_material, this._wall_material_highlight); //MeshBuilder.CreateBox("wall", this._wall_params);
            wall.Mesh.position.set(x, this._cell_size / 2, y - this._cell_size / 2);
            wall.Mesh.rotate(Axis.Y, Math.PI);
            walls.push(wall);
        }

        if (cell.Left == MazeWall) {
            const wall = new Maze3DWall(
                this._wall_params, this._wall_material, this._wall_material_highlight); //MeshBuilder.CreateBox("wall", this._wall_params);
            wall.Mesh.position.set(x - this._cell_size / 2, this._cell_size / 2, y);
            wall.Mesh.rotate(Axis.Y, -Math.PI / 2);
            walls.push(wall);
        }
        return walls;
    }

    public GetWalls(position: Vector3): Array<Maze3DWall> | null {
        const cell = this._maze.GetCellXY(Math.round(position.x / this._cell_size), Math.round(position.z / this._cell_size));
        if (cell == null) return null;
        const walls = this._walls.get(cell);
        return walls == undefined ? null : walls;
    }

    public CreateMaze(): Mesh | null {

        const floor = MeshBuilder.CreateGround("floor", { width: this._maze.SizeX * (this._cell_size + 1), height: this._maze.SizeY * (this._cell_size + 1) })
        floor.material = this._wall_material;
        floor.position.set((this._maze.SizeX * this._cell_size) / 2, 0, (this._maze.SizeY * this._cell_size) / 2);
        let floor_material = new StandardMaterial("floor_mat", this._scene);
        floor_material.diffuseColor = new Color3(0.1, 0.1, 0.1);
        floor.material = floor_material;

        const iterator = this._maze.CellsItr();
        let itr_ptr = iterator.next();
        let cells: Array<Mesh> = [];
        while (itr_ptr.done == false) {
            const walls: Array<Maze3DWall> | null = this.CreateWalls(itr_ptr.value);
            if (walls != null) {
                this._walls.set(itr_ptr.value, walls);
            }
            itr_ptr = iterator.next();
        }
        return null;
    }
}