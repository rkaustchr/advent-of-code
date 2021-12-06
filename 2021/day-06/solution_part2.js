const fs = require("fs");
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

const fishes = input[0].split(',').map(f => parseInt(f));
//const fishes = [3,4,3,1,2]; // test  -> 5934

const numDays = 256;

let totalFishes = 0;
let timers = new Array(9).fill(0);

for( let fish of fishes)
    timers[fish]++;

for (let day=0; day < numDays; day++) {
    let amount = timers.shift();

    //  reinsert itself
    timers[6] += amount;

    // insert offspring
    timers.push(amount); //timers[8];
}


// count fishes
for (let i=0; i < timers.length; i++)
    totalFishes += timers[i];

console.log(` Count ${totalFishes} `);