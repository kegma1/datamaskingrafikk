import { MeshInstance, ShaderInstance } from "./helpers.js";
import { generateCubeMesh } from "./shapes.js";

export class CubeManager {
    constructor(gl, w, shader) {
        this.gl = gl;
        this.w = w;
        this.shader = shader
        this.randomColor = true;
        this.cubes = [];
        this.cubeMesh = generateCubeMesh(gl, w);
        this.head = new MeshInstance(generateCubeMesh(gl, w + 0.2), new ShaderInstance(shader), {fragmentColor: [1, 1, 1, 1]});
    }

    moveHead(x, y, z) {
        vec3.add(this.head.position, this.head.position, [x*this.w, y*this.w, z*this.w]);
    }

    addCubeAtHead() {
        if (this.randomColor) {
            let newCube = new MeshInstance(this.cubeMesh, new ShaderInstance(this.shader), {fragmentColor: [Math.random(), Math.random(), Math.random(), 1]});
            newCube.position = [...this.head.position];
            this.cubes.push(newCube);
        }
    }

    draw(camera) {
        this.head.draw(camera)
        for(let cube of this.cubes) {
            cube.draw(camera)
        }
    }
}