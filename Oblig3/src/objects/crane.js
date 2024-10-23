import * as THREE from "three";
import { ri } from "../script";

export const VW = 300; // vehicle width
export const BH = 50; // base height
export const WB = 1000; // wheelbase lenght
export const CaL = 200; // cab lenght
export const CaW = VW/3; // cab width
export const CaH = 100; // cab height
export const WinH = 100 * 0.6; // window height
export const WW = 50; // wheel width
export const VL = WB + CaL; // vehicle lenght
export const WR = 150/2 // wheel radius

export const ORL = 200; // outrigger lenght
export const ORW = 20; // width of outrigger legs

export const CL = 800; // crane lenght
export const CW = 60; // crane width

export let maxExtention = 0;
export let minExtention = 0;




export function createVehichleMesh(textureObjects, envMap) {
    const crane = new THREE.Group();
    let MetalMaterial = new THREE.MeshStandardMaterial({
        color: 0xfcfcfc,
        normalMap: textureObjects[3],
        metalness: 1,
        roughness: 0.25,
        envMap: envMap,
    });
    let glassMaterial = new THREE.MeshStandardMaterial({
        color: 0x90e1f5,
        opacity: 0.8,
        transparent: true,
        metalness: 1,
        roughness: 0.01,
        envMap: envMap,
    })
    let tierFrontMaterial = new THREE.MeshStandardMaterial({
        map: textureObjects[0]
    });
    let tierSidesMaterial = new THREE.MeshStandardMaterial({
        map: textureObjects[1]
    });
    let bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xfcfcfc,
        roughness: 0.5,
        envMap: envMap,
    });
    let redMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.5,
        envMap: envMap,
    });

    tierSidesMaterial.map.wrapS = THREE.RepeatWrapping; 
    tierSidesMaterial.map.wrapT = THREE.RepeatWrapping; 
    tierSidesMaterial.map.repeat.set(5, 1); 
    tierSidesMaterial.map.needsUpdate = true;

    const craneBase = createBaseMesh(MetalMaterial);
    crane.add(craneBase);

    let wheelbase = crane.getObjectByName("wheelbase");
    let firstWheel = ((VL-CaL*3) - WR*2) - 50; // litt magisk nummer :P

    let wheels = new THREE.Group();
    wheels.name = "wheels";
    wheels.speedKmph = 20; // 
    let wheelPairPositions = [
        firstWheel, firstWheel - WR*2,

        firstWheel - (WR*2)*3, firstWheel - (WR*2)*4, firstWheel - (WR*2)*5
    ]
    for (let i = 0; i < wheelPairPositions.length; i++) {
        let wheelPairMesh = createWheelPairMesh(tierSidesMaterial, tierFrontMaterial);
        wheelPairMesh.position.x = wheelPairPositions[i];
        wheelPairMesh.name = `wheelPair${i}`
        
        wheels.add(wheelPairMesh);
    }
    wheelbase.add(wheels)
    let outriggerPair1 = createOutriggerPair(MetalMaterial);
    outriggerPair1.position.x = firstWheel - (WR*2)*2
    outriggerPair1.name = "outriggerPair1"
    wheelbase.add(outriggerPair1)

    let outriggerPair2 = createOutriggerPair(MetalMaterial);
    outriggerPair2.position.x = (firstWheel - (WR*2)*6) + 30
    outriggerPair2.name = "outriggerPair2"
    wheelbase.add(outriggerPair2)

    let cabBase = crane.getObjectByName("cabBase");
    let cab = createCabMesh(MetalMaterial, glassMaterial);
    cab.position.y = (BH/2)
    cab.position.z -= CaH
    cabBase.add(cab)

    let gCover = new THREE.BoxGeometry(CaL, (CaH - WinH) * 0.4 , (CaW * 2))
    let cover = new THREE.Mesh(gCover, redMaterial);
    cover.position.y = ((CaH - WinH) * 0.4)/2 + BH/2
    cover.position.z += CaW/2
    cabBase.add(cover)

    addHeadLights(cabBase)

    let platform = createPlatformMesh(bodyMaterial);
    platform.position.y += BH
    wheelbase.add(platform)
    let platformTop = crane.getObjectByName("top")

    let craneUnit = createCraneMesh(MetalMaterial, bodyMaterial, glassMaterial);
    craneUnit.position.y = 10
    craneUnit.position.x = firstWheel - (WR*2)*4

    platformTop.add(craneUnit)


    console.log(crane)
    crane.name = "vehicle"
    return crane
}

