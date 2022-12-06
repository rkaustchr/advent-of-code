const fs = require('fs');
const readline = require('readline');

const MARKER_LEN = 4;

async function main() {
    const linesStream = await getFileStreamLines('./input.txt');

    for await (const line of linesStream) {
        let idx = 0;
        const hashmap = {};

        for(idx=0; idx < MARKER_LEN; idx++)
            hashmap[ line[ idx ] ] = (hashmap[ line[ idx ] ] || 0) + 1;

        while ( Object.keys(hashmap).length != MARKER_LEN ) {
            const out = line[ idx - MARKER_LEN ];
            hashmap[ out ]--;

            if( hashmap[ out ] == 0 )
                delete hashmap[ out ];

            hashmap[ line[ idx ] ] = (hashmap[ line[ idx ] ] || 0) + 1;
            idx++;
        }

        console.log("Indexes: %d", idx);
    }

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