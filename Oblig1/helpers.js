export class MeshInstance {
    /**
     * 
     * @param {Mesh} mesh 
     * @param {ShaderInstance} shaderInstance 
     * @param {Object} shaderParams 
     */
    constructor(mesh, shaderInstance) {
        this.mesh = mesh;
        this.shader = shaderInstance;

        this.position = new Vector3([0, 0, 0])
        this.rotation = new Matrix4()
        this.scale = new Vector3([1, 1, 1])
    }

    

    bind(camera, constants) {
        const transformation = new Matrix4();
        transformation.translate(this.position.elements[0], this.position.elements[1], this.position.elements[2]);
        transformation.multiply(this.rotation)
        transformation.scale(this.scale.elements[0], this.scale.elements[1], this.scale.elements[2]);

        let modelMatrix = new Matrix4();
	    modelMatrix.setIdentity();
        modelMatrix.multiply(transformation);
        

	    let modelViewMatrix = new Matrix4(new Matrix4(camera.viewMatrix).multiply(modelMatrix));

	    this.shader.set("projectionMatrix", camera.projectionMatrix);
        this.shader.set("modelViewMatrix", modelViewMatrix);

        this.shader.bind(constants);
        this.mesh.bind(this.shader);
    }

    draw() {
        this.mesh.draw()
    }
}

export class ShaderInstance {
    /**
     * 
     * @param {Shader} shader 
     */
    constructor(shader) {
        this.shaderData = shader;
        this.uniforms = {};
        for (let k in shader.uniforms) {
            this.uniforms[k] = {
                ...shader.uniforms[k],
                value: null,
            }
        }

        this.attributs = {...shader.attributs};
    }

    set(name, v) {
        this.uniforms[name].value = v;
    }

    bind(constants) {
        this.shaderData.bind();
        const gl = this.shaderData.gl;

        for (let k in this.uniforms) {
            const u = this.uniforms[k];

            let value = constants[k];
            if (u.value) {
                value = u.value;
            }

            if (value && u.location) {
                const t = u.type;
                
                if (t == "Matrix4") {
                    gl.uniformMatrix4fv(u.location, false, value.elements);
                } else if (t == "Matrix3") {
                    gl.uniformMatrix3fv(u.location, false, value.elements);
                } else if (t == "Vector4") {
                    gl.uniform4fv(u.location, value.elements);
                } else if (t == "Vector3") {
                    gl.uniform3fv(u.location, value.elements);
                } else if (t == "Vector2") {
                    gl.uniform2fv(u.location, value.elements);
                } 

            }
        }

    }
}

export class Mesh {
    constructor(gl, positions, colors) {
        /**@type {WebGL2RenderingContext} */
        this.gl = gl
        this.buffers = {}


        this.positions = positions

        this.colors = colors

        this.bufferData({size: 3, data: positions}, "positions");
        this.bufferData({size: 3, data: colors}, "colors");
    }

    /**
     * @returns
     */
    get count() {
        return this.positions.length / 3;
    }

    bufferData(info, name) {
        info["buffer"] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, info.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(info.data), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        this.buffers[name] = info
    }

    /**
     * 
     * @param {Shader} shader 
     */
    bind(shader) {
        connectAttribute(this.gl, shader.attributs.vertexPosition.location, this.buffers.positions.buffer);
        connectAttribute(this.gl, shader.attributs.vertexColor.location, this.buffers.colors.buffer, 4);
    }

    draw() {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.count);
    }
}

export class Shader {
    constructor(gl, vertexSource, fragmentSource, attribueParams, uniformParams) {
        /**@type {WebGL2RenderingContext} */
        this.gl = gl;
        this.vertexSource = vertexSource;
        this.fragmentSource = fragmentSource;
   
		this.vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexSource);
		this.fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

		this.shaderProgram = gl.createProgram();
		gl.attachShader(this.shaderProgram, this.vertexShader);
		gl.attachShader(this.shaderProgram, this.fragmentShader);
		gl.linkProgram(this.shaderProgram);
		if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
			alert('Feil ved kompilering og/eller linking av shaderprogrammene: ' + gl.getProgramInfoLog(this.shaderProgram));
		}

        this.attributs = {};
		this.uniforms = {};

        for(let k in attribueParams) {

            this.attributs[k] = {
                location: this.gl.getAttribLocation(this.shaderProgram, attribueParams[k].name),
                // type: attrib.type,
            };

        }

        for(let k in uniformParams) {
            this.uniforms[k] = {
                location: this.gl.getUniformLocation(this.shaderProgram, uniformParams[k].name),
                type: uniformParams[k].type,
            };
        }
    }

    compileShader(gl, type, source) {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert('En feil oppsto ved kompilering av shaderne: ' + gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}

    bind() {
        this.gl.useProgram(this.shaderProgram);
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

/**
 * Klargjør canvaset.
 * Kalles fra draw()
 * @param {WebGL2RenderingContext} gl 
 */
export function clearCanvas(gl) {
	gl.clearColor(0.75, 0.75, 0.75 , 1);  // Clear screen farge.
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);           // Enable "depth testing".
	gl.depthFunc(gl.LEQUAL);            // Nære objekter dekker fjerne objekter.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}