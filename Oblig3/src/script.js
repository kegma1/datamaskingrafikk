import './style.css';
import * as THREE from "three";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { addCoordSystem } from "../static/lib/wfa-coord"
import { createGroundMesh } from './objects/ground';
import { createVehichleMesh, maxExtention , minExtention, WR} from './objects/crane';
import tierFrontTexture from '../static/tierFront.png'; 
import tierSideTexture from '../static/tier.jpg'; 

const speedometer = document.getElementById("speed");

const ri = {
    currentlyPressedKeys: []
}

function handleKeyDown(event) {
    ri.currentlyPressedKeys[event.code] = true;
}

function handleKeyUp(event) {
    ri.currentlyPressedKeys[event.code] = false;
}

export function main() {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    ri.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    ri.renderer.setSize(window.innerWidth, window.innerHeight);
    // ri.renderer.setClearColor(0xBFD104, 0xff);  //farge, alphaverdi.
	ri.renderer.shadowMap.enabled = true; //NB!
	ri.renderer.shadowMapSoft = true;
	ri.renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap;


    ri.scene = new THREE.Scene();
	ri.scene.background = new THREE.Color( 0xdddddd );

    addLights();


    // ri.lilGui = new GUI();

    ri.camera = new THREE.PerspectiveCamera(74, window.innerWidth / window.innerHeight, 0.1, 10000);
    ri.camera.position.x = 230;
	ri.camera.position.y = 400;
	ri.camera.position.z = 350;
	ri.camera.up = new THREE.Vector3(0, 1, 0);
	let target = new THREE.Vector3(0.0, 0.0, 0.0);
	ri.camera.lookAt(target);


    ri.controls = new TrackballControls(ri.camera, ri.renderer.domElement);
    ri.controls.addEventListener("change", renderScene);

    ri.clock = new THREE.Clock();

    window.addEventListener("resize", onWindowResize, false);

    document.addEventListener('keyup', handleKeyUp, false); 

    document.addEventListener('keydown', handleKeyDown, false);

    addSceneObjects();
}

function addSceneObjects() {
    addCoordSystem(ri.scene);

    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);
    const textureObjects = [];

    textureObjects[0] = textureLoader.load(tierFrontTexture)
    textureObjects[1] = textureLoader.load(tierSideTexture)

    loadingManager.onLoad = () => {
        ri.scene.add(createGroundMesh());
        ri.scene.add(createVehichleMesh(textureObjects));
        speedometer.innerText = `${ri.scene.getObjectByName("wheels").speedKmph.toFixed(2)} Km/t`
        animate(0)
    }

	
}


function addLights() {
	//Retningsorientert lys (som gir skygge):
	let directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0); //farge, intensitet (1=default)
	directionalLight1.position.set(200, 300, 200);
	directionalLight1.castShadow = true;

	// Viser lyskilden:
	const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight1, 10, 0xff0000);
	directionalLightHelper.visible = true;
	ri.scene.add(directionalLightHelper);
	// Setter verdier til shadow camera:
	directionalLight1.shadow.camera.near = 0;
	directionalLight1.shadow.camera.far = 4000;
	directionalLight1.shadow.camera.left = -4000;
	directionalLight1.shadow.camera.right = 4000;
	directionalLight1.shadow.camera.top = 4000;
	directionalLight1.shadow.camera.bottom = -4000;
	//Hjelpeklasse for å vise lysets utstrekning:
	let lightCamHelper = new THREE.CameraHelper( directionalLight1.shadow.camera );
	lightCamHelper.visible = false;
	ri.scene.add( lightCamHelper );

	ri.scene.add(directionalLight1);
}

  
function animate(currentTime) {
    window.requestAnimationFrame((currentTime) => {
        animate(currentTime);
    });
    const crane = ri.scene.getObjectByName("crane")
    const arm = crane.getObjectByName("craneArm")
    const armExtender = arm.getObjectByName("craneExtender")
    const hookPoint = armExtender.getObjectByName("hookPoint")
    const hook = hookPoint.getObjectByName("hook")
    const outriggers = [ri.scene.getObjectByName("outriggerPair1"), ri.scene.getObjectByName("outriggerPair2")]
    const wheels = ri.scene.getObjectByName("wheels");
    
    let delta = ri.clock.getDelta();
    let elapsed = ri.clock.getElapsedTime();

    let speedMps = wheels.speedKmph / 3.6;
    let angularVelocity = speedMps / (WR/100);

    for (const wheelPair of wheels.children) {
        for (const wheel of wheelPair.children) {
            wheel.rotation.z -= angularVelocity * delta
        }
    }


    ri.controls.update();

    handleKeys(delta, crane, arm, armExtender, outriggers, wheels, hookPoint, hook);
    renderScene();
}

function renderScene() {
    ri.renderer.render(ri.scene, ri.camera);
}

