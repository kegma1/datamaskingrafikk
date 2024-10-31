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
import {createSphere} from "./sphere.js";

let wallHeight = 0.5;
let floorSize = {width: 3.4, height: 0.1, depth: 7.5};
let deviderWidth = 0.05;
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

	let flipperSize = {width: 0.7, height: 0.3, depth:0.1}	;

	//Flipper1:
	let position1 = {x: -0.9, y: 0, z: 2.5};	//I forhold til at brettet står i posisjon 0,0,0
	createFlipperArm( 1, 0x00FF00, position1, true, "left_hinge_arm", angle, flipperSize);
	//Flipper2:
	let position2 = {x: 0.63, y: 0, z: 2.5};	//I forhold til at brettet står i posisjon 0,0,0
	createFlipperArm( 1, 0x00FF00, position2, false, "right_hinge_arm", angle, flipperSize);


	addBumpers(angle);

	let point1 = (floorSize.width / 2) - (.05*4 + deviderWidth)
	let point2 = ((floorSize.width / 2) + (deviderWidth/2));

	addSpring(angle, {x:(point1 + point2)/2, y:0, z:floorSize.depth/2});
}

function addSpring(angle, position) {
	position.y = -Math.tan(angle) * position.z;

	const gMesh = new THREE.CylinderGeometry(0.1, 0.1, wallHeight, 30);
	
	
	const mat = new THREE.MeshStandardMaterial();
	const mesh = new THREE.Mesh(gMesh, mat);
	mesh.name = "spring";
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.rotateX(angle)
	mesh.rotateX(Math.PI/2)
	mesh.position.set(position.x, position.y, position.z);

	// AMMO
	const shape = new Ammo.btCylinderShape(new Ammo.btVector3(0.1, wallHeight/2, 0.1));

	let rigidBody = createAmmoRigidBody(shape, mesh, 0.2, 0.1, position, 0);
	mesh.userData.physicsBody = rigidBody;
	// Legger til physics world:
	phy.ammoPhysicsWorld.addRigidBody(rigidBody);
	addMeshToScene(mesh);
	phy.rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
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

	// THREE
	const groupMesh = new THREE.Group();
	
	const gFloor = new THREE.BoxGeometry(floorSize.width, floorSize.height, floorSize.depth)
	const floor = new THREE.Mesh(gFloor, floorMat)
	floor.name = "floor"
	floor.position.set(position.x, position.y - wallHeight/2, position.z)
	floor.receiveShadow = true;
	groupMesh.add(floor)

	const gWindow = new THREE.BoxGeometry(floorSize.width, floorSize.height, floorSize.depth) 
	const window = new THREE.Mesh(gWindow, windowMat);
	window.name = "window";
	window.position.set(position.x, position.y + wallHeight/2, position.z);
	groupMesh.add(window);

	const walls = createWalls(wallMat, floorSize, wallHeight, deviderWidth);
	groupMesh.add(walls);

	const gArc = new THREE.CylinderGeometry(floorSize.width/2, floorSize.width/2, wallHeight, 30, undefined, true, Math.PI/2, Math.PI);
	const arc = new THREE.Mesh(gArc, wallMat);
	arc.name = "arc";
	arc.position.z -= floorSize.depth/2 - floorSize.width/2
	arc.castShadow = true;
	
	groupMesh.add(arc)

	const gDevider = new THREE.BoxGeometry(deviderWidth, wallHeight, (floorSize.depth/3)*2)
	const devider = new THREE.Mesh(gDevider, wallMat);
	devider.name = "devider";
	devider.position.set(floorSize.width/2 - (.05*4 + deviderWidth), 0, ((floorSize.depth/3)*2)/4);
	devider.castShadow = true;
	
	groupMesh.add(devider)

	const gFunnelWall = new THREE.BoxGeometry(deviderWidth, wallHeight, (floorSize.depth/3))
	const leftFunnel = new THREE.Mesh(gFunnelWall, wallMat)
	leftFunnel.name = "leftFunnel"
	leftFunnel.rotateY(Math.PI/10)
	leftFunnel.position.set(-((floorSize.depth/3)/2) - deviderWidth*2+0.01, 0, (floorSize.depth/3)/2)
	leftFunnel.castShadow = true;
	
	groupMesh.add(leftFunnel)

	const rightFunnel = new THREE.Mesh(gFunnelWall, wallMat)
	rightFunnel.name = "rightFunnel"
	rightFunnel.rotateY(-Math.PI/10)
	rightFunnel.position.set(((floorSize.depth/3)/2) - deviderWidth*4+0.01, 0, (floorSize.depth/3)/2)
	rightFunnel.castShadow = true;
	
	groupMesh.add(rightFunnel)

	groupMesh.rotateX(angle);


	// AMMO
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

	const arcShape = createHalfCylinderCollision(arc)
	compoundShape.addChildShape(...arcShape);

	const deviderShape = new Ammo.btBoxShape(
		new Ammo.btVector3(deviderWidth / 2, wallHeight / 2, ((floorSize.depth/3)*2)/2)
	);
	const deviderTransform = new Ammo.btTransform();
	deviderTransform.setIdentity();
	deviderTransform.setOrigin(new Ammo.btVector3(floorSize.width/2 - (.05*4 + deviderWidth), 0, ((floorSize.depth/3)*2)/4))
	compoundShape.addChildShape(deviderTransform, deviderShape)

	const funnelWallShape = new Ammo.btBoxShape(
		new Ammo.btVector3(deviderWidth / 2, wallHeight / 2, (floorSize.depth/3)/2)
	);
	const leftWallTransform = new Ammo.btTransform();
	leftWallTransform.setIdentity();
	leftWallTransform.setOrigin(new Ammo.btVector3(-((floorSize.depth/3)/2) - deviderWidth*2+0.01, 0, (floorSize.depth/3)/2))

	const leftWallRotation = new Ammo.btQuaternion();
	leftWallRotation.setEulerZYX(0, Math.PI / 10, 0); 
	leftWallTransform.setRotation(leftWallRotation);

	compoundShape.addChildShape(leftWallTransform, funnelWallShape);

	const rightWallTransform = new Ammo.btTransform();
	rightWallTransform.setIdentity();
	rightWallTransform.setOrigin(new Ammo.btVector3(((floorSize.depth/3)/2) - deviderWidth*4+0.01, 0, (floorSize.depth/3)/2))

	const rightWallRotation = new Ammo.btQuaternion();
	rightWallRotation.setEulerZYX(0, -Math.PI / 10, 0);
	rightWallTransform.setRotation(rightWallRotation);

	compoundShape.addChildShape(rightWallTransform, funnelWallShape);

	addWallsCollition(floorSize, wallHeight, position, compoundShape);

	// MISC

	let point1 = (floorSize.width / 2) - (.05*4 + deviderWidth)
	let point2 = ((floorSize.width / 2) + (deviderWidth/2));

	createSphere(.05, 0x0eFF09, {x:(point1 + point2)/2, y:.1, z:.2})
	let rigidBody = createAmmoRigidBody(compoundShape, groupMesh, 0.2, 0.9, position, mass);
	groupMesh.userData.physicsBody = rigidBody;
	// Legger til physics world:
	phy.ammoPhysicsWorld.addRigidBody(rigidBody);
	addMeshToScene(groupMesh);
	phy.rigidBodies.push(groupMesh);
	rigidBody.threeMesh = groupMesh;
}

