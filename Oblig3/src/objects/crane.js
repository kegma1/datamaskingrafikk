import * as THREE from "three";

const CW = 300; // crane width
const BH = 50; // base height
const WB = 1000; // wheelbase lenght
const CaL = 200; // cab lenght
const CaW = CW/3; // cab width
const CaH = 100; // cab height
const WinH = 100 * 0.6; // window height
const WW = 50; // wheel width
const CL = WB + CaL; // crane lenght
const WR = 150/2 // wheel radius

const ORL = 200; // outrigger lenght
const ORW = 20; // width of outrigger legs



export function createCraneMesh(textureObjects) {
    const crane = new THREE.Group();
    let MetalMaterial = new THREE.MeshStandardMaterial({
        color: 0xc0c0c0,
        metalness: 1,
        roughness: 0.5,
    });
    let glassMaterial = new THREE.MeshStandardMaterial({
        color: 0x90e1f5,
        opacity: 0.7,
        transparent: true,
    })
    let tierFrontMaterial = new THREE.MeshStandardMaterial({
        map: textureObjects[0]
    });
    let tierSidesMaterial = new THREE.MeshStandardMaterial({
        map: textureObjects[1]
    });
    let bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xfcfcfc,
        metalness: 0,
        roughness: 0.25,
    });

    tierSidesMaterial.map.wrapS = THREE.RepeatWrapping; 
    tierSidesMaterial.map.wrapT = THREE.RepeatWrapping; 
    tierSidesMaterial.map.repeat.set(5, 1); 
    tierSidesMaterial.map.needsUpdate = true;

    const craneBase = createBaseMesh(MetalMaterial);
    crane.add(craneBase);

    let wheelbase = crane.getObjectByName("wheelbase");
    let firstWheel = ((CL-CaL*3) - WR*2) - 50; // litt magisk nummer :P

    let wheelPairPositions = [
        firstWheel, firstWheel - WR*2,

        firstWheel - (WR*2)*3, firstWheel - (WR*2)*4, firstWheel - (WR*2)*5
    ]
    for (let i = 0; i < wheelPairPositions.length; i++) {
        let wheelPairMesh = createWheelPairMesh(tierSidesMaterial, tierFrontMaterial);
        wheelPairMesh.position.x = wheelPairPositions[i];
        wheelPairMesh.name = `wheelPair${i}`
        
        wheelbase.add(wheelPairMesh);
    }

    let outriggerPair1 = createOutriggerPair(MetalMaterial);
    outriggerPair1.position.x = firstWheel - (WR*2)*2
    outriggerPair1.name = "outriggerPair1"
    wheelbase.add(outriggerPair1)

    let outriggerPair2 = createOutriggerPair(MetalMaterial);
    outriggerPair2.position.x = (firstWheel - (WR*2)*6) + 30
    outriggerPair2.name = "outriggerPair2"
    wheelbase.add(outriggerPair2)

    let cabBase = crane.getObjectByName("cabBase");
    let cab = createCabMesh(bodyMaterial, glassMaterial);
    cab.position.y = (BH/2)
    cab.position.z -= CaH
    cabBase.add(cab)

    let platform = createPlatformMesh(bodyMaterial);
    platform.position.y += BH
    wheelbase.add(platform)
    let platformTop = crane.getObjectByName("top")

    console.log(crane)
    return crane
}

function createPlatformMesh(mat) {
    const platform = new THREE.Group();
    const topH = 10;

    let gBody = new THREE.BoxGeometry(WB, BH, CW - WW*2);
    let body = new THREE.Mesh(gBody, mat);
    body.castShadow = true;
    body.name = "body";
    platform.add(body);

    let gTop= new THREE.BoxGeometry(WB, topH, CW);
    let top = new THREE.Mesh(gTop, mat);
    top.castShadow = true;
    top.name = "top"
    top.position.y = (BH/2) + topH/2
    
    platform.add(top);

    return platform
}

function createCabMesh(bodyMat, glassMat) {
    const cab = new THREE.Group();

    const BackWidth = CaL/3;

    let gBase = new THREE.BoxGeometry(CaL, (CaH - WinH) * 0.4 , CaW*3)
    let base = new THREE.Mesh(gBase, bodyMat);
    base.position.z += (CaW*3)/3
    base.position.y = ((CaH - WinH) * 0.4)/2
    base.castShadow = true;
    cab.add(base)

    let gBack = new THREE.BoxGeometry(BackWidth, CaH, CaW);
    let back = new THREE.Mesh(gBack, bodyMat);
    back.position.x = -(CaL - BackWidth)/2;
    back.position.y = CaH/2;
    back.castShadow = true;
    cab.add(back)

    let gRoof = new THREE.BoxGeometry(BackWidth*2, (CaH - WinH) * 0.6, CaW)
    let roof = new THREE.Mesh(gRoof, bodyMat);
    roof.position.y = CaH - ((CaH - WinH) * 0.6)/2;
    roof.position.x = BackWidth/2
    roof.castShadow = true;
    cab.add(roof);

    let gSideWin = new THREE.BoxGeometry(BackWidth*2, WinH, CaW)
    let sideWin = new THREE.Mesh(gSideWin, glassMat);
    sideWin.position.y = WinH/2 + ((CaH - WinH) * 0.4)
    sideWin.position.x = BackWidth/2
    sideWin.castShadow = true;
    cab.add(sideWin)

    /*
        finner ingen god måte å lage en rampe på så det blir en ganske firkantet kabin
    */
    return cab
}

