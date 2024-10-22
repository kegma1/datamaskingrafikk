import * as THREE from "three";

export function createGroundMesh(texture) {
    const groundGeometry = new THREE.PlaneGeometry(2000, 2000, 10, 10);
    const groundMaterial = new THREE.MeshLambertMaterial({color: 0x57ff47, side: THREE.DoubleSide, map: texture});
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);

    groundMesh.name = "ground";	//NB!
    groundMesh.receiveShadow = true;	//NB!
    
    groundMesh.rotation.x = Math.PI / 2;

    return groundMesh
}