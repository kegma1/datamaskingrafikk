/**
 * Funksjoner og variabler knyttett til kollisjonsdeteksjon.
 *
 */

//Finner world-posisjonene til de to meshene.
//Beregner summen av radiussen til boundingspheren til begge meshene.
//Dersom summen avstanden mellom de to meshene er mindre enn summen av radiusene returneres true, dvs. kollisjon mellom boundingspherene.
//NB! Denne m�ten � gj�re kollisjonsdeteksjon er ikke optimal for store mesh!
import * as THREE from "three";

export function coarseCollisionTest(_mesh1, _collidableMeshList) {
	let _mesh2 = undefined;

	for (let modelIndex = 0; modelIndex < _collidableMeshList.length; modelIndex++) {
		_mesh2 = _collidableMeshList[modelIndex];

		let mesh1Position = new THREE.Vector3();
		mesh1Position.setFromMatrixPosition( _mesh1.matrixWorld );	//Henter posisjonsvektoren fra world-matrisa.

		let mesh2Position = new THREE.Vector3();
		mesh2Position.setFromMatrixPosition( _mesh2.matrixWorld );	//Henter posisjonsvektoren fra world-matrisa.

		let distanceVector = mesh1Position.sub(mesh2Position);		//Finnver vektoren mellom posisjonene.
		let distance = distanceVector.length();						//Beregner lengden p� vektoren.
		let r1plussr2 = _mesh1.geometry.boundingSphere.radius + _mesh2.geometry.boundingSphere.radius;	//Beregner summen av radiusene.
		if (distance < r1plussr2) 									//Sjekker!
			return true;
	}
	return false;
}

/**
 * Sjekker om to mesh1 kolliderer noen av meshene som ligger i collidableMeshList ved hjelp av bounding boxes.
 * Merk: Her oppdateres Box3-objektets transformasjon vha. meshets world-matrise.
 */
export function coarseCollisionTestUsingBoundingBox(_mesh1, _collidableMeshList) {
	_mesh1.box3.copy( _mesh1.geometry.boundingBox ).applyMatrix4( _mesh1.matrixWorld );
	let _mesh2 = undefined;
	for (let modelIndex = 0; modelIndex < _collidableMeshList.length; modelIndex++) {
		_mesh2 = _collidableMeshList[modelIndex];
		_mesh2.box3.copy( _mesh2.geometry.boundingBox ).applyMatrix4( _mesh2.matrixWorld );
		if (_mesh1.box3.intersectsBox(_mesh2.box3))
			return true;
	}
	return false;
}
//Baert på: http://stackoverflow.com/questions/11473755/how-to-detect-collision-in-three-js
//Se referert lenke, koden er derfra:
export function fineCollisionTest(_mesh, _collidableMeshList) {
	//Kollisjonsvariabler:
	let directionVector;
	let ray;
	let collisionResults;
	let globalVertex = new THREE.Vector3();
	try {
		const positions = _mesh.geometry.attributes.position;
		//Gjennomløper alle vertekser til meshet:
		for (let vertexIndex = 0; vertexIndex < positions.count; vertexIndex++)
		{
			//console.log(vertexIndex);
			globalVertex.fromBufferAttribute(positions, vertexIndex);
			globalVertex.applyMatrix4(_mesh.matrixWorld);

			//Lager en RAY fra meshets posisjon (globale koordinater) til transformert verteks:
			let meshPosition = new THREE.Vector3();
			meshPosition.setFromMatrixPosition(_mesh.matrixWorld);	//Henter posisjonsvektoren fra world-matrisa.
			directionVector = globalVertex.sub(meshPosition);

			//Lager et Raycaster-objekt vha.
			ray = new THREE.Raycaster(meshPosition, directionVector.clone().normalize()); //fra, retning

			//Returnerer en liste med objekter som _mesh kolliderer med (n�rmeste f�rst):
			collisionResults = ray.intersectObjects(_collidableMeshList);

			//Dersom denne rayen treffer noen av modellene og avstanden er mindre enn lengden av vektoren til verteksen:
			if (collisionResults.length > 0)
				if (collisionResults[0] !== undefined && collisionResults[0].distance <= directionVector.length())
					return true;
		}
		return false;
	} catch {
		return false;
	}
}