const fs = require("fs");
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

const positions = input[0].split(',').map(p => parseInt(p));
//const positions = [16,1,2,0,4,2,7,1,2,14]; // test  -> 37

let max = positions[0];
let min = positions[0];
for( let pos of positions) {
    if (pos > max) max = pos;
    else if (pos < min) min = pos;
}

let minDiff = 100000000;
let minPos = min;

for( let i=min; i <= max; i++) {
	let diff = 0;
	for( let pos of positions) {
	    diff += Math.abs(pos - i);
	}

	if (diff < minDiff) {
		minDiff = diff;
		minPos = i;
	}
}

console.log(` Min Pos ${minPos} -> ${minDiff}`);