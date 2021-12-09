const fs = require("fs");
//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

let matrix = [];
let sum = 0;

for( let line of input ) {
	if (!line) continue;
	matrix.push( line.split('').map(l => parseInt(l)) );
}

for (let r=0; r < matrix.length; r++) {
	for (let c=0; c < matrix[r].length; c++) {

		if ( r > 0 && matrix[r][c] >= matrix[r-1][c] ) continue;
		if ( c > 0 && matrix[r][c] >= matrix[r][c-1] ) continue;
		if ( r < matrix.length-1 && matrix[r][c] >= matrix[r+1][c] ) continue;
		if ( c < matrix[r].length-1 && matrix[r][c] >= matrix[r][c+1] ) continue;

		sum += 1 + matrix[r][c];

		c++; // skip next, because for sure it's bigger
	}
}

console.log(`Sum: ${sum}`);