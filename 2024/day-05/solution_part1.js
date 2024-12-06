const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const rules = new Map();
    let currBlock = 1;
    let sumMiddle = 0;
    for await (const line of linesStream) {
        if (line.length == 0)
            currBlock++;

        if (currBlock == 1) {
            parseRule(line, rules);
        } else {
            sumMiddle += validateOrder( parseOrdering(line), rules );
        }
    }
    
    console.log("Result: %d", sumMiddle);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

function parseRule(str, rules) {
    const [ a, b ] = str.split("|");

    if (!rules.has(a))
        rules.set(a, { before: new Set(), after: new Set() });
    const ruleA = rules.get(a);
    ruleA.after.add(b);
    rules.set(a, ruleA);

    if (!rules.has(b))
        rules.set(b, { before: new Set(), after: new Set() });
    const ruleB = rules.get(b);
    ruleB.before.add(a);
    rules.set(b, ruleB);
}

function parseOrdering(str) {
    return str.split(",");
}

function validateOrder(seq, rules) {
    const previous = new Set();
    for (const curr of seq) {
        for (const prev of previous) {
            if (rules.get(curr).after.has(prev))
                return 0;

            if (rules.get(prev).before.has(curr))
                return 0;
        }
        previous.add(curr);
    }

    return +seq[ Math.trunc(seq.length / 2) ];
}

main();