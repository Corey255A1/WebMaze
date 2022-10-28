import { Axis, EventState, KeyboardEventTypes, KeyboardInfo, Mesh, MeshBuilder, Scene, Vector3 } from "babylonjs";
import { Maze3D } from "./Maze3D";
import { PlayerInputs } from "./PlayerInputs";

export class Maze3DPlayer{
    private _mesh:Mesh;
    private _speed:number;
    private _input_direction:Vector3;
    private _velocity:Vector3;
    private _maze:Maze3D;
    private _inputs:PlayerInputs;

    constructor(maze:Maze3D){
        this._mesh = MeshBuilder.CreateSphere('player',{diameter:1});
        this._mesh.position.y = 2;
        this._speed = 0.4;
        this._velocity = new Vector3(0,0,0);
        this._input_direction = new Vector3(0,0,0);
        this._maze = maze;
        this._inputs = new PlayerInputs();
        this._inputs.AddDigital("up", false);
        this._inputs.AddDigital("down", false);
        this._inputs.AddDigital("left", false);
        this._inputs.AddDigital("right", false);
        this._inputs.SetDigitalChangeCallback(this.DigitalInputChanged.bind(this));
    }
    
    private DigitalInputChanged(name:string, value:boolean){
        switch(name){
            case "up": this._input_direction.x = (value ? 1 : 0); break;
            case "down":  this._input_direction.x = (value ? -1 : 0); break;
            case "left":  this._input_direction.z = (value ? 1 : 0); break;
            case "right":this._input_direction.z = (value ? -1 : 0); break;
        }
    }

    public get Input():PlayerInputs{
        return this._inputs;
    }


    public get Mesh():Mesh{
        return this._mesh;
    }


    public Update(scene:Scene, event:EventState){
        
        if(scene.activeCamera != null){
            const forward_vector = this._mesh.position.subtract(scene.activeCamera.position);
            forward_vector.y = 0;
            const side_vector = forward_vector.cross(Axis.Y);
            forward_vector.scaleInPlace(this._input_direction.x);
            side_vector.scaleInPlace(this._input_direction.z);
            
            this._velocity = forward_vector.add(side_vector);
            this._velocity.normalize().scaleInPlace(this._speed);
        }
        
        const next = this._mesh.position.add(this._velocity);
        const walls = this._maze.GetWalls(next);
        if(walls != null){
            const wall = walls.find(wall=>wall.intersectsPoint(next));
            if(wall != undefined){ return; }
        }
        this._mesh.position.addInPlace(this._velocity);
    }

}