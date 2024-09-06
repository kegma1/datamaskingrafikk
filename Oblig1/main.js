import {WebGLCanvas, Camera, Mesh, Shader, MeshInstance, ShaderInstance, Scene} from "./helpers.js";

import "../gl-matrix.js";


const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 600, 600);

let vertexShaderSource = document.getElementById('base-vertex-shader').innerHTML;
let fragmentShaderSource = document.getElementById('base-fragment-shader').innerHTML;

const gl = webGLCanvas.gl;

// Initialize an object to store the state of keys
const keys = {};

const roofHeight = 1;

function generateHouseMesh(height) {
    return new Mesh(gl, [
        // Top
        1, height, -1,   // X Y Z
        1, height, 1,   // X Y Z
        -1, height, 1,   // X Y Z

        -1, height, 1,   // X Y Z
        -1, height, -1,   // X Y Z
        1, height, -1,   // X Y Z

        // Front
        1, height, -1,     // X Y Z
        1, height, 1,      // X Y Z
        1, -1, 1,     // X Y Z

        1, height, -1,     // X Y Z
        1, -1, -1,    // X Y Z
        1, -1, 1,     // X Y Z

        // Back
        -1, height, -1,    // X Y Z
        -1, height, 1,     // X Y Z
        -1, -1, 1,    // X Y Z

        -1, height, -1,    // X Y Z
        -1, -1, -1,   // X Y Z
        -1, -1, 1,    // X Y Z

        // Left
        1, height, 1,      // X Y Z
        -1, height, 1,     // X Y Z
        1, -1, 1,     // X Y Z

        -1, -1, 1,    // X Y Z
        -1, height, 1,     // X Y Z
        1, -1, 1,     // X Y Z

        // Right
        1, height, -1,     // X Y Z
        -1, height, -1,    // X Y Z
        1, -1, -1,    // X Y Z

        -1, -1, -1,   // X Y Z
        -1, height, -1,    // X Y Z
        1, -1, -1,    // X Y Z
    ], 3);
}
const models = {
    aFrameRoof: new Mesh(gl, [
        // front
        1.3, 0, 1.3,     // X Y Z
        0, roofHeight, 1.3,       // X Y Z
        -1.3, 0, 1.3,    // X Y Z

        // back
        1.3, 0, -1.3,    // X Y Z
        0, roofHeight, -1.3,      // X Y Z
        -1.3, 0, -1.3,   // X Y Z

        // side 1
        0, roofHeight, 1.3,       // X Y Z
        1.3, 0, 1.3,     // X Y Z
        1.3, 0, -1.3,    // X Y Z

        0, roofHeight, 1.3,       // X Y Z
        0, roofHeight, -1.3,      // X Y Z
        1.3, 0, -1.3,    // X Y Z

        // side 2
        0, roofHeight, -1.3,      // X Y Z
        -1.3, 0, -1.3,   // X Y Z
        -1.3, 0, 1.3,    // X Y Z

        0, roofHeight, -1.3,      // X Y Z
        0, roofHeight, 1.3,       // X Y Z
        -1.3, 0, 1.3,    // X Y Z

    ], 3),
    flatRoof: new Mesh(gl, [
        // Top
        1.3, roofHeight/2, -1.3,      // X Y Z
        1.3, roofHeight/2, 1.3,       // X Y Z
        -1.3, roofHeight/2, 1.3,      // X Y Z

        -1.3, roofHeight/2, 1.3,      // X Y Z
        -1.3, roofHeight/2, -1.3,     // X Y Z
        1.3, roofHeight/2, -1.3,      // X Y Z

        // Bottom
        1.3, 0, -1.3,     // X Y Z
        1.3, 0, 1.3,      // X Y Z
        -1.3, 0, 1.3,     // X Y Z

        -1.3, 0, 1.3,     // X Y Z
        -1.3, 0, -1.3,    // X Y Z
        1.3, 0, -1.3,     // X Y Z

        // Front
        1.3, roofHeight/2, -1.3,      // X Y Z
        1.3, roofHeight/2, 1.3,       // X Y Z
        1.3, 0, 1.3,      // X Y Z

        1.3, roofHeight/2, -1.3,      // X Y Z
        1.3, 0, -1.3,     // X Y Z
        1.3, 0, 1.3,      // X Y Z

        // Back
        -1.3, roofHeight/2, -1.3,     // X Y Z
        -1.3, roofHeight/2, 1.3,      // X Y Z
        -1.3, 0, 1.3,     // X Y Z

        -1.3, roofHeight/2, -1.3,     // X Y Z
        -1.3, 0, -1.3,    // X Y Z
        -1.3, 0, 1.3,     // X Y Z

        // Left
        1.3, roofHeight/2, 1.3,       // X Y Z
        -1.3, roofHeight/2, 1.3,      // X Y Z
        1.3, 0, 1.3,      // X Y Z

        -1.3, 0, 1.3,     // X Y Z
        -1.3, roofHeight/2, 1.3,      // X Y Z
        1.3, 0, 1.3,      // X Y Z

        // Right
        1.3, roofHeight/2, -1.3,      // X Y Z
        -1.3, roofHeight/2, -1.3,     // X Y Z
        1.3, 0, -1.3,     // X Y Z

        -1.3, 0, -1.3,    // X Y Z
        -1.3, roofHeight/2, -1.3,     // X Y Z
        1.3, 0, -1.3,     // X Y Z

    ], 3),
    pyramidRoof: new Mesh(gl, [
        // Bottom
        1.3, 0, -1.3,     // X Y Z
        1.3, 0, 1.3,      // X Y Z
        -1.3, 0, 1.3,     // X Y Z

        -1.3, 0, 1.3,     // X Y Z
        -1.3, 0, -1.3,    // X Y Z
        1.3, 0, -1.3,     // X Y Z

        // Front
        0, roofHeight, 0,      // X Y Z
        1.3, 0, 1.3,       // X Y Z
        -1.3, 0, 1.3,      // X Y Z

        // Back
        0, roofHeight, 0,     // X Y Z
        1.3, 0, -1.3,      // X Y Z
        -1.3, 0, -1.3,     // X Y Z

        // Left
        0, roofHeight, 0,       // X Y Z
        -1.3, 0, 1.3,      // X Y Z
        -1.3, 0, -1.3,      // X Y Z

        // Right
        0, roofHeight, 0,      // X Y Z
        1.3, 0, 1.3,     // X Y Z
        1.3, 0, -1.3,     // X Y Z



    ], 3),
    coneRoof: new Mesh(gl, [
        // Bottom
        1.3, 0, -1.3,     // X Y Z
        1.3, 0, 1.3,      // X Y Z
        -1.3, 0, 1.3,     // X Y Z

        -1.3, 0, 1.3,     // X Y Z
        -1.3, 0, -1.3,    // X Y Z
        1.3, 0, -1.3,     // X Y Z

        // Front
        0, roofHeight, 0,      // X Y Z
        1.3, 0, 1.3,       // X Y Z
        -1.3, 0, 1.3,      // X Y Z

        // Back
        0, roofHeight, 0,     // X Y Z
        1.3, 0, -1.3,      // X Y Z
        -1.3, 0, -1.3,     // X Y Z

        // Left
        0, roofHeight, 0,       // X Y Z
        -1.3, 0, 1.3,      // X Y Z
        -1.3, 0, -1.3,      // X Y Z

        // Right
        0, roofHeight, 0,      // X Y Z
        1.3, 0, 1.3,     // X Y Z
        1.3, 0, -1.3,     // X Y Z
    ], 3),
    ground: new Mesh(gl, [
        50, 0, 50,   // X Y Z
        -50, 0, 50,   // X Y Z
        50, 0, -50,   // X Y Z
        
        50, 0, -50,   // X Y Z
        -50, 0, -50,   // X Y Z
        -50, 0, 50,   // X Y Z
    ], 3),
}