function createOutriggerPair(mat) {
    const outriggerPair = new THREE.Group();
    let leftFoot = createOutriggerFoot(mat);
    leftFoot.name = "LeftFoot"
    leftFoot.position.z -= CW - WW*2

    outriggerPair.add(leftFoot)

    let rightFoot = createOutriggerFoot(mat);
    rightFoot.name = "RightFoot"
    rightFoot.position.z += CW - WW*2
    rightFoot.rotateY(Math.PI)

    outriggerPair.add(rightFoot)


    return outriggerPair
}

function createOutriggerFoot(mat) {
    const outriggerFoot = new THREE.Group();

    let gBar = new THREE.BoxGeometry(ORW, ORW, ORL);
    let bar = new THREE.Mesh(gBar, mat);
    bar.castShadow = true;
    outriggerFoot.add(bar);
    
    let gFoot = new THREE.CylinderGeometry((ORW/2) - 2, (ORW/2) - 2, WW + BH/2, 20);
    let foot = new THREE.Mesh(gFoot, mat);
    foot.position.z -= (ORL/2) - 10
    foot.position.y -= (WW + BH/2)/2
    foot.castShadow = true
    bar.add(foot)

    return outriggerFoot
}

// function createWheelPairMesh(mat) {
//     const wheelPair = new THREE.Group();

//     let gWheel = new THREE.CylinderGeometry(WR, WR, WW, 20);
//     let leftWheel = new THREE.Mesh(gWheel, mat);
//     leftWheel.castShadow = true;
//     leftWheel.name = "leftWheel";

//     leftWheel.rotateX(Math.PI/2)
//     leftWheel.position.z -= (CW - WW)/2
//     wheelPair.add(leftWheel);

//     let rightWheel = new THREE.Mesh(gWheel, mat);
//     rightWheel.castShadow = true;
//     rightWheel.name = "rightWheel";

//     rightWheel.rotateX(Math.PI/2)
//     rightWheel.position.z += (CW - WW)/2
//     wheelPair.add(rightWheel)

//     return wheelPair
// }

function createWheelPairMesh(sideTexture, frontTexture) {
    const wheelPair = new THREE.Group();

    // Create the left wheel
    const leftWheel = createWheel(sideTexture, frontTexture);
    leftWheel.position.z -= (CW - WW) / 2; // Adjust position for left wheel
    wheelPair.add(leftWheel);

    // Create the right wheel
    const rightWheel = createWheel(sideTexture, frontTexture);
    rightWheel.position.z += (CW - WW) / 2; // Adjust position for right wheel
    wheelPair.add(rightWheel);

    return wheelPair;
}

function createWheel(sideMaterial, frontMaterial) {
    const wheelGroup = new THREE.Group();
    
    // Create the cylinder for the sides
    const sideGeometry = new THREE.CylinderGeometry(WR, WR, WW, 20, 20, true);
    const sideCylinder = new THREE.Mesh(sideGeometry, sideMaterial);
    sideCylinder.castShadow = true;
    sideCylinder.name = "wheelSides";
    sideCylinder.rotateX(Math.PI / 2); // Rotate to align with the ground

    // Create the front and back discs
    const frontGeometry = new THREE.CircleGeometry(WR, 20);
    const frontDisc = new THREE.Mesh(frontGeometry, frontMaterial);
    frontDisc.castShadow = true;
    frontDisc.name = "wheelFront";
    frontDisc.position.z = (WW/2)


    wheelGroup.add(sideCylinder);
    wheelGroup.add(frontDisc);

    return wheelGroup;
}


function createBaseMesh(mat) {
    const base = new THREE.Group();

    let gB1 = new THREE.BoxGeometry(CL - WB, BH, CW);
    let B1 = new THREE.Mesh(gB1, mat)
    B1.castShadow = true;
    B1.name = "cabBase"

    let gB2 = new THREE.BoxGeometry(WB, BH, CW - WW*2);
    let B2 = new THREE.Mesh(gB2, mat);
    B2.castShadow = true;
    B2.name = "wheelbase"

   
    B2.position.x = - (CL / 2) + (WB / 2);


    B1.position.x = B2.position.x + (WB / 2) + (CL - WB) / 2;

    base.add(B1);
    base.add(B2);

    base.position.y = WR;
    return base
}