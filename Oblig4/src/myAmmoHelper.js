//Merk export: Denne brukes fler andre steder, f.eks. fra armHingeConstraints.js, pinballGame.js m.fl.
export const phy = {
	ammoPhysicsWorld: undefined,
	rigidBodies: [],
	checkCollisions: true,
	transform: undefined
};

//Merk export: Disse brukes også andre steder, f.eks. pinballGame.js m.fl.
export const COLLISION_GROUP_PLANE = 1;
export const COLLISION_GROUP_SPHERE = 2;
export const COLLISION_GROUP_BUMPER = 4;
export const COLLISION_GROUP_BOX = 8;
export const COLLISION_GROUP_HINGE_SPHERE = 16;

export function createAmmoWorld(checkCollisions= true) {
	phy.checkCollisions = checkCollisions;	// Skal vi gjøre noe ved kollisjoner?
	phy.transform = new Ammo.btTransform(); // Hjelpeobjekt for effektivitet, brukes f.eks. i updatePhysics().

	// Initialiserer phy.ammoPhysicsWorld:
	let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
		dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
		overlappingPairCache = new Ammo.btDbvtBroadphase(),
		solver = new Ammo.btSequentialImpulseConstraintSolver();

	phy.ammoPhysicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
	phy.ammoPhysicsWorld.setGravity(new Ammo.btVector3(0, -9.80665, 0));
}

/**
 * Oppretter en Ammo-rigid body basert på THREE.Mesh-objekt, Ammo-shape-objekt, friksjon, masse osv.
 */
export function createAmmoRigidBody(
	shape,
	threeMesh,
	restitution=0.7,
	friction=0.8,
	position={x:0, y:50, z:0},
	mass=1,
	setLocalScaling=true,
	setRotation=true
) {

	// Setter posisjon basert på gitt posisjon (som tilsvarer Meshets posisjon):
	let transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));

	// Setter posisjon basert på Meshets rotasjon (gitt av meshets kvaternion):
	if (setRotation) {
		let quaternion = threeMesh.quaternion;
		transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
	}

	// Setter skalering basert på Meshets skaleringsverdier:
	if (setLocalScaling) {
		let scale = threeMesh.scale;
		shape.setLocalScaling(new Ammo.btVector3(scale.x, scale.y, scale.z));
	}

	// Oppretter Ammo-rigid body:
	let motionState = new Ammo.btDefaultMotionState(transform);
	let localInertia = new Ammo.btVector3(0, 0, 0);
	shape.calculateLocalInertia(mass, localInertia);
	let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
	let rigidBody = new Ammo.btRigidBody(rbInfo);
	rigidBody.setRestitution(restitution);
	rigidBody.setFriction(friction);
	return rigidBody;
}

/**
 * Setter transformasjon på THREE.Mesh-objekt basert på Ammo-rigid body.
 * @param deltaTime
 */
export function updatePhysics(deltaTime) {
	// Step physics world:
	phy.ammoPhysicsWorld.stepSimulation(deltaTime, 10);

	// Update rigid bodies
	for (let i = 0; i < phy.rigidBodies.length; i++) {
		let mesh = phy.rigidBodies[i];
		let rigidBody = mesh.userData.physicsBody;
		let motionState = rigidBody.getMotionState();
		if (motionState) {
			motionState.getWorldTransform(phy.transform);
			let p = phy.transform.getOrigin();
			let q = phy.transform.getRotation();
			mesh.position.set(p.x(), p.y(), p.z());
			mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
		}
	}
	// Kollisjonsdeteksjon:
	if (phy.checkCollisions)
		checkCollisions(deltaTime);
}

/**
 * Finner ut hvilke objekter som kolliderer og gjør noe dersom det er kollisjon mellom objekt-par.
 * @param deltaTime
 */
