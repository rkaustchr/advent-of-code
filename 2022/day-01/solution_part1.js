const fs = require('fs');
const readline = require('readline');

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

async function main() {
    const linesStream = await getFileStreamLines('./input.txt');

    let mostCalories = -1;
    let currentCalories = 0;
    for await (const line of linesStream) {
        if ( line == "" ) {
            mostCalories = Math.max(currentCalories, mostCalories);
            currentCalories = 0;
            continue;
        }

        currentCalories += parseInt( line );
    }
    mostCalories = Math.max(currentCalories, mostCalories);

    console.log("Most calories: %f", mostCalories);

    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();