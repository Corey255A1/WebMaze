import { ArcRotateCamera, Engine, HemisphericLight, Mesh, MeshBuilder, RuntimeError, Scene, UniversalCamera, Vector3 } from "babylonjs";
import { Maze } from "./Maze";
import { Maze3D } from "./Maze3D";

export class Maze3DMain{
    private _maze:Maze | null;
    private _maze_renderer:Maze3D | null;
    private _maze_mesh:Mesh|null;
    private _scene:Scene;
    private _engine:Engine;
    private _canvas:HTMLCanvasElement;
    private _camera:UniversalCamera;

    constructor(canvas_id:string){
        this._canvas = document.getElementById(canvas_id) as HTMLCanvasElement;
        if(this._canvas == null){ throw "Could not find canvas"; }


        this._engine = new Engine(this._canvas, true);
        this._scene = new Scene(this._engine);
        //var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), this._scene);
        //camera.attachControl(this._canvas, true);
        this._camera = new UniversalCamera("UniversalCamera", new Vector3(0, 10, 0), this._scene); 

        // Attach the camera to the canvas
        this._camera.speed = 0.5;
        this._camera.applyGravity = true;
        this._camera.ellipsoid = new Vector3(1.2, 1, 1.2);
        // this._camera.position.y = 5;
        // this._camera.position.x = 5;
        // this._camera.position.z = 5;
        this._camera.checkCollisions = true;
        this._camera.attachControl(this._canvas, true);


        //var sanitycheck = MeshBuilder.CreateBox('box1',{size:2});
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this._scene);
        this._maze = Maze.Generate(0,0,20,20);
        this._maze_renderer = new Maze3D(this._scene, this._maze, 10);
        this._maze_mesh = this._maze_renderer.CreateMaze();
        //if(this._maze_mesh == null){ throw "Error Creating Maze"; }
        //this._maze_mesh.checkCollisions = true;

        // run the main render loop
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
    }
}