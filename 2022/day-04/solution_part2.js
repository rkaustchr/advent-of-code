const fs = require('fs');
const readline = require('readline');

async function main() {
    const linesStream = await getFileStreamLines('./input.txt');

    let overlaps = 0;
    for await (const line of linesStream) {
        const input = line.split(',');
        const [ elf1_start, elf1_end ] = input[0].split('-').map(n => parseInt(n));
        const [ elf2_start, elf2_end ] = input[1].split('-').map(n => parseInt(n));

        if( elf1_start <= elf2_start ) {
            if (elf1_end < elf2_start) 
                continue;
        } else {
            if (elf2_end < elf1_start) 
                continue;
        }

        overlaps++;
        console.log(`%d - %d -- %d - %d`, elf1_start, elf1_end, elf2_start, elf2_end);
        console.log("    -> interlaps")
    }

    console.log("Full interlaps: %f", overlaps);

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