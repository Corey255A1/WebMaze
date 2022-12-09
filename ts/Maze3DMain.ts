//Corey Wunderlich 2022
//https://www.wundervisionenvisionthefuture.com/
import { Maze } from "./Maze";
import { Maze3D } from "./Maze3D";
import { Maze3DPlayer } from "./Maze3DPlayer";
import { Mesh, Scene, Engine, 
    Camera, HemisphericLight, Vector3, AssetsManager,
    ArcRotateCamera, KeyboardInfo, KeyboardEventTypes, 
    EventState, WebXRState, MeshBuilder } from "@babylonjs/core";

import "@babylonjs/loaders";

export class Maze3DMain {
    private _maze: Maze | null;
    private _maze_renderer: Maze3D | null;
    private _maze_mesh: Mesh | null;
    private _scene: Scene;
    private _engine: Engine;
    private _canvas: HTMLCanvasElement;
    //private _camera:UniversalCamera;
    private _camera: Camera | null;
    //private _camera:FollowCamera;
    private _player: Maze3DPlayer | null;
    constructor(canvas_id: string) {

        this._canvas = document.getElementById(canvas_id) as HTMLCanvasElement;
        if (this._canvas == null) { throw "Could not find canvas"; }


        this._engine = new Engine(this._canvas, true);
        this._scene = new Scene(this._engine);
        this._maze = Maze.Generate(0, 0, 20, 20);

        window.addEventListener('resize', () => { this._engine.resize(); })


        //var sanitycheck = MeshBuilder.CreateBox('box1',{size:2});
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this._scene);

        this._maze_renderer = new Maze3D(this._scene, this._maze, 10);
        this._maze_mesh = this._maze_renderer.CreateMaze();
        this._player = null;
        this._camera = null;
        const assets_Manager = new AssetsManager(this._scene);
        const mesh_task = assets_Manager.addMeshTask("tank task", "", "/models/", "TankBot.glb");
        mesh_task.onSuccess = (task) => {
            task.loadedMeshes.forEach(mesh=>{
                console.log(mesh);
            });

            this._player = new Maze3DPlayer(task.loadedMeshes[0] as Mesh);
            this._scene.onKeyboardObservable.add(this.ProcessKeyboard.bind(this));
            this._scene.onBeforeRenderObservable.add(this.Update.bind(this));
            const camera = new ArcRotateCamera("Camera", 0,0, 35, Vector3.Zero(), this._scene);
            camera.setTarget(this._player.Mesh);
            camera.attachControl(this._canvas, true);
            camera.lowerRadiusLimit = 10;
            camera.upperRadiusLimit = 40;
            this._camera = camera;

        }



        assets_Manager.onFinish = (tasks) => {
            // run the main render loop
            this._engine.runRenderLoop(() => {
                this._scene.render();
            });
            this.InitializeVR();
        }

        assets_Manager.load();

    }


    //Generalize the inputs
    public ProcessKeyboard(keyboard_info: KeyboardInfo) {
        if (this._player == null) { return; }
        const keydown: boolean = keyboard_info.type == KeyboardEventTypes.KEYDOWN;
        switch (keyboard_info.event.key.toLowerCase()) {
            case "w": this._player.Move(keydown ? 1 : 0); break;
            case "d": this._player.Slide(keydown ? 1 : 0); break;
            case "s": this._player.Move(keydown ? -1 : 0); break;
            case "a": this._player.Slide(keydown ? -1 : 0); break;
            case "i": this._player.Turn(keydown ? -1 : 0); break;
            case "p": this._player.Turn(keydown ? 1 : 0); break;
        }
    }



    private Update(scene: Scene, event: EventState) {
        if (this._maze_renderer == null || this._player == null) { return; }

        const next = this._player.CalculateNextPosition();
        const senors = this._player.Sensors;
    
        //Basic Right-Hand Rule Wall
        if (senors[1].Distance > 5) {
            this._player.Turn(1);
        }
        else if (senors[1].Distance >= senors[2].Distance - 0.5 || senors[1].Distance <= senors[2].Distance + 0.5) {
            this._player.Turn(1);
        }
        if (senors[0].Distance > 5) {

            if (senors[1].Distance < 4) {
                this._player.Turn(-1);
            } else if (senors[3].Distance < 4) {
                this._player.Turn(1);
            }

            this._player.Move(1);

        } else {
            this._player.Turn(-1);
            this._player.Move(0);
        }
        const walls = this._maze_renderer.GetWalls(this._player.Position);
        if (walls != null) {
            walls.forEach(wall => wall.Highlight(true));
        }
        //let ray = new Ray(this._player.Position,this._player.Velocity, 1.5);
        //const mesh = scene.pickWithRay(ray,(m)=>m!=this._player.Mesh);
        // if(mesh != null && mesh.pickedMesh != null){
        //     this._player.Velocity = Vector3.Zero();
        // }
        this._player.Update(scene);

    }

    private async InitializeVR() {
        try {
            var defaultXRExperience = await this._scene.createDefaultXRExperienceAsync();
            defaultXRExperience.baseExperience.onStateChangedObservable.add((state) => {
                switch (state) {
                    case WebXRState.IN_XR:
                        defaultXRExperience.baseExperience.camera.position = Vector3.Zero();
                        break;
                    // XR is initialized and already submitted one frame
                    case WebXRState.ENTERING_XR:

                        break;
                    // xr is being initialized, enter XR request was made
                    case WebXRState.EXITING_XR: break;
                    // xr exit request was made. not yet done.
                    case WebXRState.NOT_IN_XR: break;
                    // self explanatory - either out or not yet in XR
                }
            })
        } catch (e) {
            console.log(e);
        }
    }
}