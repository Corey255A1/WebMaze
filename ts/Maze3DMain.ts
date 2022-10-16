import { ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3 } from "babylonjs";
import { Maze } from "./Maze";
import { Maze3D } from "./Maze3D";

export class Maze3DMain{
    private _maze:Maze | null;
    private _maze_renderer:Maze3D | null;
    private _scene:Scene;
    private _engine:Engine;
    private _canvas:HTMLCanvasElement;
    constructor(canvas_id:string){
        this._canvas = document.getElementById(canvas_id) as HTMLCanvasElement;
        if(this._canvas == null){ throw "Could not find canvas"; }


        this._engine = new Engine(this._canvas, true);
        this._scene = new Scene(this._engine);
        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), this._scene);
        camera.attachControl(this._canvas, true);
        //var sanitycheck = MeshBuilder.CreateBox('box1',{size:2});
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this._scene);
        this._maze = null;
        this._maze_renderer = null;

        // run the main render loop
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
    }

    public Generate(size:number):Maze{
        this._maze = Maze.Generate(0,0,50,50);
        this._maze_renderer = new Maze3D(this._scene, this._maze);
        this._maze_renderer.CreateMaze();
        return this._maze;

    }
}