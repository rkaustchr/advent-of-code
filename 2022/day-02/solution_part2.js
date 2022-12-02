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

function getPoints(moveA, moveB) {
    // A -> Rock; B -> Paper; C -> Scissors
    // X -> Rock; Y -> Paper; Z -> Scissors
    // Rock -> 1; Paper -> 2; Scissors ->  3
    // Lost -> 0; Draw -> 3; Win -> 6

    const map = {
        'X': {
            'A': 4, // draw + rock
            'B': 1, // lost + rock
            'C': 7, // win + rock
        },
        'Y': {
            'A': 8, // win + paper
            'B': 5, // draw + paper
            'C': 2, // lost + paper
        },
        'Z': {
            'A': 3, // lost + scissors
            'B': 9, // win + scissors
            'C': 6, // draw + scissors
        },
    };

    return map[moveA][moveB];
}

function getMove(moveA, outcome) {
    // X means you need to lose, 
    // Y means you need to end the round in a draw, and 
    // Z means you need to win
    const map = {
        'A': { // Rock
            'X': 'Z', // scissor
            'Y': 'X', // rock
            'Z': 'Y', // paper
        },
        'B': { // Paper
            'X': 'X', // rock
            'Y': 'Y', // paper
            'Z': 'Z', // scissor
        },
        'C': { // Scissor
            'X': 'Y', // paper
            'Y': 'Z', // scissor
            'Z': 'X', // rock
        },
    }

    return map[moveA][outcome];
}

async function main() {
    const linesStream = await getFileStreamLines('./input.txt');

    let totalScore = 0;
    for await (const line of linesStream) {
        const [ move, outcome ] = line.split(' ');
        const myMove = getMove(move, outcome);
        totalScore += getPoints(myMove, move);
    }

    console.log("Total score: %f", totalScore);

    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();