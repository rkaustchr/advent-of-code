const fs = require("fs");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

const mapping = {};
let startPattern = input.shift();
const lastElement = startPattern[ startPattern.length-1 ];

for(let line of input) {
	if (!line) continue;
	// CH -> B
	let [input, output] = line.split(' -> ');

	mapping[ input ] = output;
}

/*
	To avoid memory overflow, use the "states machine" to keep only the
		active states in memory

	Each state represents an element and it stores the amount of times
		this elements shows up.
*/

let states = {};
for(let i=0; i < startPattern.length-1; i++) {
	let element = startPattern.substring(i, i+2);
	if ( !states[ element ] ) states[ element ] = 0;
	states[ element ]++;
}

for (let i=0; i < 40; i++) {
	let nextStates = {};
	for(let element in states) {
		if (! mapping[ element ]) continue;

		let conversion = mapping[ element ];
		let prod1 = element[0]+conversion;
		let prod2 = conversion+element[1];

		if ( !nextStates[ prod1 ]) nextStates[ prod1 ] = 0;
		if ( !nextStates[ prod2 ]) nextStates[ prod2 ] = 0;

		nextStates[ prod1 ] += states[ element ];
		nextStates[ prod2 ] += states[ element ];
	}
	states = nextStates;
}

let elementsCount = {};
for(let element in states) {
	if (!elementsCount[ element[0] ]) elementsCount[ element[0] ] = 0;

	elementsCount[ element[0] ] += states[ element ];
}
elementsCount[ lastElement ]++;

let mostElement = 0;
let leastElement = Number.MAX_SAFE_INTEGER;
for(let element in elementsCount) {
	if (elementsCount[ element ] > mostElement) mostElement = elementsCount[ element ];
	if (elementsCount[ element ] < leastElement) leastElement = elementsCount[ element ];
}

console.log(`result: ${mostElement - leastElement}`);