const shaders = {
    basic: new Shader(gl, vertexShaderSource, fragmentShaderSource, {
        vertexPosition: {name: "aVertexPosition", size: 3, stride: 3 * Float32Array.BYTES_PER_ELEMENT, offset: 0},
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

export function main() {
    let camera = new Camera(
        vec3.fromValues(10, 10, 0),
        vec3.fromValues(0, 0, 0),
        45,
        gl.canvas.clientWidth / gl.canvas.clientHeight,
        0.1,
        1000.0
    );

    let mainScene = new Scene(gl, camera, {
		g: new MeshInstance(models.ground, new ShaderInstance(shaders.basic), {fragmentColor: vec4.fromValues(0, 0.5, 0, 1)}),
        h1: new House(0.5 ,models.aFrameRoof, vec2.fromValues(3, -3), Math.PI/-4, vec4.fromValues(1, 0, 0, 1)),
        h2: new House(2 , null, vec2.fromValues(-3, -3), -Math.PI/-4, vec4.fromValues(0, 0, 1, 1)),
        h3: new House(5 ,models.pyramidRoof, vec2.fromValues(3, 3), Math.PI/4, vec4.fromValues(0, 1, 0, 1)),
        h4: new House(1 ,models.coneRoof, vec2.fromValues(-3, 3), -Math.PI/4, vec4.fromValues(0, 0, 0, 1)),
    });

    mainScene.setup = (o) => {
    };

    mainScene.update = (cam, o, time, dt) => {
		handelInput(cam, dt);
    };

    mainScene.start();
}

function handelInput(cam, dt) {
    const rotSpeed = 2.0;  
    const rotX = mat4.create();
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
        mat4.rotateX(rotX, mat4.create(), -rotSpeed * dt);
        vec3.transformMat4(cam.pos, cam.pos, rotX);
    }
    if (keys['KeyS']) {
        mat4.rotateX(rotX, mat4.create(), rotSpeed * dt);
        vec3.transformMat4(cam.pos, cam.pos, rotX);
    }

    cam.update_view()
}

class House {
    constructor(height, roof, pos, rot, color) {
        this.position = pos;
        this.body = new MeshInstance(generateHouseMesh(height), new ShaderInstance(shaders.basic), {
            fragmentColor: color
        })
        if (roof) {
            this.roof = new MeshInstance(roof, new ShaderInstance(shaders.basic), {
                fragmentColor: vec4.fromValues(0.25, 0.25, 0.25, 1)
            })
        }
        
        vec3.set(this.body.position, pos[0], 1, pos[1]);
        mat4.rotateY(this.body.rotation, mat4.create(), rot);
        
        if (this.roof) {
            vec3.set(this.roof.position, pos[0], 1 + height, pos[1])
            mat4.rotateY(this.roof.rotation, mat4.create(), rot);
        }
    }
    
    draw(camera) {
        this.body.draw(camera);   

        if (this.roof) {
            this.roof.draw(camera);
        }     
    }
}
