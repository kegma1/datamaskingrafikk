import {WebGLCanvas, Camera, Shader, MeshInstance, ShaderInstance, Scene,Mesh} from "./helpers.js";
import { generateGridMesh} from "./shapes.js"
import { CubeManager } from "./cubeManager.js";

import "../gl-matrix.js";


const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 800, 800);

let vertexShaderSource = document.getElementById('base-vertex-shader').innerHTML;
let fragmentShaderSource = document.getElementById('base-fragment-shader').innerHTML;

let vertexShaderSourcePoint = document.getElementById('base-vertex-shader-point').innerHTML;
let fragmentShaderSourcePoint = document.getElementById('base-fragment-shader-point').innerHTML;

let fpsDisplay = document.getElementById("FPSdisplay")
const gl = webGLCanvas.gl;


const keys = {};
const w = 2;
const grid_mesh = generateGridMesh(gl, w, 50);
export let pointLight = [5, 5, 5];
export let ambientColor = [0.2, 0.2, 0.2]

let pointMesh = new Mesh(gl, [0, 0, 0], 3, null, gl.POINTS)

const shaders = {
    basic: new Shader(gl, vertexShaderSource, fragmentShaderSource, {
        vertexPosition: {name: "aVertexPosition", size: 3, stride: 10 * Float32Array.BYTES_PER_ELEMENT, offset: 0},
        vertexNormala: {name: "aVertexNormal", size: 3, stride: 10 * Float32Array.BYTES_PER_ELEMENT, offset: 3 * Float32Array.BYTES_PER_ELEMENT},
        vertexColor: {name: "aVertexColor", size: 4, stride: 10 * Float32Array.BYTES_PER_ELEMENT, offset: 6 * Float32Array.BYTES_PER_ELEMENT},
    }, {
        fragmentColor: {name: "uFragColor", type: "vec4"},
        projectionMatrix: {name: "uProjectionMatrix", type: "mat4"},
        modelViewMatrix: {name: "uModelViewMatrix", type: "mat4"},
        modelMatrix: {name: "uModelMatrix", type: "mat4"},
        normalMatrix: {name: "uNormalMatrix", type: "mat4"},

        lightPosition: {name: "uLightPosition", type: "vec3"},
        ambientLightColor: {name: "uAmbientLightColor", type: "vec3"},
        diffuseLightColor: {name: "uDiffuseLightColor", type: "vec3"},
    }),

    point: new Shader(gl, vertexShaderSourcePoint, fragmentShaderSourcePoint, {
        vertexPosition: {name: "aVertexPosition"},
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

document.getElementById("drawWithMove").addEventListener("change", function() {
    cube_manager.drawOnMove = this.checked;
});

document.getElementById("randomColors").addEventListener("change", function() {
    cube_manager.randomColor = this.checked;
});

document.getElementById("pos-input-x").addEventListener("change", function() {
    cube_manager.headPos[0] = this.value * w
})
document.getElementById("pos-input-y").addEventListener("change", function() {
    cube_manager.headPos[1] = this.value * w
})
document.getElementById("pos-input-z").addEventListener("change", function() {
    cube_manager.headPos[2] = this.value * w
})

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
        g: new MeshInstance(grid_mesh, new ShaderInstance(shaders.basic), {
            diffuseLightColor: [0, 0, 0], 
            lightPosition: pointLight, 
            ambientLightColor: ambientColor
        }),
        cm: cube_manager,
        light: new MeshInstance(pointMesh, new ShaderInstance(shaders.point), {
            fragmentColor: [1, 0, 0, 1],
        })
    });

    mainScene.setup = (o) => {
        o.g.position[1] -= w/2
        o.light.position = pointLight
    };

    mainScene.update = (cam, o, time, dt) => {
        fpsDisplay.innerHTML = `FPS: ${Math.round(1 / dt)}`
        handelInput(cam, dt)
    };

    mainScene.start();
}

function handelInput(cam, dt) {
    const rotSpeed = 2.0;  
    const rotY = mat4.create();
    
    if (keys['ArrowLeft']) {
        mat4.rotateY(rotY, mat4.create(), -rotSpeed * dt);
        vec3.transformMat4(cam.pos, cam.pos, rotY);
    }
    if (keys['ArrowRight']) {
        mat4.rotateY(rotY, mat4.create(), rotSpeed * dt);
        vec3.transformMat4(cam.pos, cam.pos, rotY);
    }
    if (keys['ArrowUp']) {
        vec3.scale(cam.pos, cam.pos, 0.95)
    }
    if (keys['ArrowDown']) {
        vec3.scale(cam.pos, cam.pos, 1.05)
    }

    if (keys["KeyW"]) {cube_manager.moveHead(0, 0, -1); keys["KeyW"] = false}
    if (keys["KeyS"]) {cube_manager.moveHead(0, 0, 1); keys["KeyS"] = false}
    if (keys["KeyA"]) {cube_manager.moveHead(-1, 0, 0); keys["KeyA"] = false}
    if (keys["KeyD"]) {cube_manager.moveHead(1, 0, 0); keys["KeyD"] = false}
    if (keys["KeyE"]) {cube_manager.moveHead(0, 1, 0); keys["KeyE"] = false}
    if (keys["KeyQ"]) {cube_manager.moveHead(0, -1, 0); keys["KeyQ"] = false}

    if (keys["Space"]) {
        cube_manager.drawOnMove = !cube_manager.drawOnMove; 
        document.getElementById("drawWithMove").checked  = cube_manager.drawOnMove;
        keys["Space"] = false;
    }
        

    cam.update_view()
}

