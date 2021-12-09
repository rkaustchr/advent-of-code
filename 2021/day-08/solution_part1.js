const fs = require("fs");
//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

let counter = 0;
for( let line of input ) {
	if (!line) continue;

	const input = line.split(' | ');
	let out = input[1].split(" ");

	for (let o of out) {
		if ([2, 3, 4, 7].includes(o.length))
			counter++;
	}
}

console.log(`Conter: ${counter}`);