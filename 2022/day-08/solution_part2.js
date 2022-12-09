const fs = require('fs');
const readline = require('readline');

function getScore(map, r, c) {
    // top
    let scoreTop = 0;
    for(let i=r-1; i >= 0; i--) {
        scoreTop++;
        if ( map[i][c] >= map[r][c] )
            break;
    }
    
    // botton
    let scoreBotton = 0;
    for(let i=r+1; i < map.length; i++) {
        scoreBotton++;
        if ( map[i][c] >= map[r][c] )
            break;
    }

    // right
    let scoreRight = 0;
    for(let i=c+1; i < map[0].length; i++) {
        scoreRight++;
        if ( map[r][i] >= map[r][c] )
            break;
    }

    // left
    let scoreLeft = 0;
    for(let i=c-1; i >= 0; i--) {
        scoreLeft++;
        if ( map[r][i] >= map[r][c] )
            break;
    }

    return scoreTop * scoreBotton * scoreRight * scoreLeft;
}

async function main() {
    const linesStream = await getFileStreamLines('./input.txt');

    const map = [];

    for await (const line of linesStream) {
        map.push( line.split('') );
    }

    let highestScore = 0;

    for(let r=1; r<map.length-1; r++) {
        for(let c=1; c<map[0].length-1; c++) {
            const score = getScore(map, r, c);
            if( score > highestScore )
                highestScore = score;
        }
    }

    console.log("Highest Score: %d", highestScore);
    
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

/* UTILS // */ 
async function getFileStream(path) {
    const fileStream = fs.createReadStream(path);
    return fileStream;
}

async function getFileStreamLines(path) {
    const fileStream = await getFileStream(path);

    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    return rl;
}
/* // UTILS */