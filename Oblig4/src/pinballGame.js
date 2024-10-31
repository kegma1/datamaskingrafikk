import * as THREE from "three";
import {
	COLLISION_GROUP_BUMPER,
	COLLISION_GROUP_PLANE,
	COLLISION_GROUP_SPHERE,
	createAmmoRigidBody,
	phy
} from "./myAmmoHelper.js";
import {addMeshToScene} from "./myThreeHelper.js";
import {createFlipperArm} from "./armHingeConstraint.js";

/**
 * Oppretter hele spillet.
 * Merk størrelser; anta at en enhet er en meter, dvs. flipperSize = {with=1.1, ...} betyr at bredde på flipperen er
 * 1,1 meter, dvs. relativt store og de kunne nok vært mindre. Det står imidlertid i forhold til størrelsen på
 * spillbrettet (3,4 meter bredt) og kulene som f.eks. har en diameter på 20cm.
 *
 * Bevegelser på flippere og kuler kan dermed virke litt trege. I så fall er det bare å gjør spillet mindre.
 * */
export function createPinballGame(textureObjects, angle) {
	const position={x:0, y:0, z:0}
	createBoard(textureObjects[1], textureObjects[2], textureObjects[3], position, angle);

	// let flipperSize = {width: 1.1, height: 0.1, depth:0.1}	;

	// //Flipper1:
	// let position1 = {x: -1.3, y: 0, z: 2.0};	//I forhold til at brettet står i posisjon 0,0,0
	// createFlipperArm( 1, 0x00FF00, position1, true, "left_hinge_arm", angle, flipperSize);
	// //Flipper2:
	// //...

	// addBumpers(angle);
}

/**
 * Spillbrett med hinder og kanter som en gruppe (uten bumpere eller flippere).
 */
export function createBoard(textureObject, floorTexture, envMap, position, angle) {
	//Materials
	const floorMat = new THREE.MeshStandardMaterial({map: floorTexture})
	const wallMat = new THREE.MeshStandardMaterial({map: textureObject, side: THREE.DoubleSide })
	const windowMat = new THREE.MeshStandardMaterial({roughness: 0.01, metalness: 0.7, opacity: 0.2, transparent: true, envMap: envMap})
	//Brettet skal stå i ro:
	const mass = 0;

	let floorSize = {width: 3.4, height: 0.1, depth: 7.5};
	let wallHeight = 1.5;
	
	const groupMesh = new THREE.Group();
	
	const gFloor = new THREE.BoxGeometry(floorSize.width, floorSize.height, floorSize.depth)
	const floor = new THREE.Mesh(gFloor, floorMat)
	floor.name = "floor"
	floor.position.set(position.x, position.y - wallHeight/2, position.z)
	groupMesh.add(floor)

	const gWindow = new THREE.BoxGeometry(floorSize.width, floorSize.height, floorSize.depth) 
	const window = new THREE.Mesh(gWindow, windowMat);
	window.name = "window";
	window.position.set(position.x, position.y + wallHeight/2, position.z);
	groupMesh.add(window);

	const walls = createWalls(wallMat, floorSize, wallHeight);
	groupMesh.add(walls);

	groupMesh.rotateX(angle);

	const compoundShape = new Ammo.btCompoundShape();

	const floorShape = new Ammo.btBoxShape(
		new Ammo.btVector3(floorSize.width / 2, floorSize.height / 2, floorSize.depth / 2)
	);
	const floorTransform = new Ammo.btTransform();
	floorTransform.setIdentity();
	floorTransform.setOrigin(new Ammo.btVector3(position.x, position.y - wallHeight / 2, position.z));
	compoundShape.addChildShape(floorTransform, floorShape);

	const windowShape = new Ammo.btBoxShape(
		new Ammo.btVector3(floorSize.width / 2, floorSize.height / 2, floorSize.depth / 2)
	);
	const windowTransform = new Ammo.btTransform();
	windowTransform.setIdentity();
	windowTransform.setOrigin(new Ammo.btVector3(position.x, position.y + wallHeight / 2, position.z));
	compoundShape.addChildShape(windowTransform, windowShape);

	addWallsCollition(floorSize, wallHeight, position, compoundShape);


	let rigidBody = createAmmoRigidBody(compoundShape, groupMesh, 0.2, 0.9, position, mass);
	groupMesh.userData.physicsBody = rigidBody;
	// Legger til physics world:
	phy.ammoPhysicsWorld.addRigidBody(rigidBody);
	addMeshToScene(groupMesh);
	phy.rigidBodies.push(groupMesh);
	rigidBody.threeMesh = groupMesh;
}

