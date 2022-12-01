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

function insertSort(arr, el, maxNum) {
    arr.push(el);
    let idx = arr.length -1;
    while( idx > 0 && arr[idx] > arr[idx-1]) {
        const tmp = arr[idx];
        arr[idx] = arr[idx-1]
        arr[idx-1] = tmp; 
        idx--;
    }

    if(arr.length > maxNum)
        arr.pop();

    return arr;
}

async function main() {
    const linesStream = await getFileStreamLines('./input.txt');
    
    let mostCalories = [];
    let currentCalories = 0;
    for await (const line of linesStream) {
        if ( line == "" ) {
            mostCalories = insertSort(mostCalories, currentCalories, 3);
            currentCalories = 0;
            continue;
        }

        currentCalories += parseInt( line );
    }
    mostCalories = insertSort(mostCalories, currentCalories, 3);

    console.log("Most calories: %o", mostCalories);
    console.log("Most calories total: %d", mostCalories.reduce((acc, el) => acc + el, 0));

    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();