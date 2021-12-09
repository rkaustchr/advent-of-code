const fs = require("fs");
//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

function subtract(item1, item2) {
	let t1 = item1.split('');
	let t2 = item2.split('');

	return t1.filter(i => !t2.includes(i)).join('');
}

function getNumber(input, map) {
	function getDigit(dig, map) {
		switch (dig.length) {
			case 2: return '1';
			case 3: return '7';
			case 4: return '4';
			case 7: return '8';

			case 6: 
				if (!dig.includes(map['d'])) return '0';
				if (!dig.includes(map['e'])) return '9';
				return '6';

			case 5: 
				if (!dig.includes(map['f'])) return '2';
				if (!dig.includes(map['c'])) return '5';
				return '3';
		}
	}

	return parseInt( `${getDigit(input[0],map)}${getDigit(input[1],map)}${getDigit(input[2],map)}${getDigit(input[3],map)}`);
}

let sum = 0;
for( let line of input ) {
	if (!line) continue;

	let digits = {};
	let mapLetters = {};
	let ambigousDigits = { 5: [], 6: []};

	const input = line.split(' | ');
	let _in  = input[0].split(" ");
	let _out = input[1].split(" ");

	for (let i of _in) {
		switch (i.length) {
			case 2: digits[1] = i; break;
			case 3: digits[7] = i; break;
			case 4: digits[4] = i; break;
			case 7: digits[8] = i; break;

			case 5: ambigousDigits[5].push(i); break;
			case 6: ambigousDigits[6].push(i); break;
		}
	}


	// Solve
	// Step 1
	// 7 - 1 -> a
	let temp = subtract(digits[7], digits[1]);
	mapLetters['a'] = temp;

	// Step 2
	//  4 - 1 - ambigous(6) -> when ambigous(6) == 0 -> d | ambigous(6) == 6 or 9 -> empty
	temp = subtract(digits[4], digits[1]);
	while ( ambigousDigits[6].length == 3 ) {
		let temp2 = ambigousDigits[6].pop();
		let temp3 = subtract(temp, temp2);
		if ( temp3 ) {
			mapLetters['d'] = temp3;
			digits[0] = temp2;
		} else {
			ambigousDigits[6].unshift(temp2);
		}
 	}

	// Step 3
	//  ambigous(6) - 7  -> when |4| -> ambigous(6) == 6 | |3| -> ambigous(6) == 9
	while ( ambigousDigits[6].length ) {
		let temp2 = ambigousDigits[6].pop();
		let temp3 = subtract(temp2, digits[7]);
		if ( temp3.length == 3 ) {
			digits[9] = temp2;
		} else {
			digits[6] = temp2;
		}
 	}

	// Step 4
	// 8 - 6 -> c
	temp = subtract(digits[8], digits[6]);
	mapLetters['c'] = temp;

	// Step 5
	// 8 - 9 -> e
	temp = subtract(digits[8], digits[9]);
	mapLetters['e'] = temp;

	// Step 6
	// 9 - 4 - a -> g
	temp = subtract(subtract(digits[9], digits[4]), mapLetters['a']);
	mapLetters['g'] = temp;

	// Step 7
	// 4 - 1 - d -> b
	temp = subtract(subtract(digits[4], digits[1]), mapLetters['d']);
	mapLetters['b'] = temp;

	// Step 8
	// 1 - c -> f
	temp = subtract(digits[1], mapLetters['c']);
	mapLetters['f'] = temp;

	sum += getNumber(_out, mapLetters);
}

console.log(`Sum: ${sum}`);
