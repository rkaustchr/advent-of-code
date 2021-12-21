const fs = require("fs");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

let players = [];

players.push( parseInt(input[0].split(': ')[1]) );
players.push( parseInt(input[1].split(': ')[1]) );


let cache = [];
for(let i=0; i <= 10; i++) {
    cache[i] = [];
    for(let j=0; j <= 10; j++) {
        cache[i][j] = [];
        for(let k=0; k < 21; k++) {
            cache[i][j][k] = [];
            for(let l=0; l < 21; l++) {
                cache[i][j][k][l] = [];
                for (let m = 0; m < 2; m++)
                    cache[i][j][k][l][m] = null;
            }
        }
    }
}

// Die posible results

// [ 111, 112, 113, 
//   121, 122, 123, 
//   131, 132, 133, 
//   211, 212, 213, 
//   221, 222, 223, 
//   231, 232, 233, 
//   311, 312, 313, 
//   321, 322, 323, 
//   331, 332, 333 ];

// [ 3, 4, 5, 
//   4, 5, 6, 
//   5, 6, 7, 
//   4, 5, 6, 
//   5, 6, 7, 
//   6, 7, 8, 
//   5, 6, 7, 
//   6, 7, 8, 
//   7, 8, 9 ];

const universeMultiplyer = {
    3 : 1,
    4 : 3,
    5 : 6, 
    6 : 7, 
    7 : 6, 
    8 : 3, 
    9 : 1,
};

function computeWins(pos1, pos2, pts1, pts2, turn, lvl = 0) {    
    if ( cache[pos1][pos2][pts1][pts2][turn] )
        return cache[pos1][pos2][pts1][pts2][turn];

    let result = {
        player1: 0,
        player2: 0,
    }

    let players = [ pos1, pos2 ];
    let points = [ pts1, pts2 ];

    for (let key of Object.keys(universeMultiplyer)) {
        let point = (players[ turn ] + parseInt(key)) % 10;
        if (point == 0) point = 10;

        players[ turn ] = point;
        points[ turn ] += point;

        let temp;
        if (points[ turn ] > 20) {
           temp = {
                player1: turn == 0 ? 1 : 0,
                player2: turn == 1 ? 1 : 0,
            };
        } else { 
            temp = computeWins(players[0], players[1], points[0], points[1], (turn+1)%2, lvl+1);
        }
        result.player1 += temp.player1 * universeMultiplyer[ key ];
        result.player2 += temp.player2 * universeMultiplyer[ key ];

        players[ turn ] = turn == 0 ? pos1 : pos2;
        points[ turn ] = turn == 0 ? pts1: pts2;
    }

    cache[pos1][pos2][pts1][pts2][turn] = result;

    return result;
}

console.log(` Result: ${ JSON.stringify(computeWins(players[0], players[1], 0, 0, 0)) }`);
