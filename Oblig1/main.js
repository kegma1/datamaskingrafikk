import {WebGLCanvas} from '../webgl24_std/base/helpers/WebGLCanvas.js';
import {WebGLShader} from '../webgl24_std/base/helpers/WebGLShader.js';
import {VertexBuffer} from "./Vertex_buffer.js"


export function main() {
	// Oppretter et webGLCanvas for WebGL-tegning:
	const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 600, 600);

	const render_info = {
		gl: webGLCanvas.gl,
		baseShaderInfo: initBaseShaders(webGLCanvas.gl),

		vertexBuffer: new VertexBuffer(webGLCanvas.gl, [
			0, 1, 0,
			1, -1, 0,
			-1, -1, 0,
		])
	}

	draw(render_info);
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
			// color: gl.getUniformLocation(glslShader.shaderProgram, "uColor"),
		}
	};
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @returns 
 */
function initCamera(gl) {
	const camPosX = 0;
	const camPosY = 0;
	const camPosZ = 10;

	const lookAtX = 0;
	const lookAtY = 1;
	const lookAtZ = 0;

	const UpX = 0;
	const UpY = 1;
	const UpZ = 0;

	let viewMatrix = new Matrix4();
	let projectionMatrix = new Matrix4();

	viewMatrix.setLookAt(camPosX, camPosY, camPosZ, lookAtX, lookAtY, lookAtZ, UpX, UpY, UpZ);

	const FOV = 45;
	const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const near = 0.1;
	const far = 1000.0;

	projectionMatrix.setPerspective(FOV, aspectRatio, near, far);

	return {
		viewMatrix: viewMatrix,
		projectionMatrix: projectionMatrix,
	};
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {Object} baseShaderInfo 
 * @param {Float32Array} positionBuffer 
 */
function connectPositionAttribute(gl, baseShaderInfo, positionBuffer) {
	const numComponents = 3;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(
		baseShaderInfo.attribLocations.vertexPosition,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(baseShaderInfo.attribLocations.vertexPosition);
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
 */
function draw(render_info) {
	clearCanvas(render_info.gl);

	render_info.gl.useProgram(render_info.baseShaderInfo.program);

	connectPositionAttribute(render_info.gl, render_info.baseShaderInfo, render_info.vertexBuffer.buffer)

	let modelMatrix = new Matrix4();
	modelMatrix.setIdentity();

	let cameraMatrixes = initCamera(render_info.gl);
	let modelViewMatrix = new Matrix4(cameraMatrixes.viewMatrix.multiply(modelMatrix));

	render_info.gl.uniformMatrix4fv(render_info.baseShaderInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix.elements);
	render_info.gl.uniformMatrix4fv(render_info.baseShaderInfo.uniformLocations.projectionMatrix, false, cameraMatrixes.projectionMatrix.elements);

	
	
	render_info.gl.drawArrays(render_info.gl.TRIANGLES, 0, render_info.vertexBuffer.count);
	
}
