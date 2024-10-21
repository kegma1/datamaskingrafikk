/**
 *
 * @param image
 * @param width
 * @param height
 * @returns {Float32Array}: Et array med en høydeverdi per piksel.
 */
export function getHeigtdataFromImage(image, width, height, divisor= 3) {
	// Lager et temporært canvas-objekt:
	let canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	// Henter ut en 2D-context som gjør at man kan tegne på canvaset:
	let context = canvas.getContext('2d');
	let size = width * height;
	// Lager et Float32Array som kan holde på alle pikslene til canvaset:
	let heightData = new Float32Array(size);
	// Tegner image på  canvaset:
	context.drawImage(image, 0, 0);
	// Nullstiller heightData-arrayet:
	for (let i = 0; i < size; i++) {
		heightData[i] = 0;
	}

	//imageData = et ImageData-objekt. Inneholder pikseldata. Hver piksel består av en RGBA-verdi (=4x8 byte).
	let imageData = context.getImageData(0, 0, width, height);

	// pixelDataUint8 = et Uint8ClampedArray - array. Uint8, tilsvarer en byte (0-255).
	// Pikseldata ligger etter hverandre i pixelDataUint8. 4 byte per piksel.
	let pixelDataUint8 = imageData.data;
	let j = 0;
	//Gjennomløper pixelDataUint8, piksel for piksel (i += 4).
	// Setter heightData for hver piksel lik summen av fargekomponentene / 3:
	for (let i = 0, n = pixelDataUint8.length; i < n; i += 4) {
		let sumColorValues = pixelDataUint8[i] + pixelDataUint8[i + 1] + pixelDataUint8[i + 2];
		heightData[j++] = sumColorValues / divisor;
	}
	return heightData;
}

/**
 * Fra radianer til grader.
 * @param angle
 * @returns {degree}
 */
export function toDegrees (angle) {
	return angle * (180 / Math.PI);
}

/**
 * Fra grader til radianer.
 * @param angle
 * @returns {radian}
 */
export function toRadians (angle) {
	return angle * (Math.PI / 180);
}