function createWalls(mat, floorSize, wallHeight) {
	const walls = new THREE.Group()
	walls.name = walls

	const gWalls = [
		new THREE.PlaneGeometry(floorSize.depth, wallHeight), // Left and Right wall
		new THREE.PlaneGeometry(floorSize.width, wallHeight), // Top and Bottom wall
	]

	const leftWall = new THREE.Mesh(gWalls[0], mat);
	leftWall.name = "leftWall";
	leftWall.position.x -= floorSize.width/2 + 0.0001;
	leftWall.rotateY(Math.PI/2);
	walls.add(leftWall);
	const rightWall = new THREE.Mesh(gWalls[0], mat);
	rightWall.name = "rightWall";
	rightWall.position.x += floorSize.width/2 + 0.0001;
	rightWall.rotateY(Math.PI/2);
	walls.add(rightWall)
	const topWall = new THREE.Mesh(gWalls[1], mat);
	topWall.name = "topWall";
	topWall.position.z -= floorSize.depth/2 + 0.0001;
	walls.add(topWall)
	const bottomWall = new THREE.Mesh(gWalls[1], mat);
	bottomWall.name = "bottomWall";
	bottomWall.position.z += floorSize.depth/2 + 0.0001;
	walls.add(bottomWall)
	
	return walls
}

function addWallsCollition(floorSize, wallHeight, position, compoundShape) {
	const leftWallShape =   new Ammo.btBoxShape(new Ammo.btVector3(wallHeight / 2,      wallHeight / 2, floorSize.depth / 2));
	const rightWallShape =  new Ammo.btBoxShape(new Ammo.btVector3(wallHeight / 2,		wallHeight / 2, floorSize.depth / 2));
	const topWallShape =    new Ammo.btBoxShape(new Ammo.btVector3(floorSize.width / 2, wallHeight / 2, wallHeight / 2));
	const bottomWallShape = new Ammo.btBoxShape(new Ammo.btVector3(floorSize.width / 2, wallHeight / 2, wallHeight / 2));

	const wallTransforms = [
		new Ammo.btTransform(), new Ammo.btTransform(),
		new Ammo.btTransform(), new Ammo.btTransform()
	];

	wallTransforms[0].setIdentity();
	wallTransforms[0].setOrigin(new Ammo.btVector3(position.x - floorSize.width/2 - wallHeight / 2, position.y, position.z));

	wallTransforms[1].setIdentity();
	wallTransforms[1].setOrigin(new Ammo.btVector3(position.x + floorSize.width/2 + wallHeight / 2, position.y, position.z));

	wallTransforms[2].setIdentity();
	wallTransforms[2].setOrigin(new Ammo.btVector3(position.x, position.y, position.z - floorSize.depth/2 - wallHeight / 2));

	wallTransforms[3].setIdentity();
	wallTransforms[3].setOrigin(new Ammo.btVector3(position.x, position.y, position.z + floorSize.depth/2 + wallHeight / 2));

	compoundShape.addChildShape(wallTransforms[0], leftWallShape);
	compoundShape.addChildShape(wallTransforms[1], rightWallShape);
	compoundShape.addChildShape(wallTransforms[2], topWallShape);
	compoundShape.addChildShape(wallTransforms[3], bottomWallShape);
}

/**
 * Legger til bumpers. Må ha et navn (.name) som starter med 'bumper'.
 * Dette henger sammen med kollisjonshåndteringen. Se myAmmoHelper.js og checkCollisions-funksjonen.
 */
function addBumpers(angle) {
	//...
}

/**
 * Legger til en bumper. Bumperen er en sylinder med radiusTop, radiusBottom og height.
 */
function addBumper(angle, size, position, name, points) {
	// ...
	// Sørg for "fysikk" på denne.
	// Tips: Bruk createAmmoRigidBody(...)
}