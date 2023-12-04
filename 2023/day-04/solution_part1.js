const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    let total = 0;
    for await (const line of linesStream) {
        const [ _game, numbers ] = line.split(': ');
        const [ winStr, elfStr ] = numbers.split(' | ');
        const winers = new Set(extractNumbers( winStr ));
        let points = 0;
        for(const num of extractNumbers(elfStr)) {
            if ( winers.has(num) )
                points++;
        }
        if (points > 0)
            total += 2 ** (points-1);
    }
    
    console.log("Result: %d", total); // 27845

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function extractNumbers( str ) {
    return str.split(/[ ]+/g).filter(n => n.length > 0).map(n => +n);
}