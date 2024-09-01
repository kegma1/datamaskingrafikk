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

export class BasicCamera {
    /**
     * 
     * @param {Vector3} pos 
     * @param {Vector3} lookAt 
     * @param {Number} FOV 
     * @param {Number} aspectRatio 
     * @param {Number} near 
     * @param {Number} far 
     */
    constructor(pos, lookAt, FOV, aspectRatio, near, far) {
        /**@type {Vector3} */
        this.cam_pos = pos


        /**@type {Vector3} */
        this.look = lookAt
        /**@type {Vector3} */
        this.up = new Vector3([0, 1, 0]);

        /**@type {Matrix4} */
        this.viewMatrix = new Matrix4();
        /**@type {Matrix4} */
	    this.projectionMatrix = new Matrix4();

        
        /**@type {Number} */
        this.FOV = FOV;

        /**@type {Number} */
        this.aspectRatio = aspectRatio;

        /**@type {Number} */
        this.near = near;

        /**@type {Number} */
        this.far = far;
        

        this.update_view()
    }

    get pos() {return this.cam_pos}
    set pos(new_pos) {
        this.cam_pos = new_pos
        
        this.update_view()
    }

    get lookAt() {return this.look}
    set lookAt(new_lookAt) {
        this.look = new_lookAt
        
        this.update_view()
    }

    update_view() {
        this.viewMatrix.setLookAt(this.cam_pos.elements[0], this.cam_pos.elements[1], this.cam_pos.elements[2], this.look.elements[0], this.look.elements[1], this.look.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        this.projectionMatrix.setPerspective(this.FOV, this.aspectRatio, this.near, this.far);
    }

}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {Number} attributLocation 
 * @param {Float32Array} positionBuffer 
 */
export function connectAttribute(gl, attributLocation, Buffer, numComponents = 3, type = gl.FLOAT, normalize = false, stride = 0, offset = 0) {
	gl.bindBuffer(gl.ARRAY_BUFFER, Buffer);
	gl.vertexAttribPointer(
		attributLocation,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(attributLocation);
}
