export class VertexBuffer {
    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {number[]} data 
     */
    constructor(gl, data) {
        
        /**@type {WebGL2RenderingContext} */
        this.gl = gl;
        /**@type {WebGLBuffer} */
        this.buffer = gl.createBuffer();
        /**@type {Float32Array} */
        this.data = new Float32Array(data);


        this.bindBuffer()
    }

    /**
     * @returns
     */
    get count() {
        return this.data.length / 3;
    }

    bindBuffer() {
        // Kopler til
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        // Fyller
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.STATIC_DRAW);
        // Kopler fra
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }
    
}