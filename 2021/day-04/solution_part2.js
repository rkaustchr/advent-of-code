const fs = require("fs");
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

class Board {
    constructor(board) {
        this.board = board;
        this.cols = [5, 5, 5, 5, 5];
        this.rows = [5, 5, 5, 5, 5];
        this.isWiner = false;
    }

    setNumber(num) {
        if (this.isWiner) return;

        for (let i=0; i < 5; i++) {
            for (let j=0; j < 5; j++) {
                if (this.board[i][j] == num) {
                    this.rows[i]--;
                    this.cols[j]--;
                    this.board[i][j] = -1;
                    this.checkWin();
                    return;
                }
            }
        }
    }

    checkWin() {
        for (let i=0; i < 5; i++) {
            if (this.cols[i] == 0 || this.rows[i] == 0) {
                this.isWiner = true;
            }
        }
    }

    getPoints() {
        let points = 0;
        for (let i=0; i < 5; i++) {
            for (let j=0; j < 5; j++) {
                if (this.board[i][j] >= 0) {
                    points += this.board[i][j];
                }
            }
        }
        return points;
    }
}

// First line are the sorted numbers
let numbers = input[0].split(',').map(n => parseInt(n));

console.log(numbers); 

// load boards
let boards = [];
let _board = [];
for (let i=2; i < input.length; i++) {
    let line = input[i];
    if ( !line ) {
        boards.push(new Board(_board));
        _board = [];
        continue;
    }

    let parsed = line.split(' ').map(l => parseInt(l)) 
    _board.push( parsed.filter(p => !isNaN(p)) );
}

console.log(boards);

console.log(boards.length);


function runGame() {
    let lastWon;
    let tempBoards = [].concat(boards);
    for(let i=0; i < numbers.length; i++) {
        for(board of tempBoards) {
            board.setNumber(numbers[i]);

            if (board.isWiner) {
                if ( tempBoards.length > 1  ) continue;

                let points = board.getPoints() * numbers[i];
                console.log(" W I N E R ")
                console.log(board.board);
                console.log(board.getPoints());
                return points;
            }
        }
        tempBoards = tempBoards.filter(b => !b.isWiner);
        //console.log(tempBoards);
        console.log(tempBoards.length);
    }
}

console.log(runGame());


