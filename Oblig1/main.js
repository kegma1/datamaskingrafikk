import {WebGLCanvas} from '../webgl24_std/base/helpers/WebGLCanvas.js';
import {Camera, Mesh, Shader, MeshInstance, ShaderInstance, Scene} from "./helpers.js"


export function main() {
	// Oppretter et webGLCanvas for WebGL-tegning:
	const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 600, 600);

	let vertexShaderSource = document.getElementById('base-vertex-shader').innerHTML;
	let fragmentShaderSource = document.getElementById('base-fragment-shader').innerHTML;

	let gl = webGLCanvas.gl;

	let pyramid = new Mesh(gl, [
		0, 1, 0,	 0.25, 0.25, 0.25, 1, // X Y Z	R G B A
		-1, 0, 1,	 0.25, 0.25, 0.25, 1, // X Y Z	R G B A
		1, 0, 1,	 0.25, 0.25, 0.25, 1, // X Y Z	R G B A

		0, 1, 0,	 0.25, 0.25, 0.25, 1, // X Y Z	R G B A
		1, 0, 1,	 -0.5, -0.5, -0.5, 1, // X Y Z	R G B A
		1, 0 , -1,	 -0.5, -0.5, -0.5, 1, // X Y Z	R G B A

		0, 1, 0,	 0.25, 0.25, 0.25, 1, // X Y Z	R G B A
		-1, 0, -1,	 -0.5, -0.5, -0.5, 1, // X Y Z	R G B A
		-1, 0 , 1,	 -0.5, -0.5, -0.5, 1, // X Y Z	R G B A

		0, 1, 0,	 0.25, 0.25, 0.25, 1, // X Y Z	R G B A
		-1, 0, -1,	 -0.5, -0.5, -0.5, 1, // X Y Z	R G B A
		1, 0, -1,	 -0.5, -0.5, -0.5, 1, // X Y Z	R G B A

		1, 0, 1,	 -0.5, -0.5, -0.5, 1, // X Y Z	R G B A
		1, 0, -1,	 -0.5, -0.5, -0.5, 1, // X Y Z	R G B A
		-1, 0, -1,	 -0.5, -0.5, -0.5, 1, // X Y Z	R G B A

		-1, 0, -1,	 -0.5, -0.5, -0.5, 1, // X Y Z	R G B A
		-1, 0, 1,	 -0.5, -0.5, -0.5, 1, // X Y Z	R G B A
		1, 0, 1,	 -0.5, -0.5, -0.5, 1, // X Y Z	R G B A
	], 3 + 4)

	let stride = (3 + 4) * Float32Array.BYTES_PER_ELEMENT
	const basicShader = new Shader(gl, vertexShaderSource, fragmentShaderSource, {
		vertexPosition: {name: "aVertexPosition", size: 3, stride: stride, offset: 0},
		vertexColor: {name: "aVertexColor", size: 4, stride: stride, offset: 3 * Float32Array.BYTES_PER_ELEMENT},
	}, {
		fragmentColor: {name: "uFragColor", type: "Vector4"},
		projectionMatrix: {name: "uProjectionMatrix", type: "Matrix4"},
		modelViewMatrix: {name: "uModelViewMatrix", type: "Matrix4"},
	})

	let camera = new Camera(
		new Vector3([0, 3, 10]), 
		new Vector3([0, 0, 0]),
		45,
		gl.canvas.clientWidth / gl.canvas.clientHeight,
		0.1,
		1000.0,
	);

	let mainScene = new Scene(gl, camera, {
		p1: new MeshInstance(pyramid, new ShaderInstance(basicShader), {fragmentColor: new Vector4([1, 0, 0, 1])}),
		p2: new MeshInstance(pyramid, new ShaderInstance(basicShader), {fragmentColor: new Vector4([0, 0, 1, 1])}),
	})

	mainScene.setup = (o) => {
		o.p1.position = new Vector3([-2, 0, 0])
		o.p2.position = new Vector3([2, 0, 0])
	}

	mainScene.update = (o, time, dt) => {
		o.p1.rotation.rotate(1, 0.5, 1, -0.5)
		o.p2.rotation.rotate(-1, -0.5, 1, 0.5)

		o.p1.position.elements[1] = Math.sin(time * 3)
		o.p2.position.elements[1] = -Math.sin(time * 3)

		o.p1.shaderParams.fragmentColor.elements[1] = Math.sin(time * 4) * 2
	}

	mainScene.start();
}



