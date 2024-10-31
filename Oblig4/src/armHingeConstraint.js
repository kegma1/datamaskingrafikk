import * as THREE from "three";
import {createAmmoRigidBody, phy} from "./myAmmoHelper";
import {addArrowHelper, addMeshToScene} from "./myThreeHelper";
import {
	COLLISION_GROUP_BOX, COLLISION_GROUP_HINGE_SPHERE,
	COLLISION_GROUP_BUMPER,
	COLLISION_GROUP_PLANE,
	COLLISION_GROUP_SPHERE
} from "./myAmmoHelper";

export function createFlipperArm(mass , color, position, leftHinged, name, angle, size){
	//Justerer høyden til flipperen i forhold til planet:
	position.y = -Math.tan(angle) * position.z - 0.06;

	//Flipperarm:
	const rigidBodyArm = createArm(mass, position, name, angle, size);
	const armLength = rigidBodyArm.threeMesh.geometry.parameters.width;

	//Flipperhengsel:
	const radius = size.depth;
	const rigidBodyAnchor = createAnchor(position, radius, angle);

	//AMMO hengsel/hinge constraint:
	const anchorPivot = new Ammo.btVector3( 0, radius/2.0, 0 );
	const anchorAxis = new Ammo.btVector3(0,1,0);
	let armPivot;
	if (leftHinged)
		armPivot = new Ammo.btVector3( - armLength/2, 0, 0 );
	else
		armPivot = new Ammo.btVector3( armLength/2, 0, 0 );
	const armAxis = new Ammo.btVector3(0,1,0);
	const hingeConstraint = new Ammo.btHingeConstraint(
		rigidBodyAnchor,
		rigidBodyArm,
		anchorPivot,
		armPivot,
		anchorAxis,
		armAxis,
		false
	);

	const lowerLimit = -Math.PI/3;
	const upperLimit = Math.PI/3;
	const softness = 0.1;
	const biasFactor = 0.3;
	const relaxationFactor = 1.0;
	hingeConstraint.setLimit( lowerLimit, upperLimit, softness, biasFactor, relaxationFactor);
	//hingeConstraint.enableAngularMotor(true, 0, .001);	//NB! Denne trengs ikke her, men siste parameter påvirker.
	phy.ammoPhysicsWorld.addConstraint( hingeConstraint, false );

	// NB! LA STÅ!
	// Se: https://pybullet.org/Bullet/phpBB3/viewtopic.php?t=4145
	// og: https://gamedev.stackexchange.com/questions/71436/what-are-the-parameters-for-bthingeconstraintsetlimit
	/*
	void btHingeConstraint::setLimit    (
	    btScalar    low,
        btScalar    high,
        btScalar    _softness = 0.9f,
        btScalar    _biasFactor = 0.3f,
        btScalar    _relaxationFactor = 1.0f
    )
	The parameters low and high are the angles restricting the hinge.
	  The angle between the two bodies stays in that range.
	  For no restriction, you pass a lower limit <= -pi and an upper limit >= pi here. This might be useful for things that rotate completely around other things, for example wheels on a car. For the other three parameters, I can only guess, so I don't claim this answer is complete.
	  _softness
	            might be a negative measure of the friction that determines how much the
	            hinge rotates for a given force. A high softness would make the hinge rotate
	            easily like it's oiled then.
	  _biasFactor
	            might be an offset for the relaxed rotation of the hinge.
	            It won't be right in the middle of the low and high angles anymore. 1.0f is the neural value.
      _relaxationFactor
	            might be a measure of how much force is applied internally to bring
	            the hinge in its central rotation. This is right in the middle of the
	            low and high angles. For example, consider a western swing door.
	            After walking through it will swing in both directions but at
	            the end it stays right in the middle.
	*/
}

function createArm(mass, position, name, angle, size) {
	const width = size.width;
	const height = size.height;
	const depth = size.depth;

	//THREE
	const mesh = new THREE.Mesh(
		new THREE.BoxGeometry(width,height,depth, 1, 1),
		new THREE.MeshStandardMaterial({color: 0xf906e4}));
	mesh.name = name;
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.rotation.x = angle;
	const direction = new THREE.Vector3();
	mesh.getWorldDirection(direction);  // NB! WorldDirection gir en vektor som peker mot +Z. FRA DOC: Returns a vector representing the direction of object's positive z-axis in world space.
	addArrowHelper(mesh, direction.normalize(), new THREE.Vector3( 0, 0, 0 ), 'worlddirection_arrow', 0xff0000, 0.5);

	//AMMO
	const mesh_width = mesh.geometry.parameters.width;
	const mesh_height = mesh.geometry.parameters.height;
	const mesh_depth = mesh.geometry.parameters.depth;

	const shape = new Ammo.btBoxShape( new Ammo.btVector3( mesh_width/2, mesh_height/2, mesh_depth/2) );
	shape.setMargin( 0.05 );
	const rigidBody = createAmmoRigidBody(shape, mesh, 0.03, 0.0, position, mass);
	rigidBody.setDamping(0.1, 0.5);
	rigidBody.setActivationState(4);
	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	phy.ammoPhysicsWorld.addRigidBody(rigidBody);

	addMeshToScene(mesh);
	phy.rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	return rigidBody;
}

function createAnchor(position, radius, angle) {
	const mass = 0;
	const color=0xb8Fddb;

	// Løfter kula/hengslet litt over planet:
	position.y += radius;

	//THREE
	const mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshStandardMaterial({color: color, transparent: false, opacity: 0.5}));
	mesh.name = 'hinge_anchor';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.rotation.x = angle;
	mesh.collisionResponse = (mesh1) => {
		mesh1.material.color.setHex(Math.random() * 0xffffff);
	};
	//AMMO
	const shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius);
	shape.setMargin( 0.5 );
	const rigidBody = createAmmoRigidBody(shape, mesh, 0.4, 0.6, position, mass);
	mesh.userData.physicsBody = rigidBody;
	phy.ammoPhysicsWorld.addRigidBody();
	phy.rigidBodies.push(mesh);

	addMeshToScene(mesh);
	phy.rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	return rigidBody;
}

/**
 * Gir flipperen et støt/impuls ytterst, i forhold til hengselen, på flipperen/armen/kuben.
 */
export function pushFlipper(mesh, direction, leftHinged=true) {
	if (!mesh.userData.physicsBody)
		return;
	const rigidBody = mesh.userData.physicsBody;
	rigidBody.activate(true);

	// Henter bredden på armen:
	const armWidth = mesh.geometry.parameters.width;

	// Gir impuls ytterst på armen:
	let relativeVector;
	if (leftHinged)
		relativeVector = new Ammo.btVector3(armWidth/2, 0, 0);
	else
		relativeVector = new Ammo.btVector3(-armWidth/2, 0, 0);

	// Gir impuls i retning av armen:
	const impulseVector = new Ammo.btVector3(0.2*direction.x, 0, 0.2*direction.z);
	rigidBody.applyImpulse(impulseVector, relativeVector);
}
