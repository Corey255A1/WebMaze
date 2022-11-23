import { Axis, EventState, KeyboardEventTypes, KeyboardInfo, Mesh, MeshBuilder, Quaternion, Ray, Scene, UniversalCamera, Vector3 } from "babylonjs";
import { Maze3D } from "./Maze3D";

export class Maze3DPlayer {
    private _mesh:Mesh;
    private _velocity:Vector3;
    private _move:Vector3;
    private _rotate:Vector3;
    private _maze:Maze3D;
    private _speed:number;

    constructor(maze:Maze3D){
        this._speed = 0.4;
        this._mesh = MeshBuilder.CreateBox('player',{size:1})//MeshBuilder.CreateSphere('player',{diameter:1});
        this._mesh.position.y = 2;
        this._rotate = new Vector3(0,0,0);
        this._move = new Vector3(0,0,0);
        this._velocity = new Vector3(0,0,0);
        this._maze = maze;
    }

    public get Mesh():Mesh{
        return this._mesh;
    }

    public MoveForward(move:boolean){
        this._move.x = move ? 1 : 0;
    }
    public MoveBackward(move:boolean){
        this._move.x = move ? -1 : 0;
    }
    public MoveRight(move:boolean){
        this._move.z = move ? 1 : 0;
    }
    public MoveLeft(move:boolean){
        this._move.z = move ? -1 : 0;
    }
    public TurnRight(move:boolean){
        this._rotate.y = move ? 1 : 0;
    }
    public TurnLeft(move:boolean){
        this._rotate.y = move ? -1 : 0;
    }


    private ApplyMove(){
        this._velocity.setAll(0);
        if(this._move.x != 0){
            this._velocity.addInPlace(this._mesh.forward.scale(this._move.x));
        }
        if(this._move.y != 0){
            this._velocity.addInPlace(this._mesh.up.scale(this._move.y));
        }
        if(this._move.z != 0){
            this._velocity.addInPlace(this._mesh.right.scale(this._move.z));
        }
        this._velocity.normalize().scale(this._speed);
        //console.log(this._velocity);
    }

    private ApplyRotations(){
        //Yaw
        if(this._rotate.y != 0){
            this._mesh.rotate(this._mesh.up, 0.1 * this._rotate.y, BABYLON.Space.WORLD);
        }
        //Pitch
        if(this._rotate.z != 0){
            this._mesh.rotate(this._mesh.right, 0.1 * this._rotate.z, BABYLON.Space.WORLD);
        }
        //Roll
        if(this._rotate.x != 0){
            this._mesh.rotate(this._mesh.forward, 0.1 * this._rotate.x, BABYLON.Space.WORLD);
        }
    }



    public Update(scene:Scene, event:EventState){
        this.ApplyRotations();
        this.ApplyMove();
        
        
        //Check that we aren't moving into something
        let ray = new Ray(this._mesh.position,this._velocity, 3);
        const mesh = scene.pickWithRay(ray,(m)=>m!=this._mesh);
        if(mesh != null && mesh.pickedMesh != null){
            return; // don't move
        }

        //Check that we havent somehow wound up in a wall
        const next = this._mesh.position.add(this._velocity);
        const walls = this._maze.GetWalls(next);
        if(walls != null){
            const wall = walls.find(wall=>wall.intersectsPoint(next));
            if(wall != undefined){
                return; //don't move
            }
        }

        //Move our mesh
        this._mesh.position.copyFrom(next);
    }

}