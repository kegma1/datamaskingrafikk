import * as THREE from "three";

export function createGroundMesh() {
    const groundGeometry = new THREE.PlaneGeometry(600, 600, 10, 10);
    const groundMaterial = new THREE.MeshLambertMaterial({color: 0x57ff47, side: THREE.DoubleSide});
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);

    groundMesh.name = "ground";	//NB!
    groundMesh.receiveShadow = true;	//NB!
    
    groundMesh.rotation.x = Math.PI / 2;
    groundMesh.position.y = -5;

    return groundMesh
}