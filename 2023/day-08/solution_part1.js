const fs = require('fs');

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

    const startNode = 'AAA';
    const endNode = 'ZZZ';

    let currNode = startNode;
    let steps = 0;
    let currCmd = 0;
    while (currNode != endNode) {
        currNode = graph[ currNode ][ cmds[ currCmd ] ];

        currCmd++;
        if ( currCmd >= cmds.length )
            currCmd = 0;
        steps++;
    }

    console.log("Result: %d", steps);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();