function checkCollisions(deltaTime) {
	// Finner antall btPersistentManifold-objekter (overlappende bounding-box par):
	let numManifolds = phy.ammoPhysicsWorld.getDispatcher().getNumManifolds();
	// Gjennomløper alle btPersistentManifold-objekter:
	for (let i=0; i < numManifolds;i++) {
		// Henter spesifikt btPersistentManifold-objekt:
		let contactManifold =  phy.ammoPhysicsWorld.getDispatcher().getManifoldByIndexInternal(i);
		// Henter antall kontaktpunkter for aktuelt btPersistentManifold-objekt:
		let numContacts = contactManifold.getNumContacts();
		if (numContacts>0) {
			// Henter objektene som er involvert: getBody0() og getBody1() returnerer et btCollisionObject,
			// gjøres derfor om til btRigidBody-objekter vha. Ammo.castObject():
			let rbObject0 = Ammo.castObject(contactManifold.getBody0(), Ammo.btRigidBody);
			let rbObject1 = Ammo.castObject(contactManifold.getBody1(), Ammo.btRigidBody);
			// Merk: threeMesh er satt på rigidBody-objektet i createAmmoRigidBody():
			let threeMesh0 = rbObject0.threeMesh;
			let threeMesh1 = rbObject1.threeMesh;
			if (threeMesh0 && threeMesh1) {
				// Gjennomløper alle kontaktpunkter for aktuelt btPersistentManifold-objekt:
				for (let j = 0; j < numContacts; j++) {
					let contactPoint = contactManifold.getContactPoint(j);
					const distance = contactPoint.getDistance();
					//Dersom avstanden mellom kontaktpunktene er mindre enn 0, har vi en kollisjon:
					if (distance <= 0) {
						// Henter hastighetene til objektene og sender med til collisionResponse-funksjonen:
						let velocity0 = rbObject0.getLinearVelocity();
						let velocity1 = rbObject1.getLinearVelocity();

						// Vi har en kollisjon, sjekker om det er mellom kule og en av bumperne.
						// Kulene må ha navn 'sphere' og bumperne 'bumper' (eller i alle fall starter med 'sphere' og 'bumper'):
						if (checkCollisionBetween('sphere', 'bumper', threeMesh0.name, threeMesh1.name)) {
							// Skriver ut debuginfo:
							writeDebugInfo(threeMesh0,threeMesh1,rbObject0,rbObject1,contactPoint,i,j,distance,velocity0,velocity1);

							// Kaller ev. på collisionResponse-eventfunksjon dersom definert på meshene.
							// Sender med objektets hastighet slik at man ev. kan gi dem et ekstra dytt (aktuelt for kuler).
							if (typeof threeMesh0.collisionResponse === 'function')
								threeMesh0.collisionResponse(threeMesh0, {x: velocity0.x(), y: velocity0.y(), z: velocity0.z()});
							if (typeof threeMesh1.collisionResponse === 'function')
								threeMesh1.collisionResponse(threeMesh1, {x: velocity1.x(), y: velocity1.y(), z: velocity1.z()});
						}
					}
				}
			}
		}
	}
}

/**
 * Merk: Generalisert funksjon som kan brukes for å sjekke kollisjoner mellom objekter med ulike navn.
 * Hvilke objekter som skal sjekkes er bestemt av objekt1 og objekt2. Hvilke navn det skal sjekkes mot
 * bestemmes av name1 og name2. Disse kan f.eks. være 'sphere' og 'movable'. Man må sjekke for begge
 * muligheter vha. isCollisionBetween(), siden objekt1 kan være enten 'sphere' eller 'movable' og at
 * objekt2 kan være det motsatte.
 * Returnerer true dersom objekt1 har navn lik name1 eller name2 og objekt2 det motsatte. Ellers false.
 */
function checkCollisionBetween(name1, name2, objekt1, objekt2) {
	// Sjekker begge muligheter:
	return isCollisionBetween(name1, name2, objekt1, objekt2) || isCollisionBetween(name1, name2, objekt2, objekt1);
}

/**
 * Sjekker om objekt1 er lik name1 og objekt2 er lik name2.
 * Returnerer i så fall true, ellers false.
 */
function isCollisionBetween(name1, name2, objekt1, objekt2) {
	return objekt1.startsWith(name1) && objekt2.startsWith(name2);
}

/**
 * Skriver ut debuginfo til konsollen.
 */
function writeDebugInfo(threeMesh0, threeMesh1, rbObject0, rbObject1, contactPoint,i,j,distance,velocity0,velocity1) {
	// Debuginfo:
	let worldPos0 = contactPoint.get_m_positionWorldOnA();
	let worldPos1 = contactPoint.get_m_positionWorldOnB();
	let localPos0 = contactPoint.get_m_localPointA();
	let localPos1 = contactPoint.get_m_localPointB();

	console.log({
		manifoldIndex: i,
		contactIndex: j,
		distance: distance,
		object0:{
			tag: threeMesh0.name,
			velocity: {x: velocity0.x(), y: velocity0.y(), z: velocity0.z()},
			worldPos: {x: worldPos0.x(), y: worldPos0.y(), z: worldPos0.z()},
			localPos: {x: localPos0.x(), y: localPos0.y(), z: localPos0.z()}
		},
		object1:{
			tag: threeMesh1.name,
			velocity: {x: velocity1.x(), y: velocity1.y(), z: velocity1.z()},
			worldPos: {x: worldPos1.x(), y: worldPos1.y(), z: worldPos1.z()},
			localPos: {x: localPos1.x(), y: localPos1.y(), z: localPos1.z()}
		}
	});
}