const fs = require('fs');

/*
    Examinating the path for each start node, we can notice that each start point has one end point that it meets in a loop
    and because the length of the loop is the same to reach the endpoint, we can use LCM to get the number of steps
*/

async function main() {
    const file = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    const lines = file.split('\n');
    
    const cmds = lines.shift();
    lines.shift(); // new line

    const graph = {};
    for await (const line of lines) {
        const nodes = line.match(/[A-Z]{3}/g);
        const [ node, left, right ] = nodes;
        graph[ node ] = { 'L': left, 'R': right };
    }

    const startNode = new RegExp('..A');
    const endNode = new RegExp('..Z');

    let currNodes = [];
    for (const node in graph) {
        if (startNode.test(node))
            currNodes.push(node);
    }

    let nodeSteps = [];
    for (let i=0; i < currNodes.length; i++) {
        let currCmd = 0;
        let steps = 0;
        do {
            currNodes[i] = graph[ currNodes[i] ][ cmds[ currCmd ] ];
            currCmd++;    
            if ( currCmd >= cmds.length )
                currCmd = 0;
            steps++;
            
        } while (!endNode.test(currNodes[i]));
        nodeSteps.push( steps );
    }

    const result = lcmArray( nodeSteps );

    console.log("Result: %d", result);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();


// Euclidean algorithm > Greatest Common Divisor
// A more efficient variant in which the difference of the two numbers a and b is replaced 
//  by the remainder of the Euclidean division (also called division with remainder) of a by b.
// Denoting this remainder as a mod b, the algorithm replaces (a, b) by (b, a mod b), with a > b
function gcd(a, b) {
    if ( b > a )
        return gcd(b, a);

    while ( b != 0 ) {
        const temp = b;
        b = a % b;
        a = temp;
    }

    return a;
}

// Least Common Multiple
function lcm(a, b) {
    return a * ( b / gcd(a, b) )
}

function lcmArray( arr ) {
    let _lcm = arr.pop();
    while ( arr.length ) {
        _lcm = lcm(_lcm, arr.pop());
    } 
    return _lcm;
}