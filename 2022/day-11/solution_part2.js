const fs = require('fs');

function evalOp(val, fn) {
    let new_val = 0;
    let old = val;
    eval( fn.replace('new', 'new_val') );
    return new_val;
}

async function main() {
    const monkeys = parseFile('./input.txt');
    const rounds = 10000;

    //
    // Chinese Remainder Theorem
    //      * https://brilliant.org/wiki/chinese-remainder-theorem/
    //
    // We want to know for each item if it is divisible by e.g. 23,19,13,17
    // If we just wanted to know if its divisible by 23, we can just keep track of the number modulo 23.
    // x + a is divisible by 23 iff (x%23)+a is divisible by 23
    // x * a is divisible by 23 iff (x%23)*a is divisible by 23
    // We can keep track of the number modulo 23*19*13*17
    let lcm = 1;
    for(const monkey of monkeys)
        lcm *= monkey.test;
    
    for(let round=0; round < rounds; round++) {
        for(const monkey of monkeys) {
            while (monkey.items.length) {
                const item = monkey.items.shift();
                monkey.inspects++;
                const worryLevel = evalOp(item, monkey.op) % lcm;
                if ( worryLevel % monkey.test == 0 ) {
                    monkeys[ monkey.truthy ].items.push( worryLevel );
                } else {
                    monkeys[ monkey.falsy ].items.push( worryLevel );
                }
            }
        }
    }

    const totalInspections = monkeys.map(m => m.inspects).sort((a, b) => b - a);

    console.log(totalInspections);

    console.log("Monkey Business: %d", totalInspections[0] * totalInspections[1]);
    
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

/* UTILS // */ 
function parseFile(path) {
    const file = fs.readFileSync( path );
    const lines = file.toString().split("\n");

    const monkeys = [];

    for (let i = 0; i < lines.length; i++) {
        const _monkeyIdx = lines[i++];
        const items = lines[i++];
        const op = lines[i++];
        const test = lines[i++];
        const truthy = lines[i++];
        const falsy = lines[i++];

        const monkey = {
            items: items.split(": ")[1].split(', ').map(Number),
            op: op.split(": ")[1],
            test: parseInt( test.split(" ").pop() ),
            truthy: parseInt( truthy.split(' ').pop() ),
            falsy: parseInt( falsy.split(' ').pop() ),
            inspects: 0,
        }
        monkeys.push(monkey);
    }

    return monkeys;    
}
/* // UTILS */