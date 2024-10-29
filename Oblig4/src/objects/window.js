import * as THREE from "three";

export function createWindowMesh(envMap) {
    const windowGeometry = new THREE.BoxGeometry(250, 5, 380);
    const windowMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, envMap:envMap, roughness: 0.05, opacity: 0.5, transparent: true});
    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);

    windowMesh.name = "window";	//NB!
    windowMesh.receiveShadow = true;	//NB!
    
    windowMesh.rotation.x = Math.PI / 20;
    windowMesh.position.y += 105

    return windowMesh
}