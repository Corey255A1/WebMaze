//Corey Wunderlich 2022
//https://www.wundervisionenvisionthefuture.com/
import { Mesh, Vector3, Scene, Space } from "@babylonjs/core";
import { Sensor } from "./Sensor";

export class Maze3DPlayer {
    private _mesh: Mesh;
    private _velocity: Vector3;
    private _move: Vector3;
    private _rotate: Vector3;
    private _speed: number;
    private _rotation_speed: number
    private _sensors: Array<Sensor>;
    private _sensor_length: number;
    private _running_goal: boolean;
    private _goal_value: number;

    constructor(mesh:Mesh) {
        this._speed = 0.3;
        this._rotation_speed = 0.1;
        this._sensor_length = 6;
        this._mesh = mesh;
        //this._mesh = MeshBuilder.CreateBox('player', { size: 1 })//MeshBuilder.CreateSphere('player',{diameter:1});
        //this._mesh.position.y = 2;
        this._rotate = new Vector3(0, 0, 0);
        this._move = new Vector3(0, 0, 0);
        this._velocity = new Vector3(0, 0, 0);
        // Room for improvement... goal manager;
        this._running_goal = false;
        this._goal_value = 0;

        this._sensors = [
            //Front
            new Sensor(this._mesh, new Vector3(0, 0, 2), new Vector3(0, 0, 1), this._sensor_length),

            //Right
            new Sensor(this._mesh, new Vector3(-1.5, 0, 2), new Vector3(1, 0, 0), this._sensor_length),
            new Sensor(this._mesh, new Vector3(-1.5, 0, -2), new Vector3(1, 0, 0), this._sensor_length),

            //Left
            new Sensor(this._mesh, new Vector3(1.5, 0, 2), new Vector3(-1, 0, 0), this._sensor_length),
            new Sensor(this._mesh, new Vector3(1.5, 0, -2), new Vector3(-1, 0, 0), this._sensor_length),
        ];
    }
    public get Sensors(): Array<Sensor> { return this._sensors; }
    public get Position(): Vector3 { return this._mesh.position; }
    public get Velocity(): Vector3 { return this._velocity; }
    public set Velocity(value: Vector3) { this._velocity.copyFrom(value); }
    public get Mesh(): Mesh {
        return this._mesh;
    }

    public Move(move: number) {
        this._move.x = move > 0 ? 1 : move == 0 ? 0 : -1;
    }
    public Slide(move: number) {
        this._move.z = move > 0 ? 1 : move == 0 ? 0 : -1;
    }
    public Turn(move: number) {
        this._rotate.y = move > 0 ? 1 : move == 0 ? 0 : -1;
    }
    public GoalTurn(radians: number) {
        this._running_goal = true;
        this._goal_value = radians;
        this.Turn(radians);
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
    }

    private ApplyRotations() {
        //Yaw
        if (this._rotate.y != 0) {
            this._mesh.rotate(this._mesh.up, this._rotation_speed * this._rotate.y, Space.LOCAL);
            if (this._running_goal) {
                this._goal_value -= this._rotation_speed;
            }
        }
        //Pitch
        if (this._rotate.z != 0) {
            this._mesh.rotate(this._mesh.right, this._rotation_speed * this._rotate.z, Space.LOCAL);
        }
        //Roll
        if (this._rotate.x != 0) {
            this._mesh.rotate(this._mesh.forward, this._rotation_speed * this._rotate.x, Space.LOCAL);
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

        this._mesh.computeWorldMatrix(true);
        this._sensors.forEach(sensor => sensor.Update(scene));

    }
}
