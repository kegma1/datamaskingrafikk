import {WebGLCanvas, Camera, Mesh, Shader, MeshInstance, ShaderInstance, Scene} from "./helpers.js";
import {garageDoor, generateAFrameMesh, generateHouseMesh, mainHouseDecoration, otherDecoration, generatePyramidMesh, generateFlatMesh, generateConeMesh, generateCylinderMesh} from "./shapes.js"

import "../gl-matrix.js";


const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 600, 600);

let vertexShaderSource = document.getElementById('base-vertex-shader').innerHTML;
let fragmentShaderSource = document.getElementById('base-fragment-shader').innerHTML;

let WindSpeedField = document.getElementById("vindSpeed");

const gl = webGLCanvas.gl;

// Initialize an object to store the state of keys
const keys = {};

const ground = new Mesh(gl, [
    50, 0, 50,   0, 0, 0, 1,   // X Y Z
    -50, 0, 50,   0, 0, 0, 1,   // X Y Z
    50, 0, -50,   0, 0, 0, 1,   // X Y Z
    
    50, 0, -50,   0, 0, 0, 1,   // X Y Z
    -50, 0, -50,   0, 0, 0, 1,   // X Y Z
    -50, 0, 50,   0, 0, 0, 1,   // X Y Z
], 7)

const path = new Mesh(gl, [
    50, 0, 50,   0, 0, 0, 1,   // X Y Z
    -50, 0, 50,   0, 0, 0, 1,   // X Y Z
    50, 0, -50,   0, 0, 0, 1,   // X Y Z
    
    50, 0, -50,   0, 0, 0, 1,   // X Y Z
    -50, 0, -50,   0, 0, 0, 1,   // X Y Z
    -50, 0, 50,   0, 0, 0, 1,   // X Y Z
], 7)

const windmillHeight = 10
const windmillBodyMesh = new Mesh(gl, generateCylinderMesh(1, windmillHeight, 20, 0, 0, 0, 1, 1, 1), 7);

const windmillBladesMesh = new Mesh(gl, [
    0, 0, 0,    0.5, 0.5, 0.5, 1,
    0, 1, 0,    0.5, 0.5, 0.5, 1,
    -1, 1, 0,   0.5, 0.5, 0.5, 1,

    0, 0, 0,    0.5, 0.5, 0.5, 1,
    0, -1, 0,   0.5, 0.5, 0.5, 1,
    1, -1, 0,   0.5, 0.5, 0.5, 1,

    0, 0, 0,    0.5, 0.5, 0.5, 1,
    -1, 0, 0,    0.5, 0.5, 0.5, 1,
    -1, -1, 0,   0.5, 0.5, 0.5, 1,

    0, 0, 0,    0.5, 0.5, 0.5, 1,
    1, 0, 0,   0.5, 0.5, 0.5, 1,
    1, 1, 0,   0.5, 0.5, 0.5, 1,
], 7)

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

export function main() {
    let camera = new Camera(
        vec3.fromValues( 0, 10, 20),
        vec3.fromValues(0, 0, 0),
        45,
        gl.canvas.clientWidth / gl.canvas.clientHeight,
        0.1,
        1000.0
    );

    let maxHouses = 3;
    const gap = 1.5;

    let mainScene = new Scene(gl, camera, {
		g: new MeshInstance(ground, new ShaderInstance(shaders.basic), {fragmentColor: vec4.fromValues(0, 0.5, 0, 1)}),
		// path: new MeshInstance(ground, new ShaderInstance(shaders.basic), {fragmentColor: vec4.fromValues(0, 0.5, 0, 1)}),
        h1: new House(gl, Math.ceil(Math.random() * maxHouses)),
        h2: new House(gl, Math.ceil(Math.random() * maxHouses)),
        h3: new House(gl, Math.ceil(Math.random() * maxHouses)),
        h4: new House(gl, Math.ceil(Math.random() * maxHouses)),

        windmillBody: new MeshInstance(windmillBodyMesh, new ShaderInstance(shaders.basic), {fragmentColor: vec4.fromValues(0, 0, 0, 1)}),
        windmillBlades: new MeshInstance(windmillBladesMesh, new ShaderInstance(shaders.basic), {fragmentColor: vec4.fromValues(0, 0, 0, 1)}),
    });

    mainScene.setup = (o) => {
        o.windmillBody.position = vec3.fromValues(0, 0, -10);
        o.windmillBlades.position = vec3.fromValues(0, windmillHeight -1, -9)
        o.windmillBlades.scale = vec3.fromValues(2, 2, 2)

        let streetWidth = (o.h1.width  + o.h2.width + o.h3.width  + o.h4.width + gap * 3) / 2
        o.h1.setPos(-streetWidth, 0);
        let nextHouse = o.h1.width + gap
        o.h2.setPos(nextHouse - streetWidth, 0);
        nextHouse += o.h2.width + gap
        o.h3.setPos(nextHouse - streetWidth, 0);
        nextHouse += o.h3.width + gap
        o.h4.setPos(nextHouse - streetWidth, 0);
    };

    mainScene.update = (cam, o, time, dt) => {
        mat4.rotateZ(o.windmillBlades.rotation, o.windmillBlades.rotation, -WindSpeedField.value*dt)

		handelInput(cam, dt);
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

class House {
    constructor(gl, roomNums) {
        this.mesh = new MeshInstance(new Mesh(gl, House.constructHouse(roomNums), 7), new ShaderInstance(shaders.basic), {fragmentColor: vec4.fromValues(0, 0, 0, 1)})
        this.fence = new MeshInstance(new Mesh(gl, House.constructFence(roomNums), 7), new ShaderInstance(shaders.basic), {fragmentColor: vec4.fromValues(0, 0, 0, 1)})
        this.width = roomNums * 2
        
        vec3.set(this.mesh.position, 0, 1, 0);
    }

    static constructFence(roomNums) {
        let mesh = [];
        return mesh;
    }

    static constructHouse(roomNums) {
        let mesh = [];

        for (let i = 1; i <= roomNums; i++) {
            let height = Math.floor((Math.random()) * 3) + 1;
            
            
            let offset = (i - 1) * 2 
            mesh.push(...generateHouseMesh(offset, height, Math.random(), Math.random(), Math.random(), 1))
            
            let roofType = Math.floor((Math.random()) * 4);

            if (roofType == 0) {
                mesh.push(...generateAFrameMesh(offset, height));
            } else if (roofType == 1) {
                mesh.push(...generatePyramidMesh(offset, height));
            } else if (roofType == 2) {
                mesh.push(...generateConeMesh(offset, height));
            } else if (roofType == 3) {
                mesh.push(...generateFlatMesh(offset, height));
            } 
            
            if (i == 1) {
                mesh.push(...mainHouseDecoration(offset))
            } else if (i == 2) {
                mesh.push(...otherDecoration(offset, 0))
            } else if (i == 3) {
                mesh.push(...garageDoor(offset))
            }
            
            if ( height > 1) {
                let wh = 1;
                for (let y = 0; y < height - 1 ; y++) {
                    mesh.push(...otherDecoration(offset, wh));
                    wh += 1;
                }
            }
        }

        return mesh
    }

    setPos(x, z) {
        vec3.set(this.mesh.position, x, 1, z);
        vec3.set(this.fence.position, x, 1, z);
    }
    
    draw(camera) {
        this.mesh.draw(camera);   

    }
}
