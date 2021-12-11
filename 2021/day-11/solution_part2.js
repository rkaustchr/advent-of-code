const fs = require("fs");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

const grid = [];
let stepFullFlash = 0;

for(let line of input) {
	if (!line) continue;
	grid.push( line.split('').map(l => parseInt(l)) );
}

/*
First, the energy level of each octopus increases by 1.
Then, any octopus with an energy level greater than 9 flashes. This increases the energy level of all adjacent octopuses by 1, 
	including octopuses that are diagonally adjacent. If this causes an octopus to have an energy level greater than 9, 
	it also flashes. This process continues as long as new octopuses keep having their energy level increased beyond 9. 
	(An octopus can only flash at most once per step.)
Finally, any octopus that flashed during this step has its energy level set to 0, as it used all of its energy to flash.
*/

function flash(row, col) {
	for(let r = row-1; r <= row+1; r++) {
		for(let c = col-1; c <= col+1; c++) {
			if ( r<0 || c<0 || r >= grid.length || c >= grid[0].length) continue;

			grid[r][c]++;
			if (grid[r][c] == 10)
				flash(r, c);
		}
	}
}

let steps = 0;
while (stepFullFlash == 0) {
	steps++
	let toFlashQueue = [];
	for(let r=0; r < grid.length; r++) {
		for(let c=0; c < grid[0].length; c++) {
			grid[r][c]++;
			if (grid[r][c] > 9)
				toFlashQueue.push([r, c]);
		}
	}

	while (toFlashQueue.length) {
		let [r, c] = toFlashQueue.shift();
		flash(r, c);
	}

	let numFlashes = 0;
	for(let r=0; r < grid.length; r++) {
		for(let c=0; c < grid[0].length; c++) {
			if (grid[r][c] > 9) {
				grid[r][c] = 0;
				numFlashes++;
			}
		}
	}

	if (numFlashes == 100)
		stepFullFlash = steps;
}

console.log(`Full Flashes Step: ${stepFullFlash}`);