const { count } = require("console");
const fs = require("fs");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

class Cube {
    constructor(action, x, y, z) {
        this.action = action;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    getVolume() {
        return (this.x[1] - this.x[0] + 1) * (this.y[1] - this.y[0] + 1) * (this.z[1] - this.z[0] + 1); 
    }
}

function getOverlap(cube1, cube2) {
    if ( cube1.x[0] > cube2.x[1] ) return [ false, null ];
    if ( cube1.x[1] < cube2.x[0] ) return [ false, null ];
    let x = [ Math.max( cube1.x[0], cube2.x[0] ), Math.min( cube1.x[1], cube2.x[1] ) ];
    
    if ( cube1.y[0] > cube2.y[1] ) return [ false, null ];
    if ( cube1.y[1] < cube2.y[0] ) return [ false, null ];
    let y = [ Math.max( cube1.y[0], cube2.y[0] ), Math.min( cube1.y[1], cube2.y[1] ) ];
    
    if ( cube1.z[0] > cube2.z[1] ) return [ false, null ];
    if ( cube1.z[1] < cube2.z[0] ) return [ false, null ];
    let z = [ Math.max( cube1.z[0], cube2.z[0] ), Math.min( cube1.z[1], cube2.z[1] ) ];

    if ( x[0] <= x[1] && y[0] <= y[1] && z[0] <= z[0] )
        return [ true, new Cube("off", x, y, z)];

    return [ false, null ];
}

function countVolume(cubes, index) {
    let currCube = cubes[index];
    let totalVolume = currCube.getVolume();

    let overlapedCubes  = [];
    for (let i=index+1; i < cubes.length; i++) {
        let [ overlaps, overlapedCube ] = getOverlap(currCube, cubes[i]);

        if (!overlaps) continue;

        overlapedCubes.push( overlapedCube );
    }

    for (let i = 0;  i < overlapedCubes.length; i++) {
        totalVolume -= countVolume(overlapedCubes, i);
    }

    return totalVolume;
}

let instructions = [];

for(let line of input) {
    if (!line) continue;

    //on x=-20..26,y=-36..17,z=-47..7
    let [ action, points ] = line.split(" ");
    points = points.split(",");
    let x = points[0].split("=")[1].split("..").map(p => parseInt(p));
    let y = points[1].split("=")[1].split("..").map(p => parseInt(p));
    let z = points[2].split("=")[1].split("..").map(p => parseInt(p));

    if ( x[0] < -50 || x[0] > 50 || 
         x[1] < -50 || x[1] > 50 ||
         y[0] < -50 || y[0] > 50 ||   
         y[1] < -50 || y[1] > 50 ||
         z[0] < -50 || z[0] > 50 ||   
         z[1] < -50 || z[1] > 50 )
            continue;

    instructions.push(new Cube(action, x, y, z));
}

let totalVolume = 0;
for (let i=0; i < instructions.length; i++) {
    let currCube = instructions[ i ];

    if (currCube.action != "on")
        continue;

    totalVolume += countVolume(instructions, i); 
}


console.log(` Total ON: ${ totalVolume }`);
