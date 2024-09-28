import {WebGLCanvas, Camera, Shader, MeshInstance, ShaderInstance, Scene} from "./helpers.js";
import { generateGridMesh} from "./shapes.js"
import { CubeManager } from "./cubeManager.js";

import "../gl-matrix.js";


const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 600, 600);

let vertexShaderSource = document.getElementById('base-vertex-shader').innerHTML;
let fragmentShaderSource = document.getElementById('base-fragment-shader').innerHTML;

const gl = webGLCanvas.gl;


const keys = {};
const w = 2;
const grid_mesh = generateGridMesh(gl, w, 50);

const shaders = {
    basic: new Shader(gl, vertexShaderSource, fragmentShaderSource, {
        vertexPosition: {name: "aVertexPosition", size: 3, stride: 7 * Float32Array.BYTES_PER_ELEMENT, offset: 0},
        vertexColor: {name: "aVertexColor", size: 4, stride: 7 * Float32Array.BYTES_PER_ELEMENT, offset: 3 * Float32Array.BYTES_PER_ELEMENT},
    }, {
        fragmentColor: {name: "uFragColor", type: "vec4"},
        projectionMatrix: {name: "uProjectionMatrix", type: "mat4"},
        modelViewMatrix: {name: "uModelViewMatrix", type: "mat4"},
    }),
}

// Add event listeners for keydown and keyup
window.addEventListener('keydown', (event) => {
    keys[event.code] = true; // Set key as pressed
});

window.addEventListener('keyup', (event) => {
    keys[event.code] = false; // Set key as released
});

export const cube_manager =  new CubeManager(gl, w, shaders.basic);
window.cube_manager = cube_manager;

export function main() {
    let camera = new Camera(
        vec3.fromValues( 0, 10, 20),
        vec3.fromValues(0, 0, 0),
        45,
        gl.canvas.clientWidth / gl.canvas.clientHeight,
        0.1,
        1000.0
    );

    

    let mainScene = new Scene(gl, camera, {
        g: new MeshInstance(grid_mesh, new ShaderInstance(shaders.basic), {fragmentColor: [0, 0, 0, 1]}),
        cm: cube_manager,
    });

    mainScene.setup = (o) => {
        o.g.position[1] -= w/2
    };

    mainScene.update = (cam, o, time, dt) => {
        handelInput(cam, dt)
    };

    mainScene.start();
}

function handelInput(cam, dt) {
    const rotSpeed = 2.0;  
    const rotY = mat4.create();
    
    if (keys['KeyA']) {
        mat4.rotateY(rotY, mat4.create(), -rotSpeed * dt);
        vec3.transformMat4(cam.pos, cam.pos, rotY);
    }
    if (keys['KeyD']) {
        mat4.rotateY(rotY, mat4.create(), rotSpeed * dt);
        vec3.transformMat4(cam.pos, cam.pos, rotY);
    }

    if (keys['KeyW']) {
        vec3.scale(cam.pos, cam.pos, 0.95)
    }
    if (keys['KeyS']) {
        vec3.scale(cam.pos, cam.pos, 1.05)
    }

    cam.update_view()
}

