const fs = require("fs");
//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

let matrix = [];
let maxBasins = [0,0,0, 0]; // the aditional position is just for saving the process of push and pop on the array
let visited = {};
let sum = 0;

for( let line of input ) {
	if (!line) continue;
	matrix.push( line.split('').map(l => parseInt(l)) );
}

function findBasin(r, c) {
	let queue = [ [r, c] ];
	let size = 0;

	while (queue.length) {
		let [ _r, _c ] = queue.pop();
		if ( visited[`${_r}-${_c}`] ) continue;
		visited[`${_r}-${_c}`] = true;
		size++;

		// find neighbors that are bigger
		if ( _r > 0 && !visited[`${_r-1}-${_c}`] && matrix[_r-1][_c] < 9 && matrix[_r][_c] < matrix[_r-1][_c] ) queue.push([_r-1, _c]);
		if ( _c > 0 && !visited[`${_r}-${_c-1}`] && matrix[_r][_c-1] < 9 && matrix[_r][_c] < matrix[_r][_c-1] ) queue.push([_r, _c-1]);
		
		if ( _r < matrix.length-1 && !visited[`${_r+1}-${_c}`] && matrix[_r+1][_c] < 9 && matrix[_r][_c] < matrix[_r+1][_c] ) queue.push([_r+1, _c]);
		if ( _c < matrix[_r].length-1 && !visited[`${_r}-${_c+1}`] && matrix[_r][_c+1] < 9 && matrix[_r][_c] < matrix[_r][_c+1] ) queue.push([_r, _c+1]);
	}

	return size;
}


for (let r=0; r < matrix.length; r++) {
	for (let c=0; c < matrix[r].length; c++) {
		if (visited[`${r}-${c}`]) continue;

		if ( r > 0 && matrix[r][c] >= matrix[r-1][c] ) continue;
		if ( c > 0 && matrix[r][c] >= matrix[r][c-1] ) continue;
		if ( r < matrix.length-1 && matrix[r][c] >= matrix[r+1][c] ) continue;
		if ( c < matrix[r].length-1 && matrix[r][c] >= matrix[r][c+1] ) continue;

		let tempSize = findBasin(r, c);

		if (maxBasins[3] < tempSize) {
			maxBasins[3] = tempSize;

			// insertionSort
			let i=3;
			while(i>0 && tempSize > maxBasins[i-1]) {
				maxBasins[i] = maxBasins[i-1];
				i--;
			}
			maxBasins[i] = tempSize;
		}

		c++; // skip next, because for sure it's bigger
	}
}

console.log(`Result: ${maxBasins[0] * maxBasins[1] * maxBasins[2]}`);