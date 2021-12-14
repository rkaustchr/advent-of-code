const fs = require("fs");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

const mapping = {};
let startPattern = input.shift();

for(let line of input) {
	if (!line) continue;
	// CH -> B
	let [input, output] = line.split(' -> ');

	mapping[ input ] = output;
}

let solution = startPattern.split('');
for (let i=0; i < 10; i++) {
	let nextSolution = [];
	for(let idx=0; idx < solution.length-1; idx++) {
		nextSolution.push(solution[idx]);
		let conversion = mapping[ `${solution[idx]}${solution[idx+1]}` ];
		if ( conversion )
			nextSolution.push(conversion);
	}
	nextSolution.push( solution[ solution.length-1 ] );
	solution = nextSolution;
}

let elementsCount = {};
for(let element of solution) {
	if (!elementsCount[ element ]) elementsCount[ element ] = 0;
	elementsCount[ element ]++;
}

let mostElement = elementsCount[ solution[0] ];
let leastElement = elementsCount[ solution[0] ];
for(let element in elementsCount) {
	if (elementsCount[ element ] > mostElement) mostElement = elementsCount[ element ];
	if (elementsCount[ element ] < leastElement) leastElement = elementsCount[ element ];
}

console.log(`result: ${mostElement - leastElement}`);
