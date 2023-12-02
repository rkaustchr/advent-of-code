const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    // 12 red cubes, 13 green cubes, and 14 blue cubes?
    let sum = 0;
    let game, invalid;
    for await (const line of linesStream) {
        game = parseGame(line);
        invalid = game.rounds.find(r => r.red > 12 || r.green > 13 || r.blue > 14);
         if ( invalid == undefined )
            sum += game.id;
    }
    
    console.log("Result: %d", sum);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

function parseGame(str) {
    // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
    let [ game, plays ] = str.split(': ');
    const gameId = +game.split(' ')[1];
    const rounds = [];
    for(const round of plays.split('; ')) {
        const result = { 'red': 0, 'blue': 0, 'green': 0 };
        for(const value of round.split(', ')) {
            const [ amount, color ] = value.split(' ');
            result[ color ] = +amount;
        }
        rounds.push(result);
    }

    return {
        id: gameId,
        rounds,
    }
}

main();