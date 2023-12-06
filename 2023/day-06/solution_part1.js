const fs = require('fs');

async function main() {
    const file = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    const lines = file.split('\n');

    const times = lines[0].split(/[ ]+/).map(n => +n);
    const distances = lines[1].split(/[ ]+/).map(n => +n);

    // remove the first text
    times.shift();
    distances.shift();
    
    let total = 1;
    for (let i=0; i < times.length; i++) {
        // get the speed needed to reach distance d + 1 which time t - speed
        //  dS = dD / dT --> s = (d+1) / (t-s); solve for s -> -s^2 + ts - (d+1)
        const xs = quadraticSolver(-1, times[i], -(distances[i]+1));

        // get one solution point and then use binary search to get the boundaries where solution still valid
        const point = Math.trunc((Math.round(xs[0]) + Math.round(xs[1])) / 2);

        // left side Binary Search
        let [ l, r ] = [ 1,  point ];
        let minHolding = point;
        while ( l <= r ) {
            const holdingTime = l + Math.floor( (r - l )/ 2 );
            const dist = holdingTime * (times[i] - holdingTime);

            // valid solution
            if ( dist > distances[i] ) {
                minHolding = holdingTime;
                r = holdingTime - 1;
            } else {
                l = holdingTime + 1;
            }
        }

        // right side Binary Search
        //[ l, r ] = [ point,  times[i] - 1 ];
        l = point;
        r = times[i] - 1;
        let maxHolding = point;
        while ( l <= r ) {
            const holdingTime = l + Math.floor( (r - l )/ 2 );
            const dist = holdingTime * (times[i] - holdingTime);

            // valid solution
            if ( dist > distances[i] ) {
                maxHolding = holdingTime;
                l = holdingTime + 1;
            } else {
                r = holdingTime - 1;
            }
        }

        const ways = maxHolding - minHolding + 1;

        total *= ways;
    }
    
    console.log("Result: %d", total);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

// Assuming that b^2 -4ac > 0; so output two real roots
function quadraticSolver(a, b, c) {
    const delta = Math.sqrt((b**2) - 4*a*c);
    // + solution
    const x1 = (-b + delta) / (2*a);
    // - solution
    const x2 = (-b - delta) / (2*a);

    return [ x1, x2 ];
}