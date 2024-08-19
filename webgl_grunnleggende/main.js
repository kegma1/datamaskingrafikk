/** 
 * @param {WebGLRenderingContext} gl
 * @param {String} id 
 * @param {WebGLRenderingContextBase} shader_type
 * */
let getShader = (gl, id, shader_type) => {
    let shader_text = document.getElementById(id).innerHTML;
    const shader = gl.createShader(shader_type);
    if (!shader) {return null}
    gl.shaderSource(shader, shader_text);
    gl.compileShader(shader)
    return shader
}

/** 
 * @param {WebGLRenderingContext} gl
 * */
let initShaders = (gl) => {
    const vertex_shader = getShader(gl, "base-vertex-shader", gl.VERTEX_SHADER);
    const fragment_shader = getShader(gl, "base-fragment-shader", gl.FRAGMENT_SHADER);

    const program = gl.createProgram();

    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);

    gl.linkProgram(program);
    
    return {
        program: program,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(program, 'aVertexPosition')
        },
        uniformLocations: {
           fragmentColor: gl.getUniformLocation(program, 'uFragColor'),
        },
    }
}

/** 
 * @param {WebGLRenderingContext} gl
 * */
let initBuffers = (gl) => {
    const positions = new Float32Array([
        0.0, 0.5, 0.0,    // X Y Z
        -0.5, 0.0, 0.0,  // X Y Z
        0.5, 0.0, 0.0,   // X Y Z
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return {
        position: positionBuffer,
        vertexCount: positions.length / 3
    };
}

/** 
 * @param {WebGLRenderingContext} gl 
 * @param {Object} shaderInfo 
 * @param {Float32Array} positionBuffer 
 */
let connectPossitionAttribute = (gl, shaderInfo, positionBuffer) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(
        shaderInfo.attribLocations.vertexPosition,
        3,
        gl.FLOAT,
        false,
        0,
        0,
    );
    gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexPosition);
}

/**
 * @param {WebGLRenderingContext} gl 
 * @param {Object} shaderInfo 
 */
let connectColorUniform = (gl, shaderInfo) => {
    let colorRGBA = [1.0, 0.0, 0.0, 1.0];
    gl.uniform4f(shaderInfo.uniformLocations.fragmentColor, colorRGBA[0],colorRGBA[1],colorRGBA[2],colorRGBA[3]);
}

/** 
 * @param {WebGLRenderingContext} gl 
 * @param {Object} shaderInfo 
 * @param {Object} buffers 
 */
let draw = (gl, shaderInfo, buffers) => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shaderInfo.program);

    connectPossitionAttribute(gl, shaderInfo, buffers.position);

    connectColorUniform(gl, shaderInfo);

    gl.drawArrays(gl.TRIANGLES, 0, buffers.vertexCount);
}

export let main = () => {
    /** @type {HTMLCanvasElement|null} */
    let canvas = document.getElementById("canvas");
    if (!canvas) {return}

    let gl = canvas.getContext("webgl");
    if (!gl) {return}

    const shaderInfo = initShaders(gl);
    const buffers = initBuffers(gl);

    draw(gl, shaderInfo, buffers);

}