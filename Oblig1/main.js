import {WebGLCanvas} from '../webgl24_std/base/helpers/WebGLCanvas.js';
import {WebGLShader} from '../webgl24_std/base/helpers/WebGLShader.js';
import {clearCanvas, BasicCamera, Mesh, Shader} from "./helpers.js"


export function main() {
	// Oppretter et webGLCanvas for WebGL-tegning:
	const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 600, 600);


	let vertexShaderSource = document.getElementById('base-vertex-shader').innerHTML;
	let fragmentShaderSource = document.getElementById('base-fragment-shader').innerHTML;

	let gl = webGLCanvas.gl;

	let pyramid = new Mesh(gl, [
		0, 1, 0,
		-1, 0, 1,
		1, 0, 1,

		0, 1, 0,
		1, 0, 1,
		1, 0 , -1,

		0, 1, 0,
		-1, 0, -1,
		-1, 0 , 1,

		0, 1, 0,
		-1, 0, -1,
		1, 0, -1,

		1, 0, 1,
		1, 0, -1,
		-1, 0, -1,

		-1, 0, -1,
		-1, 0, 1,
		1, 0, 1,
	],[
		1, 0, 0, 1,
		0, 1, 0, 1,
		0, 0, 1, 1,

		1, 0, 0, 1,
		0, 1, 0, 1,
		0, 0, 1, 1,

		1, 0, 0, 1,
		0, 1, 0, 1,
		0, 0, 1, 1,

		1, 0, 0, 1,
		0, 1, 0, 1,
		0, 0, 1, 1,

		1, 0, 0, 1,
		0, 1, 0, 1,
		0, 0, 1, 1,

		1, 0, 0, 1,
		0, 1, 0, 1,
		0, 0, 1, 1,
	])

	const basicShader = new Shader(gl, vertexShaderSource, fragmentShaderSource, [
		{fieldName: "vertexPosition", paramName: "aVertexPosition", type: "attribute"},
		{fieldName: "vertexColor", paramName: "aVertexColor", type: "attribute"},

		{fieldName: "fragmentColor", paramName: "uFragColor", type: "uniform"},
		{fieldName: "projectionMatrix", paramName: "uProjectionMatrix", type: "uniform"},
		{fieldName: "modelViewMatrix", paramName: "uModelViewMatrix", type: "uniform"},
	])
	
	let pos = new Vector3([0, 0, 10])

	const angle = 5;

	

	let camera = new BasicCamera(
		pos, 
		new Vector3([0, 0, 0]),
		45,
		gl.canvas.clientWidth / gl.canvas.clientHeight,
		0.1,
		1000.0,
	);


	let mainLoop = () => {
		clearCanvas(gl);
		const rotationMatrix = new Matrix4();
		rotationMatrix.rotate(-90, 1, 0 ,0);

		pyramid.bind(basicShader, camera, rotationMatrix)
		pyramid.draw()
		requestAnimationFrame(mainLoop)
	}
	requestAnimationFrame(mainLoop)
}



