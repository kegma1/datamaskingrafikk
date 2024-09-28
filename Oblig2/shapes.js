import {Mesh} from "./helpers.js";

export function generateCubeMesh(gl, w) {
    const hw = w * 0.5;
    return new Mesh(gl, [
        -hw,  hw, -hw,     0, 0, 0, 1, // X Y Z    R G B A  | 0
         hw,  hw, -hw,     0, 0, 0, 1, // X Y Z    R G B A  | 1
        -hw, -hw, -hw,     0, 0, 0, 1, // X Y Z    R G B A  | 2
         hw, -hw, -hw,     0, 0, 0, 1, // X Y Z    R G B A  | 3
        -hw,  hw,  hw,     0, 0, 0, 1, // X Y Z    R G B A  | 4
         hw,  hw,  hw,     0, 0, 0, 1, // X Y Z    R G B A  | 5
        -hw, -hw,  hw,     0, 0, 0, 1, // X Y Z    R G B A  | 6
         hw, -hw,  hw,     0, 0, 0, 1, // X Y Z    R G B A  | 7
    ], 7, [
        0, 1, 2,
        1, 3, 2,
        
        4, 0, 1,
        4, 5, 1,
        
        4, 0, 2,
        4, 6, 2,
        
        5, 3, 1,
        5, 7, 3,
        
        7, 3, 2,
        7, 6, 2,
        
        4, 5, 6,
        5, 7, 6,
        
    ]);
}

export function generateGridMesh(gl, w, width) {
    const hWidth = width * 0.5;
    let vertexData = [];
    let indexData = [];
    
    let numLines = Math.floor(width / w); 

    for (let i = 0; i <= numLines; i++) {
        const x = -hWidth + i * w;
        vertexData.push(
            x, 0, -hWidth,  0, 0, 0, 1, 
            x, 0,  hWidth,  0, 0, 0, 1  
        );
        let indexOffset = i * 2; 
        indexData.push(indexOffset, indexOffset + 1);
    }

    for (let i = 0; i <= numLines; i++) {
        const z = -hWidth + i * w;
        vertexData.push(
            -hWidth, 0, z,  0, 0, 0, 1,
            hWidth,  0, z,  0, 0, 0, 1  
        );
        let indexOffset = (numLines + 1) * 2 + i * 2; 
        indexData.push(indexOffset, indexOffset + 1);
    }

    return new Mesh(gl, vertexData, 7, indexData, gl.LINES);
}
