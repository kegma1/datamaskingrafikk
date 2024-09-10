export function generateHouseMesh(offset, height, r, g, b, a) {
    return [
        // Top
        1 + offset, height, -1, r, g, b, a,   // X Y Z R G B A
        1 + offset, height, 1, r, g, b, a,    // X Y Z R G B A
        -1 + offset, height, 1, r, g, b, a,   // X Y Z R G B A

        -1 + offset, height, 1, r, g, b, a,   // X Y Z R G B A
        -1 + offset, height, -1, r, g, b, a,  // X Y Z R G B A
        1 + offset, height, -1, r, g, b, a,   // X Y Z R G B A

        // + offset Front
        1 + offset, height, -1, r, g, b, a,   // X Y Z R G B A
        1 + offset, height, 1, r, g, b, a,    // X Y Z R G B A
        1 + offset, -1, 1, r, g, b, a,    // X Y Z R G B A

        1 + offset, height, -1, r, g, b, a,   // X Y Z R G B A
        1 + offset, -1, -1, r, g, b, a,   // X Y Z R G B A
        1 + offset, -1, 1, r, g, b, a,    // X Y Z R G B A

        // + offset Back
        -1 + offset, height, -1, r, g, b, a,  // X Y Z R G B A
        -1 + offset, height, 1, r, g, b, a,   // X Y Z R G B A
        -1 + offset, -1, 1, r, g, b, a,   // X Y Z R G B A

        -1 + offset, height, -1, r, g, b, a,  // X Y Z R G B A
        -1 + offset, -1, -1, r, g, b, a,  // X Y Z R G B A
        -1 + offset, -1, 1, r, g, b, a,   // X Y Z R G B A

        // + offset Left
        1 + offset, height, 1, r, g, b, a,    // X Y Z R G B A
        -1 + offset, height, 1, r, g, b, a,   // X Y Z R G B A
        1 + offset, -1, 1, r, g, b, a,    // X Y Z R G B A

        -1 + offset, -1, 1, r, g, b, a,   // X Y Z R G B A
        -1 + offset, height, 1, r, g, b, a,   // X Y Z R G B A
        1 + offset, -1, 1, r, g, b, a,    // X Y Z R G B A

        // + offset Right
        1 + offset, height, -1, r, g, b, a,   // X Y Z R G B A
        -1 + offset, height, -1, r, g, b, a,  // X Y Z R G B A
        1 + offset, -1, -1, r, g, b, a,   // X Y Z R G B A

        -1 + offset, -1, -1, r, g, b, a,  // X Y Z R G B A
        -1 + offset, height, -1, r, g, b, a,  // X Y Z R G B A
        1 + offset, -1, -1, r, g, b, a,   // X Y Z R G B A
    ]
}

export function mainHouseDecoration(offset) {
    return [
        // Door
        0.2 + offset, -1, 1.001,    0, 0, 0, 1,
        0.2 + offset, 0.2, 1.001,    0, 0, 0, 1,
        -0.2 + offset, 0.2, 1.001,    0, 0, 0, 1,

        0.2 + offset, -1, 1.001,    0, 0, 0, 1,
        -0.2 + offset, -1, 1.001,    0, 0, 0, 1,
        -0.2 + offset, 0.2, 1.001,    0, 0, 0, 1,

        // window left
        -0.5 + offset, -0.2, 1.001,    0.25, 0.5, 1, 1,
        -0.5 + offset, 0.2, 1.001,    0.25, 0.5, 1, 1,
        -0.9 + offset, 0.2, 1.001,    0.25, 0.5, 1, 1,

        -0.5 + offset, -0.2, 1.001,    0.25, 0.5, 1, 1,
        -0.9 + offset, -0.2, 1.001,    0.25, 0.5, 1, 1,
        -0.9 + offset, 0.2, 1.001,    0.25, 0.5, 1, 1,

        // window right
        0.5 + offset, -0.2, 1.001,    0.25, 0.5, 1, 1,
        0.5 + offset, 0.2, 1.001,    0.25, 0.5, 1, 1,
        0.9 + offset, 0.2, 1.001,    0.25, 0.5, 1, 1,

        0.5 + offset, -0.2, 1.001,    0.25, 0.5, 1, 1,
        0.9 + offset, -0.2, 1.001,    0.25, 0.5, 1, 1,
        0.9 + offset, 0.2, 1.001,    0.25, 0.5, 1, 1,
    ]
}

