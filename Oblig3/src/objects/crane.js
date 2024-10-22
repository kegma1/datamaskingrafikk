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



export function createCraneMesh() {
    const crane = new THREE.Group();
    let material = new THREE.MeshPhongMaterial();
    let glassMaterial = new THREE.MeshLambertMaterial({
        color: 0x90e1f5,
        opacity: 0.7,
        transparent: true,
        reflectivity: true,
    })

    const craneBase = createBaseMesh(material);
    crane.add(craneBase);

    let wheelbase = crane.getObjectByName("wheelbase");
    let firstWheel = ((CL-CaL*3) - WR*2) - 50; // litt magisk nummer :P

    let wheelPairPositions = [
        firstWheel, firstWheel - WR*2,

        firstWheel - (WR*2)*3, firstWheel - (WR*2)*4, firstWheel - (WR*2)*5
    ]
    for (let wheelPairPos of wheelPairPositions) {
        let wheelPairMesh = createWheelPairMesh(material);
        wheelPairMesh.position.x = wheelPairPos;
        
        wheelbase.add(wheelPairMesh);
    }

    let outriggerPair1 = createOutriggerPair(material);
    outriggerPair1.position.x = firstWheel - (WR*2)*2
    wheelbase.add(outriggerPair1)

    let cabBase = crane.getObjectByName("cabBase");
    let cab = createCabMesh(material, glassMaterial);
    cab.position.y = (BH/2)
    cab.position.z -= CaH
    cabBase.add(cab)

    return crane
}

function createCabMesh(bodyMat, glassMat) {
    const cab = new THREE.Group();

    const BackWidth = CaL/3;

    let gBase = new THREE.BoxGeometry(CaL - BackWidth, (CaH - WinH) * 0.4 , CaW)
    let base = new THREE.Mesh(gBase, bodyMat);
    base.position.x += BackWidth/2
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

    return outriggerPair
}

function createWheelPairMesh(mat) {
    const wheelPair = new THREE.Group();

    let gWheel = new THREE.CylinderGeometry(WR, WR, WW, 20);
    let leftWheel = new THREE.Mesh(gWheel, mat);
    leftWheel.castShadow = true;
    leftWheel.name = "leftWheel";

    leftWheel.rotateX(Math.PI/2)
    leftWheel.position.z -= (CW - WW)/2
    wheelPair.add(leftWheel);

    let rightWheel = new THREE.Mesh(gWheel, mat);
    rightWheel.castShadow = true;
    rightWheel.name = "rightWheel";

    rightWheel.rotateX(Math.PI/2)
    rightWheel.position.z += (CW - WW)/2
    wheelPair.add(rightWheel)

    return wheelPair
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