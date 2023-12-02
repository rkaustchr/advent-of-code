const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    let sum = 0;
    let game, mins;
    for await (const line of linesStream) {
        game = parseGame(line);
        mins = game.rounds.reduce((acc, curr) =>  {
                        return {
                            red: Math.max(curr.red, acc.red),
                            green: Math.max(curr.green, acc.green),
                            blue: Math.max(curr.blue, acc.blue),
                        };
                    },
                    { red: 0, green: 0, blue: 0 }
                );
         
        sum += mins.red * mins.green * mins.blue;
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