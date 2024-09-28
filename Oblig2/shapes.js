import {Mesh} from "./helpers.js";

export function generateCubeMesh(gl, w) {
    const hw = w * 0.5;
    return new Mesh(gl, [
        // Top
        hw, hw, -hw,    0, 1, 0,     0, 0, 0, 1,   // X Y Z nX nY nZ R G B A
        hw, hw, hw,     0, 1, 0,     0, 0, 0, 1,    // X Y Z nX nY nZ R G B A
        -hw, hw, hw,    0, 1, 0,     0, 0, 0, 1,   // X Y Z nX nY nZ R G B A

        -hw, hw, hw,    0, 1, 0,    0, 0, 0, 1,   // X Y Z nX nY nZ R G B A
        -hw, hw, -hw,   0, 1, 0,    0, 0, 0, 1,  // X Y Z nX nY nZ R G B A
        hw, hw, -hw,    0, 1, 0,    0, 0, 0, 1,   // X Y Z nX nY nZ R G B A

        // Bottom
        hw, -hw, -hw,    0, -1, 0,     0, 0, 0, 1,   // X Y Z nX nY nZ R G B A
        hw, -hw, hw,     0, -1, 0,     0, 0, 0, 1,    // X Y Z nX nY nZ R G B A
        -hw, -hw, hw,    0, -1, 0,     0, 0, 0, 1,   // X Y Z nX nY nZ R G B A

        -hw, -hw, hw,    0, -1, 0,    0, 0, 0, 1,   // X Y Z nX nY nZ R G B A
        -hw, -hw, -hw,   0, -1, 0,    0, 0, 0, 1,  // X Y Z nX nY nZ R G B A
        hw, -hw, -hw,    0, -1, 0,    0, 0, 0, 1,   // X Y Z nX nY nZ R G B A

        // Front
        hw, hw, -hw,    1, 0, 0,     0, 0, 0, 1,   // X Y Z nX nY nZ R G B A
        hw, hw, hw,     1, 0, 0,     0, 0, 0, 1,    // X Y Z nX nY nZ R G B A
        hw, -hw, hw,    1, 0, 0,     0, 0, 0, 1,    // X Y Z nX nY nZ R G B A

        hw, hw, -hw,    1, 0, 0,    0, 0, 0, 1,   // X Y Z nX nY nZ R G B A
        hw, -hw, -hw,   1, 0, 0,    0, 0, 0, 1,   // X Y Z nX nY nZ R G B A
        hw, -hw, hw,    1, 0, 0,    0, 0, 0, 1,    // X Y Z nX nY nZ R G B A

        // Back
        -hw, hw, -hw,   -1, 0, 0,    0, 0, 0, 1,  // X Y Z nX nY nZ R G B A
        -hw, hw, hw,    -1, 0, 0,    0, 0, 0, 1,   // X Y Z nX nY nZ R G B A
        -hw, -hw, hw,   -1, 0, 0,    0, 0, 0, 1,   // X Y Z nX nY nZ R G B A

        -hw, hw, -hw,   -1, 0, 0,    0, 0, 0, 1,  // X Y Z nX nY nZ R G B A
        -hw, -hw, -hw,  -1, 0, 0,    0, 0, 0, 1,  // X Y Z nX nY nZ R G B A
        -hw, -hw, hw,   -1, 0, 0,    0, 0, 0, 1,   // X Y Z nX nY nZ R G B A

        // Left
        hw, hw, hw,     0, 0, 1,      0, 0, 0, 1,    // X Y Z nX nY nZ R G B A
        -hw, hw, hw,    0, 0, 1,     0, 0, 0, 1,   // X Y Z nX nY nZ R G B A
        hw, -hw, hw,    0, 0, 1,     0, 0, 0, 1,    // X Y Z nX nY nZ R G B A

        -hw, -hw, hw,   0, 0, 1,    0, 0, 0, 1,   // X Y Z nX nY nZ R G B A
        -hw, hw, hw,    0, 0, 1,     0, 0, 0, 1,   // X Y Z nX nY nZ R G B A
        hw, -hw, hw,    0, 0, 1,     0, 0, 0, 1,    // X Y Z nX nY nZ R G B A

        // Right
        hw, hw, -hw,    0, 0, -1,     0, 0, 0, 1,   // X Y Z nX nY nZ R G B A
        -hw, hw, -hw,   0, 0, -1,    0, 0, 0, 1,  // X Y Z nX nY nZ R G B A
        hw, -hw, -hw,   0, 0, -1,    0, 0, 0, 1,   // X Y Z nX nY nZ R G B A

        -hw, -hw, -hw,  0, 0, -1,    , 0, 0, 1,  // X Y Z nX nY nZ R G B A
        -hw, hw, -hw,   0, 0, -1,    0, 0, 0, 1,  // X Y Z nX nY nZ R G B A
        hw, -hw, -hw,   0, 0, -1,    0, 0, 0, 1,   // X Y Z nX nY nZ R G B A
    ], 10);
}

export function generateGridMesh(gl, w, width) {
    const hWidth = width * 0.5;
    let vertexData = [];
    let indexData = [];
    
    let numLines = Math.floor(width / w); 

    for (let i = 0; i <= numLines; i++) {
        const x = -hWidth + i * w;
        vertexData.push(
            x, 0, -hWidth,  0, 1, 0,  0, 0, 0, 1, 
            x, 0,  hWidth,  0, 1, 0,  0, 0, 0, 1  
        );
        let indexOffset = i * 2; 
        indexData.push(indexOffset, indexOffset + 1);
    }

    for (let i = 0; i <= numLines; i++) {
        const z = -hWidth + i * w;
        vertexData.push(
            -hWidth, 0, z,  0, 1, 0,     0, 0, 0, 1,
            hWidth,  0, z,  0, 1, 0,     0, 0, 0, 1  
        );
        let indexOffset = (numLines + 1) * 2 + i * 2; 
        indexData.push(indexOffset, indexOffset + 1);
    }

    return new Mesh(gl, vertexData, 10, indexData, gl.LINES);
}
