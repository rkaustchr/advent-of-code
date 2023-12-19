//
// Pomos: 2.5
//
const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const workflows = {};
    for await (const line of linesStream) {
        if ( line == '' )
            break;
        
        const parsed = parseWorkflow(line);
        workflows[ parsed.name ] = parsed;
    }

    const startPieces = {
        x: [1, 4000],
        m: [1, 4000],
        a: [1, 4000],
        s: [1, 4000]
    };
    const output = [];
    explore(startPieces, 'in', workflows, output);

    let total = 0;
    for(const state of output) {
        total += (state.x[1] - state.x[0] + 1) 
                    * (state.m[1] - state.m[0] + 1) 
                    * (state.a[1] - state.a[0] + 1) 
                    * (state.s[1] - state.s[0] + 1);
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

function explore(pieces, wf, workflows, output) {
    if (!isValidState(pieces))
        return;
    
    // if is reject stop
    if ( wf == 'R' )
        return;
    
    // if is accepted add to the output and stop
    if ( wf == 'A' ) {
        output.push( copy(pieces) );
        return;
    }

    let currentPieces = copy(pieces);
    for(const rule of workflows[ wf ].rules) {
        // { next: { pieces: applied, wf: rule.next }, remaining: notApplied }
        const state = apply(rule, currentPieces);
        // rule applied
        explore(state.next.pieces, state.next.wf, workflows, output );
        // rule not applied
        currentPieces = state.remaining;
    }
    // fallback
    explore(currentPieces, workflows[ wf ].fallback, workflows, output );
}

function apply(rule, piece) {
    // { piece: 's', op: '>', value: '2770', next: 'qs' }
    const applied = copy(piece);
    const notApplied = copy(piece);
    if ( rule.op == '>' ) {
        applied[ rule.piece ][0] = Math.max(rule.value + 1, piece[ rule.piece ][0]);
        notApplied[ rule.piece ][1] = Math.min(rule.value, piece[ rule.piece ][1]);
        return { next: { pieces: applied, wf: rule.next }, remaining: notApplied };
    } 
    
    applied[ rule.piece ][1] = Math.min(rule.value - 1, piece[ rule.piece ][1]);
    notApplied[ rule.piece ][0] = Math.max(rule.value, piece[ rule.piece ][0]);
    return { next: { pieces: applied, wf: rule.next }, remaining: notApplied };
}

function isValidState(pieces) {
    for (const part of ['x','m','a','s']) {
        if ( pieces[ part ][0] > pieces[ part ][1] )
            return false;
    }

    return true;
}

function copy( obj ) {
    return JSON.parse(JSON.stringify( obj ));
}