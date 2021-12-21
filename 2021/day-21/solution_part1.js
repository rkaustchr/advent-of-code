const fs = require("fs");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

let players = [];

players.push( parseInt(input[0].split(': ')[1]) );
players.push( parseInt(input[1].split(': ')[1]) );

let points = [ 0, 0 ];

let rounds = 0;
let die = 0;

function getNextNumber(die) {
    return die == 100 ? 1 : die+1; 
}

let index = 0;
while ( points[0] < 1000 && points[1] < 1000 ) {
    let sum = 0;
    for(let i=0; i < 3; i++) {
        die = getNextNumber(die);
        sum += die;
    }
    let point = (players[ index ] + sum) % 10;
    if (point == 0) point = 10;

    players[ index ] = point;
    points[ index ] += point;

    index = (index + 1) % 2;
    rounds += 3;
}

console.log(` Result: ${ Math.min(points[0], points[1]) * rounds }`);
