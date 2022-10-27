import { Axis, EventState, KeyboardEventTypes, KeyboardInfo, Mesh, MeshBuilder, Scene, Vector3 } from "babylonjs";
import { Maze3D } from "./Maze3D";

export class Maze3DPlayer{
    private _mesh:Mesh;
    private _speed:number;
    private _input_direction:Vector3;
    private _velocity:Vector3;
    private _maze:Maze3D;

    constructor(maze:Maze3D){
        this._mesh = MeshBuilder.CreateSphere('player',{diameter:1});
        this._mesh.position.y = 2;
        this._speed = 0.4;
        this._velocity = new Vector3(0,0,0);
        this._input_direction = new Vector3(0,0,0);
        this._maze = maze;
    }

    public get Mesh():Mesh{
        return this._mesh;
    }

    //Generalize the inputs
    public ProcessKeyboard(keyboard_info:KeyboardInfo){
        switch(keyboard_info.type){
            case KeyboardEventTypes.KEYDOWN:{
                switch(keyboard_info.event.key.toLowerCase()){
                    case "w":this._input_direction.x = this._speed; break;
                    case "d":this._input_direction.z = -this._speed; break;
                    case "s":this._input_direction.x = -this._speed; break;
                    case "a":this._input_direction.z = this._speed; break;
                }
            } break;
            case KeyboardEventTypes.KEYUP:{
                switch(keyboard_info.event.key.toLowerCase()){
                    case "w":this._input_direction.x = 0; break;
                    case "d":this._input_direction.z = 0; break;
                    case "s":this._input_direction.x = 0; break;
                    case "a":this._input_direction.z = 0; break;
                }
            } break;
        }
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