function createHalfCylinderCollision(threeMesh) {
    const geometry = threeMesh.geometry;

    const halfCylinderMesh = new Ammo.btTriangleMesh();

    const positionAttribute = geometry.getAttribute('position');
    const indexAttribute = geometry.index;

    const vertices = [];
    for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = positionAttribute.getZ(i);
        vertices.push(new Ammo.btVector3(x, y, z));
    }

    if (indexAttribute) {
        for (let i = 0; i < indexAttribute.count; i += 3) {
            const a = indexAttribute.getX(i);
            const b = indexAttribute.getX(i + 1);
            const c = indexAttribute.getX(i + 2);
            halfCylinderMesh.addTriangle(vertices[a], vertices[b], vertices[c]);
        }
    } else {
        for (let i = 0; i < vertices.length; i += 3) {
            if (i + 2 < vertices.length) {
                halfCylinderMesh.addTriangle(vertices[i], vertices[i + 1], vertices[i + 2]);
            }
        }
    }

    const halfCylinderShape = new Ammo.btBvhTriangleMeshShape(halfCylinderMesh, true);

    const halfCylinderTransform = new Ammo.btTransform();
    halfCylinderTransform.setIdentity();
    halfCylinderTransform.setOrigin(new Ammo.btVector3(threeMesh.position.x, threeMesh.position.y, threeMesh.position.z));

    return [halfCylinderTransform, halfCylinderShape];
}

