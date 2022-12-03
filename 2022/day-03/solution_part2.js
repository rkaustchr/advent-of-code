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

function getComum(bags) {
    const maps = [];

    for( const bag of bags) {
        const map = {};
        for(const c of bag)
            map[ c ] = true;
        maps.push( map );
    }

    for(const c in maps[0]) {
        let flag = true;    
        for(const map of maps) {
            if (!map[ c ]) {
                flag = false;
                break;
            }
        }
        if (flag)
            return c;
    }
}

async function main() {
    const linesStream = await getFileStreamLines('./input.txt');

    let totalPriority = 0;
    let groups = [];
    for await (const line of linesStream) {
        groups.push(line);
        if (groups.length == 3) {
            const comum = getComum( groups );
            totalPriority += priority[ comum ];
            groups = [];
        }
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