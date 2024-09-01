import {WebGLCanvas} from '../webgl24_std/base/helpers/WebGLCanvas.js';
import {WebGLShader} from '../webgl24_std/base/helpers/WebGLShader.js';
import {VertexBuffer, BasicCamera, connectAttribute} from "./helpers.js"


export function main() {
	// Oppretter et webGLCanvas for WebGL-tegning:
	const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 600, 600);
	let gl = webGLCanvas.gl;

	let baseShaderInfo = initBaseShaders(gl);

	let vertexBuffer =  new VertexBuffer(gl, [
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

	]);
	
	let pos = new Vector3([0, 0, 10])

	const angle = 5;

	const rotationMatrix = new Matrix4();
	rotationMatrix.setRotate(angle, 0, 1, 0); 

	let camera = new BasicCamera(
		pos, 
		new Vector3([0, 0, 0]),
		45,
		gl.canvas.clientWidth / gl.canvas.clientHeight,
		0.1,
		1000.0,
	);


	let mainLoop = () => {
		


		draw(gl, baseShaderInfo, vertexBuffer, camera);
		requestAnimationFrame(mainLoop)
	}
	requestAnimationFrame(mainLoop)
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @returns 
 */
function initBaseShaders(gl) {
	// Leser shaderkode fra HTML-fila: Standard/enkel shader (posisjon og farge):
	let vertexShaderSource = document.getElementById('base-vertex-shader').innerHTML;
	let fragmentShaderSource = document.getElementById('base-fragment-shader').innerHTML;

	// Initialiserer  & kompilerer shader-programmene;
	const glslShader = new WebGLShader(gl, vertexShaderSource, fragmentShaderSource);

	// Samler all shader-info i ET JS-objekt, som returneres.
	return  {
		program: glslShader.shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexPosition'),
		},
		uniformLocations: {
			modelViewMatrix: gl.getUniformLocation(glslShader.shaderProgram, "uModelViewMatrix"),
			projectionMatrix: gl.getUniformLocation(glslShader.shaderProgram, "uProjectionMatrix"),
		}
	};
}

/**
 * Klargjør canvaset.
 * Kalles fra draw()
 * @param {WebGL2RenderingContext} gl 
 */
function clearCanvas(gl) {
	gl.clearColor(0.75, 0.75, 0.75 , 1);  // Clear screen farge.
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);           // Enable "depth testing".
	gl.depthFunc(gl.LEQUAL);            // Nære objekter dekker fjerne objekter.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


/**
 * Tegner!
 * @param {WebGL2RenderingContext} gl 
 */
function draw(gl, shaderInfo, vertexBuffer, camera) {
	clearCanvas(gl);

	gl.useProgram(shaderInfo.program);

	connectAttribute(gl, shaderInfo.attribLocations.vertexPosition, vertexBuffer.buffer)

	let modelMatrix = new Matrix4();
	modelMatrix.setIdentity();

	let modelViewMatrix = new Matrix4(camera.viewMatrix.multiply(modelMatrix));

	gl.uniformMatrix4fv(shaderInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix.elements);
	gl.uniformMatrix4fv(shaderInfo.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);

	gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.count);
	
}