function handleKeys(delta, crane, arm, armExtender, outriggers, wheels, hookPoint, hook) {
    let rotationSpeed = (Math.PI);
    let exstendSpeed = 400;
    let steeringSpeed = (Math.PI);
    let hookSpeed = 200
    let minHeight = 175.0

    const steeringWheels = [wheels.children[0], wheels.children[1]];

    let hookWorldPos = hook.getWorldPosition(new THREE.Vector3());

    if (hookWorldPos.y < minHeight) {
        const offset = minHeight - hookWorldPos.y;
    
        hook.position.y += offset;
    }
    
    // rotate crane
    if (ri.currentlyPressedKeys['KeyA']) { 
        crane.rotation.y  = crane.rotation.y + (rotationSpeed * delta);
        crane.rotation.y  %= (Math.PI * 2);  
	}
    if (ri.currentlyPressedKeys['KeyD']) { 
        crane.rotation.y  = crane.rotation.y - (rotationSpeed * delta);
        crane.rotation.y  %= (Math.PI * 2);  
	}

    // Lift crane arm
    if (ri.currentlyPressedKeys['KeyW']) { 
        arm.rotation.z  = arm.rotation.z + (rotationSpeed * delta);
        arm.rotation.z  %= (Math.PI * 2); 
        arm.rotation.z = Math.min(arm.rotation.z, Math.PI/6) 

        hookPoint.rotation.z  = hookPoint.rotation.z - (rotationSpeed * delta);
        hookPoint.rotation.z  %= (Math.PI * 2); 
        hookPoint.rotation.z = Math.max(hookPoint.rotation.z, -Math.PI/6) 
	}
    if (ri.currentlyPressedKeys['KeyS']) { 
        arm.rotation.z  = arm.rotation.z - (rotationSpeed * delta);
        arm.rotation.z  %= (Math.PI * 2);  
        arm.rotation.z = Math.max(arm.rotation.z, 0) 

        hookPoint.rotation.z  = hookPoint.rotation.z + (rotationSpeed * delta);
        hookPoint.rotation.z  %= (Math.PI * 2); 
        hookPoint.rotation.z = Math.min(hookPoint.rotation.z, 0) 
	}

    // exstend arm
    if (ri.currentlyPressedKeys['ShiftLeft']) { 
        armExtender.position.x  = armExtender.position.x + (exstendSpeed * delta);
        armExtender.position.x = Math.min(armExtender.position.x, maxExtention)  
	}
    if (ri.currentlyPressedKeys['ControlLeft']) { 
        armExtender.position.x  = armExtender.position.x - (exstendSpeed * delta);
        armExtender.position.x = Math.max(armExtender.position.x, minExtention) 
	}

    // extend outrigs
    if (ri.currentlyPressedKeys['KeyR']) {
        for (const outrigger of outriggers) {
            for (const leg of outrigger.children) {
                if (leg.currentState == 0.0) continue;
                let bar = leg.children[0]
                let foot = bar.children[0]

                if (leg.currentState > 0.75) {
                    foot.position.y = foot.position.y + (exstendSpeed * delta)
                    foot.position.y = Math.min(foot.position.y, -foot.extendedY)
                } else {
                    bar.position.z = bar.position.z + (exstendSpeed * delta)
                    bar.position.z = Math.min(bar.position.z, 180)
                }
                leg.currentState -= 1.0 * delta
                leg.currentState = THREE.MathUtils.clamp(leg.currentState, 0, 1)
            }            
        }
    }
    if (ri.currentlyPressedKeys['KeyF']) { 
        for (const outrigger of outriggers) {
            for (const leg of outrigger.children) {
                if (leg.currentState == 1.0) continue;
                let bar = leg.children[0]
                let foot = bar.children[0]

                if (leg.currentState < 0.75) {
                    bar.position.z = bar.position.z - (exstendSpeed * delta)
                    bar.position.z = Math.max(bar.position.z, bar.extendedZ)
                } else {
                    foot.position.y = foot.position.y - (exstendSpeed * delta)
                    foot.position.y = Math.max(foot.position.y, foot.extendedY)
                }
                leg.currentState += 1.0 * delta
                leg.currentState = THREE.MathUtils.clamp(leg.currentState, 0, 1)
            }            
        }
    }

    // change speed
    if (ri.currentlyPressedKeys['ArrowUp']) {
        wheels.speedKmph += 50 *delta
        speedometer.innerText = `${wheels.speedKmph.toFixed(2)} Km/t`
    }
    if (ri.currentlyPressedKeys['ArrowDown']) { 
        wheels.speedKmph -= 50 *delta
        speedometer.innerText = `${wheels.speedKmph.toFixed(2)} Km/t`
    }

    // swinging
    if (ri.currentlyPressedKeys['ArrowLeft']) {
        for (const wheelPair of steeringWheels) {
            for (const wheel of wheelPair.children) {
                wheel.rotation.y = wheel.rotation.y + (steeringSpeed * delta);
                wheel.rotation.y = Math.min(wheel.rotation.y, Math.PI/6);
            }
        }
    }
    if (ri.currentlyPressedKeys['ArrowRight']) { 
        for (const wheelPair of steeringWheels) {
            for (const wheel of wheelPair.children) {
                wheel.rotation.y = wheel.rotation.y - (steeringSpeed * delta);
                wheel.rotation.y = Math.max(wheel.rotation.y, -Math.PI/6);
            }
        }
    }

    if (ri.currentlyPressedKeys['KeyQ']) {
        if (hookWorldPos.y > minHeight) {
            hook.position.y = hook.position.y - (hookSpeed * delta)
        }
    }
    if (ri.currentlyPressedKeys['KeyE']) { 
        hook.position.y = hook.position.y + (hookSpeed * delta)
        hook.position.y = Math.min(hook.position.y, -50)
    }
    
    hookPoint.updateRope()
}

function onWindowResize() {
	ri.camera.aspect = window.innerWidth / window.innerHeight;
	ri.camera.updateProjectionMatrix();
	ri.renderer.setSize(window.innerWidth, window.innerHeight);
	ri.controls.handleResize();
	renderScene();
}
