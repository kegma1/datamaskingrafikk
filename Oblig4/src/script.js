import './style.css';
import * as THREE from "three";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { addCoordSystem } from "../static/lib/wfa-coord"
import { createWindowMesh } from './objects/window';
import { createFlippers } from './objects/flippers';

import px from '../static/GardenNook/px.png';
import nx from '../static/GardenNook/nx.png';
import py from '../static/GardenNook/py.png';
import ny from '../static/GardenNook/ny.png';
import pz from '../static/GardenNook/pz.png';
import nz from '../static/GardenNook/nz.png';


export const ri = {
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
   
    ri.camera.position.x = 0;
	ri.camera.position.y = 500;
	ri.camera.position.z = 200;
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
    const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
    const textureObjects = [];

    let envMap = cubeTextureLoader.load([px, nx, py, ny, pz, nz])
    // ri.scene.envMap = envMap
    
    loadingManager.onLoad = () => {
        loadModels();
        ri.scene.add(createWindowMesh(envMap));
        ri.scene.add(createFlippers(60));

        let flippers = ri.scene.getObjectByName("flippers");
        // flippers.rotation.x = Math.PI / 20
        flippers.position.y = 30
        flippers.position.x -= 23
        flippers.position.z = 140

        ri.flippers = flippers
        animate(0)
    }
}

function loadModels() {
	const progressbarElem = document.querySelector('#progressbar');
	const manager = new THREE.LoadingManager();
	manager.onProgress = (url, itemsLoaded, itemsTotal) => {
		progressbarElem.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
	}
	manager.onLoad = () => {
		initModels();
    }

	ri.models = {
		tabel: {url: "../Models/flipper.glb", scale: {x:10,y:10,z:10}, position: {x:0, y:0, z:0}},
	};

	const gltfLoader = new GLTFLoader(manager);
	for (const model of Object.values(ri.models)) {
		gltfLoader.load(model.url, (gltf) => {
			model.gltf = gltf;
		}, undefined,
        (error) => {
            console.error('Error loading model:', error);
        });
	}
}

function initModels() {
	const loadingElem = document.querySelector('#loading');
	loadingElem.style.display = 'none';

	Object.values(ri.models).forEach((model, ndx) => {
		model.gltf.scene.traverse(function (child) {
			if (child.type === "SkinnedMesh") {
				console.log(child);
			}
		});

		const clonedScene = SkeletonUtils.clone(model.gltf.scene);
		const root = new THREE.Object3D();
		root.scale.set(model.scale.x, model.scale.y, model.scale.z);
		root.position.set(model.position.x, model.position.y, model.position.z);
		root.add(clonedScene);
		ri.scene.add(root);
	});
}



function addLights() {
	//Retningsorientert lys (som gir skygge):
	let directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0); //farge, intensitet (1=default)
	directionalLight1.position.set(200, 300, 200);
	directionalLight1.castShadow = true;

	// Viser lyskilden:
	const directional1LightHelper = new THREE.DirectionalLightHelper( directionalLight1, 10, 0xff0000);
	directional1LightHelper.visible = true;
	ri.scene.add(directional1LightHelper);
	// Setter verdier til shadow camera:
	directionalLight1.shadow.camera.near = 0;
	directionalLight1.shadow.camera.far = 4000;
	directionalLight1.shadow.camera.left = -4000;
	directionalLight1.shadow.camera.right = 4000;
	directionalLight1.shadow.camera.top = 4000;
	directionalLight1.shadow.camera.bottom = -4000;
	//Hjelpeklasse for å vise lysets utstrekning:
	let lightCamHelper1 = new THREE.CameraHelper( directionalLight1.shadow.camera );
	lightCamHelper1.visible = false;
	ri.scene.add( lightCamHelper1 );

	ri.scene.add(directionalLight1);
}

  
function animate(currentTime) {
    window.requestAnimationFrame((currentTime) => {
        animate(currentTime);
    });
    
    let delta = ri.clock.getDelta();
    let elapsed = ri.clock.getElapsedTime();


    ri.controls.update();

    handleKeys(delta);
    renderScene();
}

function renderScene() {
    ri.renderer.render(ri.scene, ri.camera);
}

function handleKeys(delta) {
    const flippingSpeed = 20;
    let Leftflipper = ri.flippers.getObjectByName("leftFlipper")
    let rightFlipper = ri.flippers.getObjectByName("rightFlipper")

    
    if (ri.currentlyPressedKeys['KeyA']) {
        Leftflipper.rotation.y = Leftflipper.rotation.y + (flippingSpeed * delta)
        Leftflipper.rotation.y = Math.min(Leftflipper.rotation.y, Math.PI / 6)
    } else {
        if (Leftflipper.rotation.y > 0) {
            Leftflipper.rotation.y = Leftflipper.rotation.y - (flippingSpeed * delta)
            Leftflipper.rotation.y = Math.max(Leftflipper.rotation.y, 0)
        }
    }
    if (ri.currentlyPressedKeys['KeyD']) {
        rightFlipper.rotation.y = rightFlipper.rotation.y - (flippingSpeed * delta)
        rightFlipper.rotation.y = Math.max(rightFlipper.rotation.y, -Math.PI / 6)
    } else {
        if (rightFlipper.rotation.y < 0) {
            rightFlipper.rotation.y = rightFlipper.rotation.y + (flippingSpeed * delta)
            rightFlipper.rotation.y = Math.min(rightFlipper.rotation.y, 0)
        }
    }
   
}

function onWindowResize() {
	ri.camera.aspect = window.innerWidth / window.innerHeight;
	ri.camera.updateProjectionMatrix();
	ri.renderer.setSize(window.innerWidth, window.innerHeight);
	ri.controls.handleResize();
	renderScene();
}