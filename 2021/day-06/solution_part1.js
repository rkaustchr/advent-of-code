const fs = require("fs");
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

const fishes = input[0].split(',').map(f => parseInt(f));
//const fishes = [3,4,3,1,2]; // test  -> 5934

let totalFishes = 0;
let days = new Array(100).fill(0);

days[0] = fishes.length;

function generateOffspring(days, amount, startDay, maxDays = 80) {
    for(let i = startDay; i <= maxDays; i+=7) {
        days[i] += amount;
        generateOffspring(days, amount, i+9, maxDays);
    }
}

let groups = new Array(7).fill(0);
for( let fish of fishes) {
    groups[fish]++;
}

// offsprings of the first generation
for (let i=0; i < groups.length; i++) {
    if (groups[i] == 0) continue;

    generateOffspring(days, groups[i], i+1);
}

// count fishes
for (let i=0; i < 81; i++)
    totalFishes += days[i];

console.log(` Count ${totalFishes} `);