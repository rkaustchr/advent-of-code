const fs = require('fs');

async function main() {
    const file = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    const lines = file.split('\n');

    const seeds = lines.shift().split(': ')[1].split(' ').map(n => +n);
    lines.shift(); // remove empty line;

    let currStatus = new Set(seeds);
    while (lines.length) {
        const nextStatus = new Set();
        const block = parseNextBlock(lines);
        for (const { origin, dest, range } of block.map) {
            for (const val of [...currStatus]) {
                if ( val >= origin && val <= origin + range - 1 ) {
                    const diff = val - origin;
                    nextStatus.add( dest + diff );
                    currStatus.delete(val);
                }
            }
        }

        // move foward the ones that wasn't mapped
        for(const val of [...currStatus])
            nextStatus.add(val);

        currStatus = nextStatus;
    }

    const min = Math.min( ...currStatus );

    console.log("Result: %d", min); // 214922730

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function parseNextBlock(lines) {
    // seed-to-soil map:
    // 50 98 2
    // 52 50 48
    
    let header = lines.shift();
    header = header.split(' ')[0];
    const [ from, _to , to ] = header.split('-');
    
    const block = {
        from,
        to,
        map: [
            // { origin: dest: range: }
        ],
    }
    while ( lines.length ) {
        const line = lines.shift();
        if (line == '')
            break;
        const [ dest, origin, range ] = line.split(' ').map(n => +n);
        block.map.push(
            { origin, dest, range, }
        );
    }

    return block;
}