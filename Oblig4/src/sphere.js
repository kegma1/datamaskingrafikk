import * as THREE from "three";
import {addMeshToScene} from "./myThreeHelper.js";
import {COLLISION_GROUP_HINGE_SPHERE, createAmmoRigidBody, phy} from "./myAmmoHelper.js";
import {COLLISION_GROUP_BOX, COLLISION_GROUP_BUMPER, COLLISION_GROUP_PLANE, COLLISION_GROUP_SPHERE} from "./myAmmoHelper";

export function createSphere(mass = 0.05, color=0x0eFF09, position={x:0, y:0, z:0}) {
	const radius = 2*mass;

	//THREE
	let mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshStandardMaterial({color: color}));
	mesh.name = 'sphere';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1, velocity) => {
		let impulse = {x:velocity.x, y: velocity.y, z:velocity.z};
		pushBall(mesh1, impulse);
	};
	//AMMO
	let shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius);
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.6, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	phy.ammoPhysicsWorld.addRigidBody(rigidBody);

	addMeshToScene(mesh);
	phy.rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

export function pushBall(mesh, velocity) {
	if (!mesh.userData.physicsBody)
		return;

	let relativeVector = new Ammo.btVector3(0, 0, 0);
	let impulseVector = new Ammo.btVector3(velocity.x * 0.005, velocity.y * 0.005, velocity.z * 0.005);

	const rigidBody = mesh.userData.physicsBody;
	rigidBody.activate(true);
	rigidBody.applyImpulse(impulseVector, relativeVector);
}