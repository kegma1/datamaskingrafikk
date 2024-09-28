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
        this.drawOnMove = true;
        this.head = new MeshInstance(generateCubeMesh(gl, w + 0.2), new ShaderInstance(shader), {fragmentColor: [1, 1, 1, 1]});
    }

    get headPos() {
        return this.head.position
    }

    moveHead(x, y, z) {  
        if(this.drawOnMove) {this.addCubeAtHead()}
        vec3.add(this.head.position, this.head.position, [x*this.w, y*this.w, z*this.w]);

        document.getElementById("pos-input-x").value = this.head.position[0]
        document.getElementById("pos-input-y").value = this.head.position[1]
        document.getElementById("pos-input-z").value = this.head.position[2]
    }

    addCubeAtHead() {
        let color;
        if (this.randomColor) {
            color = [Math.random(), Math.random(), Math.random(), 1];
        } else {
            color = [1, 0, 0, 1];
        }

        let newCube = new MeshInstance(this.cubeMesh, new ShaderInstance(this.shader), {fragmentColor: color});
        newCube.position = [...this.head.position];
        this.cubes.push(newCube);
    }

    draw(camera) {
        this.head.draw(camera)
        for(let cube of this.cubes) {
            cube.draw(camera)
        }
    }
}