export function otherDecoration(offsetX, offsetY) {
    return [
        // window middle
        0.2 + offsetX, -0.2 + offsetY, 1.001,     0.25, 0.5, 1, 1,
        0.2 + offsetX, 0.2 + offsetY, 1.001,     0.25, 0.5, 1, 1,
        -0.2 + offsetX, 0.2 + offsetY, 1.001,     0.25, 0.5, 1, 1,

        0.2 + offsetX, -0.2 + offsetY, 1.001,     0.25, 0.5, 1, 1,
        -0.2 + offsetX, -0.2 + offsetY, 1.001,     0.25, 0.5, 1, 1,
        -0.2 + offsetX, 0.2 + offsetY, 1.001,     0.25, 0.5, 1, 1,

        // window left
        -0.5 + offsetX, -0.2 + offsetY, 1.001,    0.25, 0.5, 1, 1,
        -0.5 + offsetX, 0.2 + offsetY, 1.001,    0.25, 0.5, 1, 1,
        -0.9 + offsetX, 0.2 + offsetY, 1.001,    0.25, 0.5, 1, 1,

        -0.5 + offsetX, -0.2 + offsetY, 1.001,    0.25, 0.5, 1, 1,
        -0.9 + offsetX, -0.2 + offsetY, 1.001,    0.25, 0.5, 1, 1,
        -0.9 + offsetX, 0.2 + offsetY, 1.001,    0.25, 0.5, 1, 1,

        // window right
        0.5 + offsetX, -0.2 + offsetY, 1.001,    0.25, 0.5, 1, 1,
        0.5 + offsetX, 0.2 + offsetY, 1.001,    0.25, 0.5, 1, 1,
        0.9 + offsetX, 0.2 + offsetY, 1.001,    0.25, 0.5, 1, 1,

        0.5 + offsetX, -0.2 + offsetY, 1.001,    0.25, 0.5, 1, 1,
        0.9 + offsetX, -0.2 + offsetY, 1.001,    0.25, 0.5, 1, 1,
        0.9 + offsetX, 0.2 + offsetY, 1.001,    0.25, 0.5, 1, 1,
    ]
}

export function garageDoor(offset) {
    return [
        // Door
        0.8 + offset, -1, 1.001,    0, 0, 0, 1,
        0.8 + offset, 0.2, 1.001,    0, 0, 0, 1,
        -0.8 + offset, 0.2, 1.001,    0, 0, 0, 1,

        0.8 + offset, -1, 1.001,    0, 0, 0, 1,
        -0.8 + offset, -1, 1.001,    0, 0, 0, 1,
        -0.8 + offset, 0.2, 1.001,    0, 0, 0, 1,
    ]
}

export function generateAFrameMesh(offset, height) {
    return [
        // front
        1 + offset, 0 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        0 + offset, 1 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1 + offset, 0 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A

        // back
        1 + offset, 0 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        0 + offset, 1 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1 + offset, 0 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A

        // side 1
        0 + offset, 1 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        1 + offset, 0 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        1 + offset, 0 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A

        0 + offset, 1 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        0 + offset, 1 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        1 + offset, 0 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A

        // side 2
        0 + offset, 1 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1 + offset, 0 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1 + offset, 0 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A

        0 + offset, 1 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        0 + offset, 1 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1 + offset, 0 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
    ]
}

export function generatePyramidMesh(offset, height) {
    return [
        // Bottom
        1 + offset, 0 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        1 + offset, 0 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1 + offset, 0 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A

        -1 + offset, 0 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1 + offset, 0 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        1 + offset, 0 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A

        // Front
        0 + offset, 1 + height, 0,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        1 + offset, 0 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1 + offset, 0 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A

        // Back
        0 + offset, 1 + height, 0,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        1 + offset, 0 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1 + offset, 0 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A

        // Left
        0 + offset, 1 + height, 0,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1 + offset, 0 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1 + offset, 0 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A

        // Right
        0 + offset, 1 + height, 0,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        1 + offset, 0 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        1 + offset, 0 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
    ]
}

