const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const counter = {};
    let card = 1;
    for await (const line of linesStream) {
        const [ _game, numbers ] = line.split(': ');
        const [ winStr, elfStr ] = numbers.split(' | ');
        const winers = new Set(extractNumbers( winStr ));
        counter[ card ] = (counter[ card ] || 0) + 1;
        let points = 0;
        for(const num of extractNumbers(elfStr)) {
            if ( winers.has(num) )
                points++;
        }

        while (points > 0) {
            counter[ card + points ] = (counter[ card + points ] || 0) + counter[ card ];
            points--;
        }

        card++;
    }

    let total = 0;
    for (let i=1; i < card; i++) {
        total += counter[ i ];
    }
    
    console.log("Result: %d", total);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function extractNumbers( str ) {
    return str.split(/[ ]+/g).filter(n => n.length > 0).map(n => +n);
}
