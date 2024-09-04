import {WebGLCanvas, Camera, Mesh, Shader, MeshInstance, ShaderInstance, Scene} from "./helpers.js";
import "../gl-matrix.js";


const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 600, 600);

let vertexShaderSource = document.getElementById('base-vertex-shader').innerHTML;
let fragmentShaderSource = document.getElementById('base-fragment-shader').innerHTML;

const gl = webGLCanvas.gl;

// Initialize an object to store the state of keys
const keys = {};

const models = {
    houseBody: new Mesh(gl, [
        // Top
        1, 1, -1,   -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        1, 1, 1,   -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        -1, 1, 1,   -0.5, -0.5, -0.5, 1, // X Y Z R G B A

        -1, 1, 1,   -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        -1, 1, -1,   -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        1, 1, -1,   -0.5, -0.5, -0.5, 1, // X Y Z R G B A

        // Bottom
        1, -1, -1,    0, 0, 0, 1, // X Y Z R G B A
        1, -1, 1,    0, 0, 0, 1, // X Y Z R G B A
        -1, -1, 1,    0, 0, 0, 1, // X Y Z R G B A

        -1, -1, 1,    0, 0, 0, 1, // X Y Z R G B A
        -1, -1, -1,    0, 0, 0, 1, // X Y Z R G B A
        1, -1, -1,    0, 0, 0, 1, // X Y Z R G B A

        // // Front
        1, 1, -1,     -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        1, 1, 1,      -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        1, -1, 1,     0, 0, 0, 1, // X Y Z R G B A

        1, 1, -1,     -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        1, -1, -1,    0, 0, 0, 1, // X Y Z R G B A
        1, -1, 1,     0, 0, 0, 1, // X Y Z R G B A

        // // Back
        -1, 1, -1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        -1, 1, 1,     -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        -1, -1, 1,    0, 0, 0, 1, // X Y Z R G B A

        -1, 1, -1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        -1, -1, -1,   0, 0, 0, 1, // X Y Z R G B A
        -1, -1, 1,    0, 0, 0, 1, // X Y Z R G B A

        // // Left
        1, 1, 1,      -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        -1, 1, 1,     -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        1, -1, 1,     0, 0, 0, 1, // X Y Z R G B A

        -1, -1, 1,    0, 0, 0, 1, // X Y Z R G B A
        -1, 1, 1,     -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        1, -1, 1,     0, 0, 0, 1, // X Y Z R G B A

        // // Right
        1, 1, -1,     -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        -1, 1, -1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        1, -1, -1,    0, 0, 0, 1, // X Y Z R G B A

        -1, -1, -1,   0, 0, 0, 1, // X Y Z R G B A
        -1, 1, -1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        1, -1, -1,    0, 0, 0, 1, // X Y Z R G B A
    ], 3 + 4),
    houseRoof: new Mesh(gl, [
        // front
        1.3, 0, 1.3,     0, 0, 0, 1, // X Y Z R G B A
        0, 0.5, 1.3,       0, 0, 0, 1, // X Y Z R G B A
        -1.3, 0, 1.3,    0, 0, 0, 1, // X Y Z R G B A

        // back
        1.3, 0, -1.3,    0, 0, 0, 1, // X Y Z R G B A
        0, 0.5, -1.3,      0, 0, 0, 1, // X Y Z R G B A
        -1.3, 0, -1.3,   0, 0, 0, 1, // X Y Z R G B A

        // side 1
        0, 0.5, 1.3,       0, 0, 0, 1, // X Y Z R G B A
        1.3, 0, 1.3,     0, 0, 0, 1, // X Y Z R G B A
        1.3, 0, -1.3,    0, 0, 0, 1, // X Y Z R G B A

        0, 0.5, 1.3,       0, 0, 0, 1, // X Y Z R G B A
        0, 0.5, -1.3,      0, 0, 0, 1, // X Y Z R G B A
        1.3, 0, -1.3,    0, 0, 0, 1, // X Y Z R G B A

        // side 2
        0, 0.5, -1.3,      0, 0, 0, 1, // X Y Z R G B A
        -1.3, 0, -1.3,   0, 0, 0, 1, // X Y Z R G B A
        -1.3, 0, 1.3,    0, 0, 0, 1, // X Y Z R G B A

        0, 0.5, -1.3,      0, 0, 0, 1, // X Y Z R G B A
        0, 0.5, 1.3,       0, 0, 0, 1, // X Y Z R G B A
        -1.3, 0, 1.3,    0, 0, 0, 1, // X Y Z R G B A

    ], 3 + 4),
    coord: new Mesh(gl, [
		1, 0, 0,	1, 0, 0, 1, // X Y Z R G B A
		-1, 0, 0,	1, 0, 0, 1, // X Y Z R G B A

		0, 1, 0,	0, 1, 0, 1, // X Y Z R G B A
		0, -1, 0,	0, 1, 0, 1, // X Y Z R G B A
		
		0, 0, 1,	0, 0, 1, 1, // X Y Z R G B A
		0, 0, -1,	0, 0, 1, 1, // X Y Z R G B A
	], 3 + 4, gl.LINES),
}

const shaders = {
    basic: new Shader(gl, vertexShaderSource, fragmentShaderSource, {
        vertexPosition: {name: "aVertexPosition", size: 3, stride: (3 + 4) * Float32Array.BYTES_PER_ELEMENT, offset: 0},
        vertexColor: {name: "aVertexColor", size: 4, stride: (3 + 4) * Float32Array.BYTES_PER_ELEMENT, offset: 3 * Float32Array.BYTES_PER_ELEMENT},
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
		// p1: new MeshInstance(pyramid, new ShaderInstance(basicShader), {fragmentColor: vec4.fromValues(1, 0, 0, 1)}),
        // p2: new MeshInstance(pyramid, new ShaderInstance(basicShader), {fragmentColor: vec4.fromValues(0, 0, 1, 1)}),
        h1: new House(vec3.fromValues(3, 1, -3), Math.PI/-4, vec4.fromValues(1, 0, 0, 1)),
        h2: new House(vec3.fromValues(-3, 1, -3), -Math.PI/-4, vec4.fromValues(0, 0, 1, 1)),
        h3: new House(vec3.fromValues(3, 1, 3), Math.PI/4, vec4.fromValues(0, 1, 0, 1)),
        h4: new House(vec3.fromValues(-3, 1, 3), -Math.PI/4, vec4.fromValues(0, 0, 0, 1)),
		coord: new MeshInstance(models.coord, new ShaderInstance(shaders.basic), {fragmentColor: vec4.fromValues(0, 0, 0, 1)}),
    });

    mainScene.setup = (o) => {
        const coordScale = 50;
        vec3.set(o.coord.scale, coordScale, coordScale, coordScale);
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
    constructor(pos, rot, color) {
        this.position = pos;
        this.body = new MeshInstance(models.houseBody, new ShaderInstance(shaders.basic), {
            fragmentColor: color
        })
        this.roof = new MeshInstance(models.houseRoof, new ShaderInstance(shaders.basic), {
            fragmentColor: vec4.fromValues(0.25, 0.25, 0.25, 1)
        })
        
        vec3.set(this.body.position, pos[0], pos[1], pos[2]);
        mat4.rotateY(this.body.rotation, mat4.create(), rot);
        
        
        vec3.set(this.roof.position, pos[0], pos[1] + 1, pos[2])
        mat4.rotateY(this.roof.rotation, mat4.create(), rot);
    }
    
    draw(camera) {
        this.body.draw(camera);        
        this.roof.draw(camera);
    }
}
