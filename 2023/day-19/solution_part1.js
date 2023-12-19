//
// Pomos: 1.5
//
const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    let total = 0;
    const workflows = {};
    let isReadingParts = false;
    for await (const line of linesStream) {
        if (!isReadingParts) {
            if ( line == '' ) {
                isReadingParts = true;
                continue;
            }
            const parsed = parseWorkflow(line);
            workflows[ parsed.name ] = parsed;
            continue;
        }

        const piece = parsePiece(line);
        if ( doWorkflow(piece, workflows) ) {
            total += piece['x'] + piece['m'] + piece['a'] + piece['s'];
        }
    }
    
    console.log("Result: %d", total);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function parseWorkflow(str) {
    let [ _full, name, rulesStr ] = str.match(/(\w+)\{(.+)\}/);
    rulesStr = rulesStr.split(',');
    const rules = [];
    while ( rulesStr.length > 1 ) {
        const rule = rulesStr.shift();
        const [ _full, piece, op, value, next ] = rule.match(/(x|m|a|s)(<|>)(\d+):(\w+)/);
        rules.push({
            piece,
            op,
            value: +value,
            next
        })
    }

    return {
        name,
        rules,
        fallback: rulesStr[0],
    }
}

function parsePiece(str) {
    // {x=787,m=2655,a=1222,s=2876}
    const piece = {};
    str = str.split('');
    str.shift();
    str.pop();
    str = str.join('');
    for (const part of str.split(',')) {
        const [ name, value ] = part.split('=');
        piece[ name ] = +value;
    }

    return piece;
}

function doWorkflow(piece, workflows) {
    let wf = 'in';
    while ( wf != 'A' && wf != 'R' ) {
        let applied = false;
        for(const rule of workflows[ wf ].rules) {
            const result = apply(rule, piece);
            if ( result != null ) {
                wf = result;
                applied = true;
                break;
            }
        }

        if (!applied)
            wf = workflows[ wf ].fallback;
    }

    return wf == 'A';
}

function apply(rule, piece) {
    // { piece: 's', op: '>', value: '2770', next: 'qs' }
    if ( rule.op == '>' && piece[ rule.piece ] > rule.value )
        return rule.next;
    if ( rule.op == '<' && piece[ rule.piece ] < rule.value )
        return rule.next;
    return null;
}