import { ArcRotateCamera, DirectionalLight, Engine, FollowCamera, HemisphericLight, KeyboardEventTypes, KeyboardInfo, Mesh, MeshBuilder, RuntimeError, Scene, UniversalCamera, Vector3, WebXRState } from "babylonjs";
import { Maze } from "./Maze";
import { Maze3D } from "./Maze3D";
import { Maze3DPlayer } from "./Maze3DPlayer";

export class Maze3DMain{
    private _maze:Maze | null;
    private _maze_renderer:Maze3D | null;
    private _maze_mesh:Mesh|null;
    private _scene:Scene;
    private _engine:Engine;
    private _canvas:HTMLCanvasElement;
    private _camera:UniversalCamera;
    //private _camera:ArcRotateCamera;
    //private _camera:FollowCamera;
    private _player:Maze3DPlayer;
    constructor(canvas_id:string){
        this._canvas = document.getElementById(canvas_id) as HTMLCanvasElement;
        if(this._canvas == null){ throw "Could not find canvas"; }


        this._engine = new Engine(this._canvas, true);
        this._scene = new Scene(this._engine);
        this._maze = Maze.Generate(0,0,20,20);
        
        window.addEventListener('resize',()=>{this._engine.resize();})


        //var sanitycheck = MeshBuilder.CreateBox('box1',{size:2});
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this._scene);
 
        this._maze_renderer = new Maze3D(this._scene, this._maze, 10);
        this._maze_mesh = this._maze_renderer.CreateMaze();
        this._player = new Maze3DPlayer(this._maze_renderer);
        this._scene.onKeyboardObservable.add(this.ProcessKeyboard.bind(this));
        this._scene.onBeforeRenderObservable.add(this._player.Update.bind(this._player));
        //Follow Camera
        /*
        this._camera = new FollowCamera("Camera", this._player.Mesh.position);
        this._camera.heightOffset = 15;
        this._camera.speed = 0.5;
        this._camera.radius = 5;
        this._camera.rotationOffset = 90;
        this._camera.attachControl(true);
        this._camera.lockedTarget = this._player.Mesh;
        */
        //Arc Rotate
        /*
        this._camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 10, this._player.Mesh.position, this._scene);
        this._camera.attachControl(this._canvas, true);
        //this._camera.lowerRadiusLimit = 2;
        //this._camera.upperRadiusLimit = 2;
        */
        this._camera = new UniversalCamera("first_person", this._player.Mesh.position, this._scene);

        
        // Attach the camera to the canvas
        
        //this._camera.applyGravity = true;
        //this._camera.ellipsoid = new Vector3(1.2, 1, 1.2);
        // this._camera.position.y = 5;
        // this._camera.position.x = 5;
        // this._camera.position.z = 5;
        //this._camera.checkCollisions = true;
        //this._camera.attachControl(this._canvas, true);
        //if(this._maze_mesh == null){ throw "Error Creating Maze"; }
        //this._maze_mesh.checkCollisions = true;

        // run the main render loop
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
        this.InitializeVR();
    }

    
    //Generalize the inputs
    public ProcessKeyboard(keyboard_info:KeyboardInfo){
        const keydown:boolean = keyboard_info.type == KeyboardEventTypes.KEYDOWN;
        switch(keyboard_info.event.key.toLowerCase()){
            case "w":this._player.Input.SetDigital("up", keydown); break;
            case "d":this._player.Input.SetDigital("right", keydown); break;
            case "s":this._player.Input.SetDigital("down", keydown); break;
            case "a":this._player.Input.SetDigital("left", keydown); break;
        }
    }

    private async InitializeVR(){
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