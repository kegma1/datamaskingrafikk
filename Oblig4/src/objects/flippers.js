import * as THREE from "three";
import { ri } from "../script";

export function createFlippers(dist) {
    const flippers = new THREE.Group();
    flippers.name = "flippers"
    const mat = new THREE.MeshStandardMaterial({color: 0x0c0c0c})


    let leftFlipper = createFlipper(mat);
    leftFlipper.name = "leftFlipper"
    leftFlipper.position.x -= dist
    flippers.add(leftFlipper)

    let rightFlipper = createFlipper(mat)
    rightFlipper.name = "rightFlipper"
    rightFlipper.scale.x = -1
    rightFlipper.position.x += dist
    flippers.add(rightFlipper)

    return flippers
}

function createFlipper(mat) {
    const flipper = new THREE.Group();

    const h = 40;
    const w = 5;
    const l = 50;


    let gBase = new THREE.CylinderGeometry(w, w, h, 20);
    let base = new THREE.Mesh(gBase, mat);
    flipper.add(base)

    let gBar = new THREE.BoxGeometry(l, h, w/2);
    let bar = new THREE.Mesh(gBar, mat);
    bar.position.x += l/2;
    bar.position.z -= w/2
    
    flipper.add(bar)

    return flipper
}