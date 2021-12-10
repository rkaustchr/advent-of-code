const fs = require("fs");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

const dictScore = {
	')': 1,
	']': 2,
	'}': 3,
	'>': 4,
};

const openings = "([{<";
const matching = {
	')': '(',
	']': '[',
	'}': '{',
	'>': '<',

	'(': ')',
	'[': ']',
	'{': '}',
	'<': '>',
};

let scores = [];

for( let line of input ) {
	if (!line) continue;
	let seq = line.split('');
	let queue = [];
	let isValid = true;
	for(let char of seq) {
		if (openings.includes(char)) queue.push(char);
		else {
			if (queue.length == 0 || matching[ char ] != queue.pop()) {
				isValid = false;
				break;
			}
		}
	}

	if (!isValid) continue;

	let sum = 0;
	while (queue.length) {
		let char =  matching[ queue.pop() ];
		sum *= 5;
		sum += dictScore[ char ]; 
	}

	scores.push(sum);
}

scores.sort((a, b) => a - b);
console.log(`Mean: ${scores[ parseInt(scores.length / 2) ]}`);
