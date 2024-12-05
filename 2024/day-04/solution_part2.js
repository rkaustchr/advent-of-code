const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const map = [];
    for await (const line of linesStream) {
        map.push( line.split('') );
    }

    let total = 0;
    for(let r=0; r < map.length; r++) {
        for (let c=0; c < map[r].length; c++) {
            if (map[r][c] == 'A' && search(map, "MAS", r, c)) {
                total++;
            }
        }
    }
    
    console.log("Result: %d", total);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

function search(map, word, row, col) {
    if ( row == 0 || row == map.length-1 || col == 0 || col == map[0].length-1)
        return false;

    return (
            (  (map[row-1][col-1] == word[0] && map[row+1][col+1] == word[2])
            || (map[row-1][col-1] == word[2] && map[row+1][col+1] == word[0]))
        &&
            (  (map[row-1][col+1] == word[0] && map[row+1][col-1] == word[2])
            || (map[row-1][col+1] == word[2] && map[row+1][col-1] == word[0]))
    );
}

main();