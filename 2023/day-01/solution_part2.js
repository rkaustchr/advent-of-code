const util = require('./../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const words = [
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
    ];

    const map = {
        "one": 1,
        "two": 2,
        "three": 3,
        "four": 4,
        "five": 5,
        "six": 6,
        "seven": 7,
        "eight": 8,
        "nine": 9,
        "0": 0,
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
    };

    let sum = 0;
    let num;
    let minIdx, minWord, maxIdx, maxWord, idx;
    for await (const line of linesStream) {
        minIdx = line.length;
        maxIdx = -1;
        
        for ( const word of words ) {
            idx = line.indexOf(word);
            if (idx != -1 && idx < minIdx) {
                minIdx = idx;
                minWord = word;
            }
            
            idx = line.lastIndexOf(word);
            if (idx > maxIdx) {
                maxIdx = idx;
                maxWord = word;
            }
        }
        num = parseInt(`${map[minWord]}${map[maxWord]}`);
        sum += num
    }
    
    console.log("The sum is: %d", sum);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();
