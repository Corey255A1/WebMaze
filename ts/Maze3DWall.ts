//Corey Wunderlich 2022
//https://www.wundervisionenvisionthefuture.com/

import { Mesh, Material, MeshBuilder } from "@babylonjs/core";

export class Maze3DWall {
    private _mesh: Mesh;
    private _normal_material: Material;
    private _highlight_material: Material;
    constructor(wall_params: any, normal_material: Material, highlight_material: Material) {
        this._normal_material = normal_material;
        this._highlight_material = highlight_material;
        this._mesh = MeshBuilder.CreateBox("wall", wall_params);
        this._mesh.material = this._normal_material;
    }
    public get Mesh(): Mesh {
        return this._mesh;
    }

    public Highlight(enable: boolean) {
        if (enable) {
            this._mesh.material = this._highlight_material;
        } else {
            this._mesh.material = this._normal_material;
        }
    }
}