function createWalls(mat, floorSize, wallHeight, wallWidth) {
	const walls = new THREE.Group()
	walls.name = walls

	const gWalls = [
		new THREE.BoxGeometry(floorSize.depth, wallHeight, wallWidth), // Left and Right wall
		new THREE.BoxGeometry(floorSize.width, wallHeight, wallWidth), // Top and Bottom wall
	]

	const leftWall = new THREE.Mesh(gWalls[0], mat);
	leftWall.name = "leftWall";
	leftWall.position.x -= floorSize.width/2 + wallWidth/2;
	leftWall.rotateY(Math.PI/2);
	walls.add(leftWall);
	const rightWall = new THREE.Mesh(gWalls[0], mat);
	rightWall.name = "rightWall";
	rightWall.position.x += floorSize.width/2 + wallWidth/2;
	rightWall.rotateY(Math.PI/2);
	walls.add(rightWall)
	const topWall = new THREE.Mesh(gWalls[1], mat);
	topWall.name = "topWall";
	topWall.position.z -= floorSize.depth/2 + wallWidth/2;
	walls.add(topWall)
	const bottomWall = new THREE.Mesh(gWalls[1], mat);
	bottomWall.name = "bottomWall";
	bottomWall.position.z += floorSize.depth/2 + wallWidth/2;
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

function isValidNumber(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
}

/**
 * Legger til bumpers. Må ha et navn (.name) som starter med 'bumper'.
 * Dette henger sammen med kollisjonshåndteringen. Se myAmmoHelper.js og checkCollisions-funksjonen.
 */
function addBumpers(angle) {
	addBumper(angle, 0.35, {x: 1, y: 0, z: -1}, "bumper", 50)
	addBumper(angle, 0.35, {x: -0.5, y: 0, z: 1}, "bumper", 50)
	addBumper(angle, 0.2, {x: -1, y: 0, z: -0.5}, "bumper", 100)
	addBumper(angle, 0.2, {x: 0.5, y: 0, z: 1.3}, "bumper", 100)
	addBumper(angle, 0.15, {x: 0, y: 0, z: -2}, "bumper", 200)
}

/**
 * Legger til en bumper. Bumperen er en sylinder med radiusTop, radiusBottom og height.
 */
function addBumper(angle, size, position, name, points) {
	position.y = -Math.tan(angle) * position.z;

	let color = {R:Math.floor(Math.random() * 256), G:Math.floor(Math.random() * 256), B:Math.floor(Math.random() * 256)}

	// THREE
	const canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 256;
	const context = canvas.getContext("2d");
	
	drawText(context, canvas, color, points);

	const textTexture = new THREE.CanvasTexture(canvas);

	const gMesh = new THREE.CylinderGeometry(size, size, wallHeight, 30);
	
	const topMat = new THREE.MeshStandardMaterial({map: textTexture});
	const sideMat = new THREE.MeshStandardMaterial({color: (color.R << 16) | (color.G << 8) | color.B});
	const mesh = new THREE.Mesh(gMesh, [sideMat, topMat]);
	mesh.name = name;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.rotateX(angle)
	mesh.rotateY(Math.PI/2)
	mesh.position.set(position.x, position.y, position.z);
	mesh.color = color
	mesh.textCtx = context 
	mesh.textCanvas = canvas

	mesh.collisionResponse = (mesh1) => {
		mesh1.color = {R:Math.floor(Math.random() * 256), G:Math.floor(Math.random() * 256), B:Math.floor(Math.random() * 256)}
		mesh1.material[0].color.setHex((mesh1.color.R << 16) | (mesh1.color.G << 8) | mesh1.color.B);

		drawText(mesh1.textCtx, mesh1.textCanvas, mesh1.color, points)
		mesh1.material[1].map = new THREE.CanvasTexture(mesh1.textCanvas);

		let pointCounter = document.getElementById("points")

		let currentPoints = pointCounter.innerText;
		if (isValidNumber(currentPoints)) {
			pointCounter.innerText = Number(currentPoints) + points
		} else {
			pointCounter.innerText = points
		}

	};
	

	// AMMO
	const shape = new Ammo.btCylinderShape(new Ammo.btVector3(size, wallHeight/2, size));

	let rigidBody = createAmmoRigidBody(shape, mesh, 0.2, 0.1, position, 0);
	mesh.userData.physicsBody = rigidBody;
	// Legger til physics world:
	phy.ammoPhysicsWorld.addRigidBody(rigidBody);
	addMeshToScene(mesh);
	phy.rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

function drawText(context, canvas, color, points) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = `RGB(${color.R} ${color.G} ${color.B})`;
	context.fillRect(0, 0, canvas.width, canvas.height)

	
	context.fillStyle = "white";
	context.font = "bold 100px Arial";
	context.textAlign = "center";
	context.textBaseline = "middle";
	
	context.lineWidth = 8;            
	context.strokeStyle = "black";  

	context.strokeText(points, canvas.width / 2, canvas.height / 2);  
	context.fillText(points, canvas.width / 2, canvas.height / 2);    

}