//
// Pomos: 1.5
//
const util = require('../utils/utils');
const { DoublyLinkedList } = require('./ds/doublyLinkedList');

const memo = {};

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    let instructions = [];
    for await (const line of linesStream) {
        instructions = line.split(',');
    }

    const boxes = [];
    for(let i=0; i < 256; i++)
        boxes.push( new Box() );

    let boxId;
    for(const str of instructions) {
        const [ label, op, lense ] = parse(str);        
        boxId = hash(label);
        if ( op == '-' ) {
            boxes[boxId].remove(label);
        } else {
            boxes[boxId].add(label, lense);
        }
    }

    let total = 0;
    for(let i=0; i < boxes.length; i++) {
        total += (i+1) * boxes[i].computeFocusingPower();
    }
    
    console.log("Result: %d", total);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function parse(str) {
    if ( str.at(-1) == '-' )
        return [ str.substring(0, str.length - 1), '-', 0 ]
    
    return [ str.substring(0, str.length - 2), '=', +str.at(-1) ]
}

function hash(str) {
    if ( memo[str] != undefined )
        return memo[str];

    let res = 0;
    for(let i=0; i < str.length; i++) {
        res += str.charCodeAt(i);
        res *= 17;
        res %= 256;
    }
    memo[str] = res;
    return res;
}

class Box {
    constructor() {
        this.dict = {};
        this.lenses = new DoublyLinkedList();
    }

    remove(label) {
        if ( this.dict[ label ] == undefined )
            return;
        this.lenses.remove( this.dict[ label ] );
        this.dict[ label ] = undefined;
    }

    add(label, lense) {
        if ( this.dict[ label ] == undefined ) {
            this.dict[ label ] = this.lenses.insertLast( lense );
        } else {
            this.dict[ label ].setValue( lense );
        }
    }

    computeFocusingPower() {
        let total = 0;
        this.lenses.forEach((node, position) => {
            total += (position+1) * node.getValue()
        });
        return total;
    }
}