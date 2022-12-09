const fs = require('fs');
const readline = require('readline');


class Vector {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    increment(dir) {
        switch(dir) {
            case 'R':
                this.x++;
                break;
            case 'L':
                this.x--;
                break;
            case 'U':
                this.y++;
                break;
            case 'D':
                this.y--;
                break;
        }
    }

    diff(vector) {
        return Math.max(
            Math.abs(this.x - vector.x),
            Math.abs(this.y - vector.y)
        );
    }

    follow(vector) {
        if (this.x == vector.x && this.y == vector.y)
            return;

        if (this.x == vector.x) {
            if (this.y > vector.y) {
                this.increment('D');
            } else {
                this.increment('U');
            }
        } else if (this.y == vector.y) {
            if (this.x > vector.x) {
                this.increment('L');
            } else {
                this.increment('R');
            }
        // diagonal
        } else {
            if (this.x < vector.x) {
                this.increment('R');
            } else {
                this.increment('L');
            }

            if (this.y < vector.y) {
                this.increment('U');
            } else {
                this.increment('D');
            }
        }
    }

    getPosKey() {
        return `${this.x},${this.y}`;
    }
}

async function main() {
    const linesStream = await getFileStreamLines('./input.txt');

    const HEAD = 0;
    const TAIL = 9;
    const rope = [];
    for(let i=0; i < 10; i++)
        rope.push(new Vector());

    const set = new Set();

    set.add( rope[ TAIL ].getPosKey() );

    let dir, steps, body;
    for await (const line of linesStream) {
        [ dir, steps ] = line.split(' ');
        steps = +steps;
        while(steps) {
            rope[ HEAD ].increment(dir);
            steps--;
            body = 1;
            while ( body <= TAIL && rope[ body ].diff( rope[ body-1 ] ) > 1 ) {
                rope[ body ].follow( rope[ body-1 ] );
                body++;
            }
            set.add( rope[ TAIL ].getPosKey() );
        }
    }
    
    console.log("Total Pos: %d", set.size);
    
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