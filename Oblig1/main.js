import {WebGLCanvas} from '../webgl24_std/base/helpers/WebGLCanvas.js';
import {WebGLShader} from '../webgl24_std/base/helpers/WebGLShader.js';
import {clearCanvas, BasicCamera, Mesh, Shader, MeshInstance, ShaderInstance} from "./helpers.js"


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
		0.25, 0.25, 0.25, 1,
		-0.5, -0.5, -0.5, 1,
		-0.5, -0.5, -0.5, 1,

		0.25, 0.25, 0.25, 1,
		-0.5, -0.5, -0.5, 1,
		-0.5, -0.5, -0.5, 1,

		0.25, 0.25, 0.25, 1,
		-0.5, -0.5, -0.5, 1,
		-0.5, -0.5, -0.5, 1,

		0.25, 0.25, 0.25, 1,
		-0.5, -0.5, -0.5, 1,
		-0.5, -0.5, -0.5, 1,

		-0.5, -0.5, -0.5, 1,
		-0.5, -0.5, -0.5, 1,
		-0.5, -0.5, -0.5, 1,

		-0.5, -0.5, -0.5, 1,
		-0.5, -0.5, -0.5, 1,
		-0.5, -0.5, -0.5, 1,
	])

	const basicShader = new Shader(gl, vertexShaderSource, fragmentShaderSource, {
		vertexPosition: {name: "aVertexPosition"},
		vertexColor: {name: "aVertexColor"},
	}, {
		fragmentColor: {name: "uFragColor", type: "Vector4"},
		projectionMatrix: {name: "uProjectionMatrix", type: "Matrix4"},
		modelViewMatrix: {name: "uModelViewMatrix", type: "Matrix4"},
	})

	let camera = new BasicCamera(
		new Vector3([0, 3, 10]), 
		new Vector3([0, 0, 0]),
		45,
		gl.canvas.clientWidth / gl.canvas.clientHeight,
		0.1,
		1000.0,
	);

	let p1 = new MeshInstance(pyramid, new ShaderInstance(basicShader))
	p1.position = new Vector3([-2, 0, 0])


	let p2 = new MeshInstance(pyramid, new ShaderInstance(basicShader))
	p2.position = new Vector3([2, 0, 0])

	let mainLoop = (timeElapsed) => {
		clearCanvas(gl);

		p1.rotation.rotate(1, 0, 1, 0)
		p2.rotation.rotate(-1, 0, 1, 0)

		p1.position.elements[1] = Math.sin(timeElapsed / 3)
		p2.position.elements[1] = -Math.sin(timeElapsed / 3)


		p1.bind(camera, {
			fragmentColor: new Vector4([1, 0, 0, 1])
		});
		p1.draw();

		p2.bind(camera, {
			fragmentColor: new Vector4([0, 0, 1, 1])
		});
		p2.draw();
		requestAnimationFrame(() => mainLoop(timeElapsed + 0.1));
	}
	requestAnimationFrame(() => mainLoop(0))
}



