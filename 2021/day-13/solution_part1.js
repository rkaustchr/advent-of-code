const fs = require("fs");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

let points = [];

function fold(points, axis, pos) {
	let newPoints = [];
	let mapPoints = {};

	for (let point of points) {
		if (point[ axis ] == pos) {
			continue;
		} else if (point[ axis ] - pos < 0) {
			if ( mapPoints[`${point.x}-${point.y}`] ) continue;
		} else {
			point[ axis ] = pos - (point[ axis ] - pos);
			
			if ( mapPoints[`${point.x}-${point.y}`] ) continue;
		}

		mapPoints[`${point.x}-${point.y}`] = true;

		newPoints.push( point );
	}

	return newPoints;
}

// read points
while (true) {
	let line = input.shift();
	if (line.length == 0) break;

	let [pX, pY] = line.split(',').map(p => parseInt(p));

	points.push({ x: pX, y: pY });
}

// read foldings
for(let line of input) {
	if (!line) continue;

	//fold along x=655
	let [axis, pos] = line.split(' ').pop().split('=');

	points = fold(points, axis, pos);

	break;
}

console.log(`Remaining points: ${points.length}`);
