import './style.css';
import * as THREE from "three";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { addCoordSystem } from "../static/lib/wfa-coord"
import { createGroundMesh } from './objects/ground';
import { createVehichleMesh, maxExtention , minExtention} from './objects/crane';
import tierFrontTexture from '../static/tierFront.png'; 
import tierSideTexture from '../static/tier.jpg'; 

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
	directionalLight1.shadow.camera.far = 401;
	directionalLight1.shadow.camera.left = -250;
	directionalLight1.shadow.camera.right = 250;
	directionalLight1.shadow.camera.top = 250;
	directionalLight1.shadow.camera.bottom = -250;
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

    let delta = ri.clock.getDelta();
    let elapsed = ri.clock.getElapsedTime();

    ri.controls.update();

    handleKeys(delta, ri.scene);
    renderScene();
}

function renderScene() {
    ri.renderer.render(ri.scene, ri.camera);
}

function handleKeys(delta, scene) {
    let rotationSpeed = (Math.PI);
    let exstendSpeed = 400;
    const crane = scene.getObjectByName("crane")
    const arm = crane.getObjectByName("craneArm")
    const armExtender = arm.getObjectByName("craneExtender")
    
    // rotate crane
    if (ri.currentlyPressedKeys['ArrowLeft']) { 
        crane.rotation.y  = crane.rotation.y + (rotationSpeed * delta);
        crane.rotation.y  %= (Math.PI * 2);  
	}
    if (ri.currentlyPressedKeys['ArrowRight']) { 
        crane.rotation.y  = crane.rotation.y - (rotationSpeed * delta);
        crane.rotation.y  %= (Math.PI * 2);  
	}

    // Lift crane arm
    if (ri.currentlyPressedKeys['ArrowUp']) { 
        arm.rotation.z  = arm.rotation.z + (rotationSpeed * delta);
        arm.rotation.z  %= (Math.PI * 2); 
        arm.rotation.z = Math.min(arm.rotation.z, Math.PI/2) 
	}
    if (ri.currentlyPressedKeys['ArrowDown']) { 
        arm.rotation.z  = arm.rotation.z - (rotationSpeed * delta);
        arm.rotation.z  %= (Math.PI * 2);  
        arm.rotation.z = Math.max(arm.rotation.z, 0) 
	}

    // exstend arm
    if (ri.currentlyPressedKeys['ShiftRight']) { 
        armExtender.position.x  = armExtender.position.x + (exstendSpeed * delta);
        armExtender.position.x = Math.min(armExtender.position.x, maxExtention)  
	}
    if (ri.currentlyPressedKeys['ControlRight']) { 
        armExtender.position.x  = armExtender.position.x - (exstendSpeed * delta);
        armExtender.position.x = Math.max(armExtender.position.x, minExtention) 
	}

	//Roter joint1:
	// if (ri.currentlyPressedKeys['KeyS']) {	//S
	// 	arm.joint1Rot = arm.joint1Rot + (rotationSpeed * delta);
	// 	arm.joint1Rot %= (Math.PI * 2); // "Rull rundt" dersom arm.joint1Rot >= 360 grader.
	// }
	// if (ri.currentlyPressedKeys['KeyW']) {	//W
	// 	arm.joint1Rot = arm.joint1Rot - (rotationSpeed * delta);
	// 	arm.joint1Rot %= (Math.PI * 2); // "Rull rundt" dersom arm.joint1Rot >= 360 grader.
	// }

}

function onWindowResize() {
	ri.camera.aspect = window.innerWidth / window.innerHeight;
	ri.camera.updateProjectionMatrix();
	ri.renderer.setSize(window.innerWidth, window.innerHeight);
	ri.controls.handleResize();
	renderScene();
}