function createCraneMesh(metalMat, bodyMat, glassMat) {
    let crane = new THREE.Group();

    const CPH = 10;
    const baseW = CW + 30;
    const hookW = 60;

    let gCranePlatform = new THREE.BoxGeometry(VW, CPH, VW);
    let cranePlatform = new THREE.Mesh(gCranePlatform, bodyMat);
    cranePlatform.castShadow = true;
    crane.add(cranePlatform);

    let craneCab = createCabMesh(metalMat, glassMat);
    craneCab.position.y = CPH/2;
    craneCab.position.z -= CaH;
    craneCab.position.x = (CaL) - VW/2;
    cranePlatform.add(craneCab);

    let gCraneBase = new THREE.BoxGeometry(baseW, baseW, baseW);
    let craneBase = new THREE.Mesh(gCraneBase, bodyMat);
    craneBase.castShadow = true;
    craneBase.position.z = (VW/3) - baseW/2
    craneBase.position.y = (VW/3) - baseW/2
    craneBase.position.x = -((VW/2) - baseW/2)
    cranePlatform.add(craneBase)

    let craneArmGroup = new THREE.Group();
    craneArmGroup.name = "craneArm"

    let gCraneArm = new THREE.BoxGeometry(CL, CW, CW);
    let craneArm = new THREE.Mesh(gCraneArm, bodyMat);
    craneArm.castShadow = true;
    craneArm.position.x = CL/2
    craneArm.position.y = 5
    craneBase.add(craneArmGroup)
    craneArmGroup.add(craneArm)

    let gCraneExtender = new THREE.BoxGeometry(CL + hookW, CW - 20, CW - 20);
    let craneExtender = new THREE.Mesh(gCraneExtender, metalMat);
    craneExtender.castShadow = true;
    craneExtender.name = "craneExtender";
    craneExtender.position.x += hookW/2

    craneArm.add(craneExtender)
    
    maxExtention = CL;
    minExtention = hookW/2;

    let hook = createHookMesh(metalMat);
    hook.name = "hookPoint"
    hook.position.x = CL/2;
    craneExtender.add(hook)

    addCamera(hook)
    
    crane.name = "crane"
    return crane
}

function addCamera(parent) { 
    const POVCointainer = document.getElementById("pov");
    const canvas = document.createElement("canvas");
    POVCointainer.appendChild(canvas);
    ri.pov = new THREE.WebGLRenderer({canvas: canvas, antialias: true});

    ri.pov.shadowMap.enabled = true; //NB!
	ri.pov.shadowMapSoft = true;
	ri.pov.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap;

    ri.POVCamera = new THREE.PerspectiveCamera(74, window.innerWidth / window.innerHeight, 0.1, 10000);
    ri.POVCamera.position.x = 10;
	ri.POVCamera.position.y = 0;
	ri.POVCamera.position.z = 0;
	ri.POVCamera.up = new THREE.Vector3(0, 1, 0);
	let target = new THREE.Vector3(0.0, -50, 0.0);
	ri.POVCamera.lookAt(target);
    parent.add(ri.POVCamera)
}

function addHeadLights(cabBase) {
    let sLightLeft = new THREE.SpotLight(0xFFBF00, 0.5, 500, Math.PI*0.3, 0, 0)
	sLightLeft.castShadow = true;
	sLightLeft.shadow.camera.near = 10;
	sLightLeft.shadow.camera.far = 30;
    sLightLeft.position.set(CaW, 0, -CaL/2)
    sLightLeft.target.position.set(sLightLeft.position.x +1, sLightLeft.position.y, sLightLeft.position.z)
    sLightLeft.target.position.x += 1
    const sLightLeftHelper = new THREE.SpotLightHelper( sLightLeft );
    cabBase.add(sLightLeft.target)
    cabBase.add(sLightLeft)
    cabBase.add(sLightLeftHelper)

    let sLightRight = new THREE.SpotLight(0xFFBF00, 0.5, 500, Math.PI*0.3, 0, 0)
	sLightRight.castShadow = true;
	sLightRight.shadow.camera.near = 10;
	sLightRight.shadow.camera.far = 30;
    sLightRight.position.set(CaW, 0, CaL/2)
    sLightRight.target.position.set(sLightRight.position.x +1, sLightRight.position.y, sLightRight.position.z)
    sLightRight.target.position.x += 1
    const sLightRightHelper = new THREE.SpotLightHelper( sLightRight );
    cabBase.add(sLightRight.target)
    cabBase.add(sLightRight)
    cabBase.add(sLightRightHelper)
}

