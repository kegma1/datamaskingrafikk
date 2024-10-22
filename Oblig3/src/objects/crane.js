import * as THREE from "three";

const BH = 50; // base height
const WB = 1000; // wheelbase lenght
const CaL = 200; // cab lenght
const WW = 50; // wheel width
const CL = WB + CaL; // crane lenght
const CW = 300; // crane width
const WR = 150/2 // wheel radius


export function createCraneMesh() {
    const crane = new THREE.Group();
    let material = new THREE.MeshPhongMaterial();

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

    return crane
}

function createWheelPairMesh(mat) {
    const wheelPair = new THREE.Group();

    let gWheel = new THREE.CylinderGeometry(WR, WR, WW, 20);
    let leftWheel = new THREE.Mesh(gWheel, mat);
    leftWheel.rotateX(Math.PI/2)
    leftWheel.position.z -= (CW - WW)/2
    wheelPair.add(leftWheel);

    let rightWheel = new THREE.Mesh(gWheel, mat);
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