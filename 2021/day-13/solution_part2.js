const fs = require("fs");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

let points = [];

function printCode(points) {
	let [ maxX, maxY ] = points.reduce((prev, curr) => [ Math.max(prev[0], curr.x), Math.max(prev[1], curr.y)  ] , [0, 0])

	let matrix = new Array(maxY + 1);
	for(let i=0; i <= maxY; i++)
		matrix[i] = new Array(maxX + 1).fill(' ');

	for(let point of points) 
		matrix[ point.y ][ point.x ] = '#';

	let out = [];
	for (let line of matrix)
		out.push( line.join('') );

	console.log( out );
}

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

	points = fold(points, axis, +pos);
}

printCode(points);

console.log(`Remaining points: ${points.length}`);