function createHookMesh(mat) {
    const hookPoint = new THREE.Group();

    let gHook = new THREE.TorusKnotGeometry(10, 5, 20, 8, 6, 3)
    let hook = new THREE.Mesh(gHook, mat)
    hook.name = "hook";
    hook.castShadow = true;
    hook.position.y -= 50
    hookPoint.add(hook)

    let points = [hookPoint.position.clone(), hook.position.clone()];
    let gRope = new THREE.BufferGeometry().setFromPoints(points);
    let ropeMat = new THREE.LineBasicMaterial({ color: 0x000000 })
    let rope = new THREE.Line(gRope, ropeMat);
    hookPoint.add(rope)

    hookPoint.updateRope = () => {
        rope.geometry.setFromPoints([new THREE.Vector3(), hook.position.clone()])
    }

    return hookPoint;
}

function createPlatformMesh(mat) {
    const platform = new THREE.Group();
    const topH = 10;

    let gBody = new THREE.BoxGeometry(WB, BH, VW - WW*2);
    let body = new THREE.Mesh(gBody, mat);
    body.castShadow = true;
    body.name = "body";
    platform.add(body);

    let gTop= new THREE.BoxGeometry(WB, topH, VW);
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

    let gBase = new THREE.BoxGeometry(CaL - BackWidth, (CaH - WinH) * 0.4 , CaW)
    let base = new THREE.Mesh(gBase, bodyMat);
    base.position.x += CaW/3
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
    leftFoot.position.z -= VW - WW*2

    outriggerPair.add(leftFoot)

    let rightFoot = createOutriggerFoot(mat);
    rightFoot.name = "RightFoot"
    rightFoot.position.z += VW - WW*2
    rightFoot.rotateY(Math.PI)

    outriggerPair.add(rightFoot)


    return outriggerPair
}

function createOutriggerFoot(mat) {
    const outriggerFoot = new THREE.Group();

    let gBar = new THREE.BoxGeometry(ORW, ORW, ORL);
    let bar = new THREE.Mesh(gBar, mat);
    bar.castShadow = true;
    bar.name = "bar"
    outriggerFoot.add(bar);
    
    let gFoot = new THREE.CylinderGeometry((ORW/2) - 2, (ORW/2) - 2, WW + BH/2, 20);
    let foot = new THREE.Mesh(gFoot, mat);
    foot.position.z -= (ORL/2) - 10
    foot.position.y -= (WW + BH/2)/2
    foot.castShadow = true
    foot.name = "foot"
    bar.add(foot)

    bar.extendedZ = bar.position.z
    foot.extendedY = foot.position.y
    outriggerFoot.currentState = 1.0;

    return outriggerFoot
}

function createWheelPairMesh(sideTexture, frontTexture) {
    const wheelPair = new THREE.Group();

    const leftWheel = createWheel(sideTexture, frontTexture);
    leftWheel.position.z -= (VW - WW) / 2; 
    wheelPair.add(leftWheel);

    const rightWheel = createWheel(sideTexture, frontTexture);
    rightWheel.position.z += (VW - WW) / 2; 
    wheelPair.add(rightWheel);

    return wheelPair;
}

function createWheel(sideMaterial, frontMaterial) {
    const wheelGroup = new THREE.Group();
    
    const sideGeometry = new THREE.CylinderGeometry(WR, WR, WW, 20, 20, true);
    const sideCylinder = new THREE.Mesh(sideGeometry, sideMaterial);
    sideCylinder.castShadow = true;
    sideCylinder.name = "wheelSides";
    sideCylinder.rotateX(Math.PI / 2); 

    const frontGeometry = new THREE.CircleGeometry(WR, 20);
    const frontDisc = new THREE.Mesh(frontGeometry, frontMaterial);
    frontDisc.castShadow = true;
    frontDisc.name = "wheelFront";
    frontDisc.position.z = (WW/2)

    const backGeometry = new THREE.CircleGeometry(WR, 20);
    const backDisc = new THREE.Mesh(backGeometry, frontMaterial);
    backDisc.castShadow = true;
    backDisc.name = "wheelback";
    backDisc.position.z = -(WW/2)
    backDisc.rotateY(Math.PI)

    wheelGroup.add(sideCylinder);
    wheelGroup.add(frontDisc);
    wheelGroup.add(backDisc);

    return wheelGroup;
}


function createBaseMesh(mat) {
    const base = new THREE.Group();

    let gB1 = new THREE.BoxGeometry(VL - WB, BH, VW);
    let B1 = new THREE.Mesh(gB1, mat)
    B1.castShadow = true;
    B1.name = "cabBase"

    let gB2 = new THREE.BoxGeometry(WB, BH, VW - WW*2);
    let B2 = new THREE.Mesh(gB2, mat);
    B2.castShadow = true;
    B2.name = "wheelbase"

   
    B2.position.x = - (VL / 2) + (WB / 2);


    B1.position.x = B2.position.x + (WB / 2) + (VL - WB) / 2;

    base.add(B1);
    base.add(B2);

    base.position.y = WR;
    return base
}