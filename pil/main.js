import {WebGLCanvas} from '../webgl24_std/base/helpers/WebGLCanvas.js';
import {WebGLShader} from '../webgl24_std/base/helpers/WebGLShader.js';

/**
 * Et WebGL-program som tegner en enkel trekant.
 * Bruker ikke klasser, kun funksjoner.
 */
export function main() {
	// Oppretter et webGLCanvas for WebGL-tegning:
	const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 600, 600);

	const render_info = {
		gl: webGLCanvas.gl,
		baseShaderInfo: initBaseShaders(webGLCanvas.gl),
		coordBuffers: initCoordBuffers(webGLCanvas.gl),
		arrowBuffers: initaArrowBuffers(webGLCanvas.gl),
	}

	draw(render_info);
}

function initaArrowBuffers(gl) {
	const arrow_width = 0.5;
	const arrow_height = 0.25;
	const tail_depth = 0.1;



	const positions = new Float32Array([
		arrow_width, 0, 0,
		arrow_width/2, arrow_height, 0,
		arrow_width/2, -arrow_height, 0,

		-arrow_width, arrow_height/2, 0,
		-arrow_width + tail_depth, arrow_height/2, 0,
		-arrow_width + tail_depth, 0, 0,

		-arrow_width, -arrow_height/2, 0,
		-arrow_width + tail_depth, -arrow_height/2, 0,
		-arrow_width + tail_depth, 0, 0,

		-arrow_width + tail_depth, arrow_height/2, 0,
		arrow_width/2, arrow_height/2, 0,
		arrow_width/2, -arrow_height/2, 0,

		-arrow_width + tail_depth, -arrow_height/2, 0,
		-arrow_width + tail_depth, arrow_height/2, 0,
		arrow_width/2, -arrow_height/2, 0,

	]);

	const colors = new Float32Array([
		1, 0.5, 1,
		0, 0.5, 0.5,
		0, 0.5, 0.5,

		0, 0.5, 0.5,
		0, 0.5, 1,
		0, 0.5, 1,

		0, 0.5, 0.5,
		0, 0.5, 1,
		0, 0.5, 1,

		0, 0.5, 1,
		0, 0.5, 0.5,
		0, 0.5, 0.5,

		0, 0.5, 1,
		0, 0.5, 1,
		0, 0.5, 0.5,
	])

	const positionBuffer = gl.createBuffer();
	// Kopler til
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	// Fyller
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	// Kopler fra
	gl.bindBuffer(gl.ARRAY_BUFFER, null);


	const colorBuffer = gl.createBuffer();
	// Kopler til
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	// Fyller
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
	// Kopler fra
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return  {
		position: positionBuffer,
		vertexCount: positions.length/3,

		color: colorBuffer,
		colorCount: colors.length/3,
	};
}

function initCoordBuffers(gl) {
	const arrow_width = 0.02;
	const arrow_height = 0.02;


	const positions = new Float32Array([
		-1, 0, 0,
		1, 0, 0,
		0, -1, 0,
		0, 1, 0,

		-1, 0, 0,
		-1 + arrow_height, arrow_width, 0,
		-1 + arrow_height, -arrow_width, 0,

		1, 0, 0,
		1 - arrow_height, arrow_width, 0,
		1 - arrow_height, -arrow_width, 0,

		0, -1, 0,
		arrow_width, -1 + arrow_height, 0,
		-arrow_width, -1 + arrow_height, 0,

		0, 1, 0,
		arrow_width, 1 - arrow_height, 0,
		-arrow_width, 1 - arrow_height, 0,

	]);

	const colors = new Float32Array([
		1, 0, 0,
		1, 0, 0,
		0, 1, 0,
		0, 1, 0,

		1, 0, 0,
		1, 0, 0,
		1, 0, 0,

		1, 0, 0,
		1, 0, 0,	
		1, 0, 0,	

		0, 1, 0,
		0, 1, 0,
		0, 1, 0,

		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		

	])

	const positionBuffer = gl.createBuffer();
	// Kopler til
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	// Fyller
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	// Kopler fra
	gl.bindBuffer(gl.ARRAY_BUFFER, null);


	const colorBuffer = gl.createBuffer();
	// Kopler til
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	// Fyller
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
	// Kopler fra
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return  {
		position: positionBuffer,
		vertexCount: positions.length/3,

		color: colorBuffer,
		colorCount: colors.length/3,
	};
}

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
			vertexColor: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexColor'),
		},
	};
}


/**
 * Aktiverer position-bufferet.
 * Kalles fra draw()
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

function connectVertexColorAttribute(gl, baseShaderInfo, vertexColorBuffer) {
	const numComponents = 3;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
	gl.vertexAttribPointer(
		baseShaderInfo.attribLocations.vertexColor,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(baseShaderInfo.attribLocations.vertexColor);
}


/**
 * Klargjør canvaset.
 * Kalles fra draw()
 */
function clearCanvas(gl) {
	gl.clearColor(1.0, 1.0, 1.0, 1);  // Clear screen farge.
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

	// Aktiver shader:
	render_info.gl.useProgram(render_info.baseShaderInfo.program);
	
	connectPositionAttribute(render_info.gl, render_info.baseShaderInfo, render_info.arrowBuffers.position);
	connectVertexColorAttribute(render_info.gl, render_info.baseShaderInfo, render_info.arrowBuffers.color);
	
	render_info.gl.drawArrays(render_info.gl.TRIANGLES, 0, render_info.arrowBuffers.vertexCount);
	
	// Kople posisjon-attributtet til tilhørende buffer:
	connectPositionAttribute(render_info.gl, render_info.baseShaderInfo, render_info.coordBuffers.position);
	connectVertexColorAttribute(render_info.gl, render_info.baseShaderInfo, render_info.coordBuffers.color);
	
	// Tegn!
	render_info.gl.drawArrays(render_info.gl.LINES, 0, 4);
	render_info.gl.drawArrays(render_info.gl.TRIANGLES, 4, 12);
}
