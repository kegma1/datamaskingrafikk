//import {WebGLCanvas, Camera, Mesh, Shader, MeshInstance, ShaderInstance, Scene} from "./Oblig1/helpers.js";

// Initialize an object to store the state of keys
const keys = {};

// Add event listeners for keydown and keyup
window.addEventListener('keydown', (event) => {
    keys[event.code] = true; // Set key as pressed
});

window.addEventListener('keyup', (event) => {
    keys[event.code] = false; // Set key as released
});

export function main() {
    // Create a WebGLCanvas for WebGL drawing:
    const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 600, 600);

    let vertexShaderSource = document.getElementById('base-vertex-shader').innerHTML;
    let fragmentShaderSource = document.getElementById('base-fragment-shader').innerHTML;

    let gl = webGLCanvas.gl;

    let pyramid = new Mesh(gl, [
        0, 1, 0,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1, 0, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        1, 0, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A

        0, 1, 0,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        1, 0, 1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        1, 0, -1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A

        0, 1, 0,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1, 0, -1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        -1, 0, 1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A

        0, 1, 0,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1, 0, -1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        1, 0, -1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A

        1, 0, 1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        1, 0, -1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        -1, 0, -1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A

        -1, 0, -1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        -1, 0, 1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A
        1, 0, 1,    -0.5, -0.5, -0.5, 1, // X Y Z R G B A
    ], 3 + 4);

	let coord = new Mesh(gl, [
		10, 0, 0,	1, 0, 0, 1, // X Y Z R G B A
		-10, 0, 0,	1, 0, 0, 1, // X Y Z R G B A

		0, 10, 0,	0, 1, 0, 1, // X Y Z R G B A
		0, -10, 0,	0, 1, 0, 1, // X Y Z R G B A
		
		0, 0, 10,	0, 0, 1, 1, // X Y Z R G B A
		0, 0, -10,	0, 0, 1, 1, // X Y Z R G B A
	], 3 + 4, gl.LINES);

    let stride = (3 + 4) * Float32Array.BYTES_PER_ELEMENT;
    const basicShader = new Shader(gl, vertexShaderSource, fragmentShaderSource, {
        vertexPosition: {name: "aVertexPosition", size: 3, stride: stride, offset: 0},
        vertexColor: {name: "aVertexColor", size: 4, stride: stride, offset: 3 * Float32Array.BYTES_PER_ELEMENT},
    }, {
        fragmentColor: {name: "uFragColor", type: "vec4"},
        projectionMatrix: {name: "uProjectionMatrix", type: "mat4"},
        modelViewMatrix: {name: "uModelViewMatrix", type: "mat4"},
    });

    let camera = new Camera(
        vec3.fromValues(3, 3, 10),
        vec3.fromValues(0, 0, 0),
        45,
        gl.canvas.clientWidth / gl.canvas.clientHeight,
        0.1,
        1000.0
    );

    let mainScene = new Scene(gl, camera, {
		p1: new MeshInstance(pyramid, new ShaderInstance(basicShader), {fragmentColor: vec4.fromValues(1, 0, 0, 1)}),
        p2: new MeshInstance(pyramid, new ShaderInstance(basicShader), {fragmentColor: vec4.fromValues(0, 0, 1, 1)}),
		xcoord: new MeshInstance(coord, new ShaderInstance(basicShader), {fragmentColor: vec4.fromValues(0, 0, 0, 1)}),
    });

	// mainScene.setOrder("coord", 3)

    mainScene.setup = (o) => {
        vec3.set(o.p1.position, -2, 0, 0);
		vec3.set(o.p1.scale, 1, 2, 1);
        vec3.set(o.p2.position, 2, 0, 0);
    };

    mainScene.update = (cam, o, time, dt) => {
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


        mat4.rotate(o.p1.rotation, mat4.create(), (time * 3), [0.5, 1, -0.5]);
        mat4.rotate(o.p2.rotation, mat4.create(), (time * -3), [-0.5, 1, 0.5]);

        vec3.set(o.p1.position, o.p1.position[0], Math.sin(time * 3), o.p1.position[2]);

        vec4.set(o.p1.shaderParams.fragmentColor, 1, Math.sin(time * 4) * 2, 0, 1);
    };

    mainScene.start();
}
