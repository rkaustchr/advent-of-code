const fs = require("fs");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

// target area: x=20..30, y=-10..-5
let targetInput = input[0].split('x=')[1].split(', y=');
let targetX = targetInput[0].split('..').map(i => parseInt(i));
let targetY = targetInput[1].split('..').map(i => parseInt(i));

const target = {
    minX: targetX[0],
    maxX: targetX[1],
    minY: targetY[0],
    maxY: targetY[1],
}

function hitTarget(probe, target) {
    return probe.pos.x >= target.minX && probe.pos.x <= target.maxX
                &&  probe.pos.y >= target.minY && probe.pos.y <= target.maxY;
}

function step( probe ) {
    /*
    The probe's x position increases by its x velocity.
    The probe's y position increases by its y velocity.
    Due to drag, the probe's x velocity changes by 1 toward the value 0; 
        that is, it decreases by 1 if it is greater than 0, increases by 1 if it is less than 0, 
        or does not change if it is already 0.
    Due to gravity, the probe's y velocity decreases by 1.
    */
    probe.pos.x += probe.velocity.x;
    probe.pos.y += probe.velocity.y;

    if (probe.velocity.x > 0)
        probe.velocity.x--; 
    if (probe.velocity.x < 0)
        probe.velocity.x++;
    
    probe.velocity.y--;

    return probe;
}

function missed( probe, target ) {
    return probe.pos.x > target.maxX || probe.pos.y < target.minY;
}

function shoot( probe, target ) {
    let maxY = -9999;
    while(1) {
        if (probe.pos.y > maxY)
            maxY = probe.pos.y;

        if ( hitTarget( probe, target ) )
            return maxY;

        if ( missed( probe, target )  )
            return null;
        
        probe = step(probe);
    }
}

let maxY = target.minY;

for(let startX = 0; startX < 1001; startX++) {
    for(let startY = -1000; startY < 1001; startY++) {
        let probe = {
            pos: {
                x: 0,
                y: 0,
            },
            velocity: {
                x: startX,
                y: startY,
            }
        };

        let height = shoot( probe, target );
        
        if ( height && height > maxY )
            maxY = height;
    }
}

console.log(target);

console.log(`Max height: ${ maxY }`);
