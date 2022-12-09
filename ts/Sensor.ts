//Corey Wunderlich 2022
//https://www.wundervisionenvisionthefuture.com/

import { Ray, Mesh, Vector3, PickingInfo, AbstractMesh, Scene, Quaternion, RayHelper } from "@babylonjs/core";

export class Sensor {
    private _ray: Ray;
    private _mesh: Mesh;
    private _offset: Vector3;
    private _relative_direction: Vector3;
    private _last_picked: PickingInfo | null;
    constructor(mesh: Mesh, offset: Vector3, relative_direction: Vector3, max_range: number) {
        this._mesh = mesh;
        this._offset = offset;
        this._relative_direction = relative_direction;
        this._last_picked = null;
        this._ray = new Ray(mesh.position.add(offset), relative_direction, max_range);

        const ray_helper = new RayHelper(this._ray);
        ray_helper.show(this._mesh.getScene());
    }
    public get Distance(): number {
        if (this._last_picked != null && this._last_picked.hit) { return this._last_picked.distance; }
        else return this._ray.length;
    }
    private FilterMesh(mesh: AbstractMesh): boolean {
        return mesh.name != 'ray' && this._mesh != mesh;
    }
    public Update(scene: Scene) {
        this._ray.direction = Vector3.TransformNormal(this._relative_direction, this._mesh.getWorldMatrix());//this._relative_direction.applyRotationQuaternion(Quaternion.RotationQuaternionFromAxis(this._mesh.right, this._mesh.up, this._mesh.forward));
        this._ray.origin = Vector3.TransformCoordinates(this._offset, this._mesh.getWorldMatrix());
        this._last_picked = scene.pickWithRay(this._ray, this.FilterMesh.bind(this));
    }
}