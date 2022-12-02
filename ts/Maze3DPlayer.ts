import { Axis, EventState, KeyboardEventTypes, KeyboardInfo, Mesh, MeshBuilder, Quaternion, Ray, Scene, UniversalCamera, Vector3 } from "babylonjs";
import { Maze3D } from "./Maze3D";
import { Sensor } from "./Sensor";

export class Maze3DPlayer {
    private _mesh: Mesh;
    private _velocity: Vector3;
    private _move: Vector3;
    private _rotate: Vector3;
    private _speed: number;
    private _rotation_speed: number
    private _sensors: Array<Sensor>;

    constructor(maze: Maze3D) {
        this._speed = 0.2;
        this._rotation_speed = 0.05;
        this._mesh = MeshBuilder.CreateBox('player', { size: 1 })//MeshBuilder.CreateSphere('player',{diameter:1});
        this._mesh.position.y = 2;
        this._rotate = new Vector3(0, 0, 0);
        this._move = new Vector3(0, 0, 0);
        this._velocity = new Vector3(0, 0, 0);
        this._sensors = [
            //Front
            new Sensor(this._mesh, new Vector3(0, 0, 0), new Vector3(0, 0, 1), 6),

            //Right
            new Sensor(this._mesh, new Vector3(-0.5, 0, 0.5), new Vector3(1, 0, 0), 6),
            new Sensor(this._mesh, new Vector3(-0.5, 0, -0.5), new Vector3(1, 0, 0), 6),

            //Left
            new Sensor(this._mesh, new Vector3(0.5, 0, 0.5), new Vector3(-1, 0, 0), 6),
            new Sensor(this._mesh, new Vector3(0.5, 0, -0.5), new Vector3(-1, 0, 0), 6),
        ];
    }
    public get Sensors(): Array<Sensor> { return this._sensors; }
    public get Position(): Vector3 { return this._mesh.position; }
    public get Velocity(): Vector3 { return this._velocity; }
    public set Velocity(value: Vector3) { this._velocity.copyFrom(value); }
    public get Mesh(): Mesh {
        return this._mesh;
    }

    public MoveForward(move: boolean) {
        this._move.x = move ? 1 : 0;
    }
    public MoveBackward(move: boolean) {
        this._move.x = move ? -1 : 0;
    }
    public MoveRight(move: boolean) {
        this._move.z = move ? 1 : 0;
    }
    public MoveLeft(move: boolean) {
        this._move.z = move ? -1 : 0;
    }
    public TurnRight(move: boolean) {
        this._rotate.y = move ? 1 : 0;
    }
    public TurnLeft(move: boolean) {
        this._rotate.y = move ? -1 : 0;
    }


    private UpdateRelativeMovement() {
        this._velocity.setAll(0);
        if (this._move.x != 0) {
            this._velocity.addInPlace(this._mesh.forward.scale(this._move.x));
        }
        if (this._move.y != 0) {
            this._velocity.addInPlace(this._mesh.up.scale(this._move.y));
        }
        if (this._move.z != 0) {
            this._velocity.addInPlace(this._mesh.right.scale(this._move.z));
        }
        this._velocity.normalize().scaleInPlace(this._speed);
        //console.log(this._velocity);
    }

    private ApplyRotations() {
        //Yaw
        if (this._rotate.y != 0) {
            this._mesh.rotate(this._mesh.up, this._rotation_speed * this._rotate.y, BABYLON.Space.LOCAL);
        }
        //Pitch
        if (this._rotate.z != 0) {
            this._mesh.rotate(this._mesh.right, this._rotation_speed * this._rotate.z, BABYLON.Space.LOCAL);
        }
        //Roll
        if (this._rotate.x != 0) {
            this._mesh.rotate(this._mesh.forward, this._rotation_speed * this._rotate.x, BABYLON.Space.LOCAL);
        }
    }

    public CalculateNextPosition(): Vector3 {
        this.UpdateRelativeMovement();
        return this._mesh.position.add(this._velocity);
    }

    public Update(scene: Scene) {
        this.ApplyRotations();
        //Move our mesh
        this._mesh.position.addInPlace(this._velocity);
        this._sensors.forEach(sensor => sensor.Update(scene));

    }
}