export function generateFlatMesh(offset, height) {
    return [
        // Bottom
        1 + offset, 0 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        1 + offset, 0 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1 + offset, 0 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A

        -1 + offset, 0 + height, 1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        -1 + offset, 0 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A
        1 + offset, 0 + height, -1,    0.25, 0.25, 0.25, 1, // X Y Z R G B A

    ]
}

export function generateConeMesh(offset, height) {
    const segments = 20;
    const angleStep = (Math.PI * 2) / segments;
    let vertices = [];
    const radius = 1;
    
    for (let i = 0; i < segments; i++) {
        const angle = i * angleStep;
        const nextAngle = (i + 1) * angleStep;
        

        const centerX = 1;
        const centerZ = 1;

        // Base
        vertices.push(
            1 + offset - centerX,                                0 + height, 1 - centerZ,                                0.25, 0.25, 0.25, 1,
            1 + offset + radius * Math.cos(angle) - centerX,     0 + height, 1 + radius * Math.sin(angle) - centerZ,     0.25, 0.25, 0.25, 1,
            1 + offset + radius * Math.cos(nextAngle) - centerX, 0 + height, 1 + radius * Math.sin(nextAngle) - centerZ, 0.25, 0.25, 0.25, 1,
        );

        //sides
        vertices.push(
            1 + offset + radius * Math.cos(angle) - centerX,    0 + height, 1 + radius * Math.sin(angle) - centerZ, 0.25, 0.25, 0.25, 1,
            0 + offset,                                                 1 + height, 0,                                      0.25, 0.25, 0.25, 1,
            0 + offset,                                                 1 + height, 0,                                      0.25, 0.25, 0.25, 1,


            1 + offset + radius * Math.cos(angle) - centerX,     0 + height, 1 + radius * Math.sin(angle) - centerZ,     0.25, 0.25, 0.25, 1,
            0 + offset,                                                   1 + height, 0,                                          0.25, 0.25, 0.25, 1,
            1 + offset + radius * Math.cos(nextAngle)- centerX,  0 + height, 1 + radius * Math.sin(nextAngle) - centerZ, 0.25, 0.25, 0.25, 1,
        );
    }
    return vertices;
}


export function generateCylinderMesh(radius, height, segments, x = 0, y = 0, z = 0, r = 0, g = 0, b = 0) {
    const angleStep = (Math.PI * 2) / segments;
    let vertices = [];
    
    for (let i = 0; i < segments; i++) {
        const angle = i * angleStep;
        const nextAngle = (i + 1) * angleStep;

        vertices.push(
            x, height + y, z, r, g, b, 1,
            x + radius * Math.cos(angle), height + y, z + radius * Math.sin(angle), r, g, b, 1,
            x + radius * Math.cos(nextAngle), height + y, z + radius * Math.sin(nextAngle), r, g, b, 1,
        );

        vertices.push(
            x, y, z,  r, g, b, 1,
            x + radius * Math.cos(angle), y, z + radius * Math.sin(angle), r, g, b, 1,
            x + radius * Math.cos(nextAngle), y, z + radius * Math.sin(nextAngle), r, g, b, 1,
        );

        vertices.push(
            x + radius * Math.cos(angle), y, z + radius * Math.sin(angle), r, g, b, 1,
            x + radius * Math.cos(angle), height + y, z + radius * Math.sin(angle), r, g, b, 1,
            x + radius * Math.cos(nextAngle), height + y, z + radius * Math.sin(nextAngle), r, g, b, 1,

            x + radius * Math.cos(angle), y, z + radius * Math.sin(angle), r, g, b, 1,
            x + radius * Math.cos(nextAngle), height + y, z + radius * Math.sin(nextAngle), r, g, b, 1,
            x + radius * Math.cos(nextAngle), y, z + radius * Math.sin(nextAngle), r, g, b, 1,
        );
    }
    return new Float32Array(vertices);
}