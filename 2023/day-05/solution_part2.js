const fs = require('fs');

async function main() {
    const file = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    const lines = file.split('\n');

    const seedsRange = lines.shift().split(': ')[1].split(' ').map(n => +n);
    lines.shift(); // remove empty line;

    const seeds = new Set();
    for (let i=0; i < seedsRange.length; i += 2)
        seeds.add( { start: seedsRange[ i ], end: seedsRange[ i ] + seedsRange[ i + 1 ] - 1 } );

    let currStatus = seeds;
    while (lines.length) {
        const nextStatus = new Set();
        const block = parseNextBlock(lines);
        const queue = [...currStatus];
        let idx = 0;
        while ( idx < queue.length ) {
            let { start, end } = queue[idx];
            for (const { origin, dest, range } of block.map) {
                intersectionStart = Math.max(start, origin);
                intersectionEnd = Math.min(end, origin + range - 1);
                if ( intersectionStart <= intersectionEnd ) {
                    const diff = intersectionStart - origin;
                    nextStatus.add( { start: dest + diff, end: dest + (intersectionEnd - origin) } );

                    // slice current 
                    if ( intersectionStart > start )
                        queue.push( { start, end: intersectionStart - 1 });
                    if ( intersectionEnd < end )
                        queue.push( { start: intersectionEnd + 1, end });

                    // remove* current element
                    queue[idx] = {start: -1, end: -1 }
                    break;
                }
            }
            idx++;
        }

        // move foward the ones that wasn't mapped
        for(const val of queue)
            if (val.start != -1)
                nextStatus.add(val);

        currStatus = nextStatus;
    }

    let min = Infinity;
    for (const {start, _end} of [...currStatus])
        if ( start < min )
            min = start

    console.log("Result: %d", min); // 148041808

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