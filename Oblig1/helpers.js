export class Scene {
    constructor(gl, camera, objects = {}) {
        this.gl = gl;
        this.camera = camera;
        this.objects = objects;
        
        /**@type {function(Object): void} [setup] - Callback function that takes Objects as parameters. */
        this.setup = () => {};
        /**@type {function(Object, number, number): void} [update] - Callback function that takes Objects, timeElapsed, and deltaTime as parameters. */
        this.update = () => {};
    }

    draw() {
        clearCanvas(this.gl);

        for (const k in this.objects) {
            this.objects[k].bind(this.camera);
            this.objects[k].draw();
        }
    }

    start() {
        const renderLoop = (timestamp) => {
            const timeElapsed = (this.startTime !== undefined) ? timestamp - this.startTime : 0;
            this.startTime = this.startTime || timestamp;
            const deltaTime = timestamp - (this.lastFrameTime || timestamp);
            this.lastFrameTime = timestamp;

            this.update(this.objects, timeElapsed / 1000, deltaTime / 1000);

            this.draw();
            requestAnimationFrame(renderLoop);
        };

        this.setup(this.objects);
        requestAnimationFrame(renderLoop);
    }
}

export class MeshInstance {
    /**
     * 
     * @param {Mesh} mesh 
     * @param {ShaderInstance} shaderInstance 
     * @param {Object} shaderParams 
     */
    constructor(mesh, shaderInstance, shaderParams) {
        this.mesh = mesh;
        this.shader = shaderInstance;
        this.shaderParams = shaderParams;

        this.position = vec3.create();
        this.rotation = mat4.create();
        this.scale = vec3.fromValues(1, 1, 1);
    }

    bind(camera) {
        const constants = this.shaderParams;

        const transformation = mat4.create();
        mat4.multiply(transformation, this.rotation, transformation);
        mat4.translate(transformation, transformation, this.position);
        mat4.scale(transformation, transformation, this.scale);

        let modelMatrix = mat4.create();
        mat4.identity(modelMatrix);
        mat4.multiply(modelMatrix, transformation, modelMatrix);

        let modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, camera.viewMatrix, modelMatrix);

        this.shader.set("projectionMatrix", camera.projectionMatrix);
        this.shader.set("modelViewMatrix", modelViewMatrix);

        this.shader.bind(constants);
        this.mesh.bind(this.shader);
    }

    draw() {
        this.mesh.draw();
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
            };
        }

        this.attributes = {...shader.attributes};
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
                
                if (t === "mat4") {
                    gl.uniformMatrix4fv(u.location, false, value);
                } else if (t === "vec4") {
                    gl.uniform4fv(u.location, value);
                } else if (t === "vec3") {
                    gl.uniform3fv(u.location, value);
                } else if (t === "vec2") {
                    gl.uniform2fv(u.location, value);
                }
            }
        }
    }
}

export class Mesh {
    constructor(gl, vertexData, vertexLength) {
        /**@type {WebGL2RenderingContext} */
        this.gl = gl;
        this.buffers = {};

        this.vertexData = vertexData;
        this.vertexLength = vertexLength;

        this.bufferData({data: vertexData}, "vertexData");
    }

    /**
     * @returns
     */
    get count() {
        return this.vertexData.length / this.vertexLength;
    }

    bufferData(info, name) {
        info["buffer"] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, info.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(info.data), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        this.buffers[name] = info;
    }

    /**
     * 
     * @param {Shader} shader 
     */
    bind(shader) {
        for (let k in shader.attributes) {
            connectAttribute(
                this.gl,
                shader.attributes[k].location,
                this.buffers.vertexData.buffer,
                shader.attributes[k].size,
                shader.attributes[k].type,
                shader.attributes[k].normalize,
                shader.attributes[k].stride,
                shader.attributes[k].offset 
            );
        }
    }

    draw() {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.count);
    }
}

export class Shader {
    constructor(gl, vertexSource, fragmentSource, attributeParams, uniformParams) {
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
            alert('Failed to compile and/or link shaders: ' + gl.getProgramInfoLog(this.shaderProgram));
        }

        this.attributes = {};
        this.uniforms = {};

        for (let k in attributeParams) {
            this.attributes[k] = {
                location: this.gl.getAttribLocation(this.shaderProgram, attributeParams[k].name),
                ...attributeParams[k],
            };
        }

        for (let k in uniformParams) {
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
            alert('An error occurred while compiling shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    bind() {
        this.gl.useProgram(this.shaderProgram);
    }
}

export class Camera {
    /**
     * 
     * @param {vec3} pos 
     * @param {vec3} lookAt 
     * @param {Number} FOV 
     * @param {Number} aspectRatio 
     * @param {Number} near 
     * @param {Number} far 
     */
    constructor(pos, lookAt, FOV, aspectRatio, near, far) {
        /**@type {vec3} */
        this.cam_pos = pos;
        /**@type {vec3} */
        this.look = lookAt;
        /**@type {vec3} */
        this.up = vec3.fromValues(0, 1, 0);

        /**@type {mat4} */
        this.viewMatrix = mat4.create();
        /**@type {mat4} */
        this.projectionMatrix = mat4.create();

        /**@type {Number} */
        this.FOV = FOV;

        /**@type {Number} */
        this.aspectRatio = aspectRatio;

        /**@type {Number} */
        this.near = near;

        /**@type {Number} */
        this.far = far;

        this.update_view();
    }

    get pos() { return this.cam_pos; }
    set pos(new_pos) {
        this.cam_pos = new_pos;
        this.update_view();
    }

    get lookAt() { return this.look; }
    set lookAt(new_lookAt) {
        this.look = new_lookAt;
        this.update_view();
    }

    update_view() {
        mat4.lookAt(this.viewMatrix, this.cam_pos, this.look, this.up);
        mat4.perspective(this.projectionMatrix, this.FOV, this.aspectRatio, this.near, this.far);
    }
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {Number} attributeLocation 
 * @param {WebGLBuffer} buffer 
 * @param {Number} numComponents 
 * @param {Number} type 
 * @param {Boolean} normalize 
 * @param {Number} stride 
 * @param {Number} offset 
 */
export function connectAttribute(gl, attributeLocation, buffer, numComponents = 3, type = gl.FLOAT, normalize = false, stride = 0, offset = 0) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(
        attributeLocation,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(attributeLocation);
}

/**
 * Clears the canvas.
 * Called from draw()
 * @param {WebGL2RenderingContext} gl 
 */
export function clearCanvas(gl) {
    gl.clearColor(0.75, 0.75, 0.75, 1);  // Clear color.
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing.
    gl.depthFunc(gl.LEQUAL);            // Near objects obscure far objects.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
