const fs = require("fs");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

const dictScore = {
	')': 3,
	']': 57,
	'}': 1197,
	'>': 25137,
};

const dictCount = {
	')': 0,
	']': 0,
	'}': 0,
	'>': 0,
};

const openings = "([{<";
const matching = {
	')': '(',
	']': '[',
	'}': '{',
	'>': '<',
};

for( let line of input ) {
	if (!line) continue;
	let seq = line.split('');
	let queue = [];
	for(let char of seq) {
		if (openings.includes(char)) queue.push(char);
		else {
			if (queue.length == 0 || matching[ char ] != queue.pop()) {
				dictCount[ char ]++;
				break;
			}
		}
	}
}

let sum = 0;
for(let key in dictCount) {
	sum += dictScore[ key ] * dictCount[ key ];
}

console.log(`Sum: ${sum}`);