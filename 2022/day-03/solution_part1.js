const fs = require('fs');
const readline = require('readline');

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const priority = {};
let val = 1;

// lowercase
for(const char of alphabet)
    priority[ char ] = val++;
// uppercase
for(const char of alphabet.toUpperCase())
    priority[ char ] = val++;

function getComum(bagA, bagB) {
    const map = {};
    for(const c of bagA)
        map[ c ] =  true;
        
    for(const c of bagB)
        if (map[ c ])
            return c;
}

async function main() {
    const linesStream = await getFileStreamLines('./input.txt');

    let totalPriority = 0;
    for await (const line of linesStream) {
        const mid = line.length / 2;
        const comum = getComum( line.slice(0, mid), line.slice(mid) );
        totalPriority += priority[ comum ];
    }

    console.log("Total priority: %f", totalPriority);

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