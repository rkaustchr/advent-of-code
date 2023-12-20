//
// Pomos: 2.5
//
const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const modulesDict = {};
    const proccessQueue = [];
    modulesDict[ 'rx' ] = new RX('rx', modulesDict, proccessQueue);
    for await (const line of linesStream) {
        const [ moduleName, connections ] = parseInput( line );

        if ( moduleName == 'broadcaster' ) {
            modulesDict[ moduleName ] = new Broadcaster(moduleName, modulesDict, proccessQueue);
            modulesDict[ moduleName ].addOutputs( connections );
            continue;
        }

        if ( moduleName[0] == '%' ) {
            const name = moduleName.substring(1);
            modulesDict[ name ] = new FlipFlop(name, modulesDict, proccessQueue);
            modulesDict[ name ].addOutputs( connections );
            continue;
        }

        if ( moduleName[0] == '&' ) {
            const name = moduleName.substring(1);
            modulesDict[ name ] = new Conjunction(name, modulesDict, proccessQueue);
            modulesDict[ name ].addOutputs( connections );
            continue;
        }
    }

    for(const m in modulesDict) {
        modulesDict[ m ].connectInputs(); 
    }

    // After build the connection graph [buildGraph(modulesDict)], we can see that the result depends on the value of 4 modules: bt, dl, fr and rv
    // those 4 modules need to output high to rx receive low
    // 
    // &rx ->
    //     &rs -> 
    //         &bt -> &mj
    //         &dl -> &qs
    //         &fr -> &rd
    //         &rv -> &cs
    // we can calculate how long it takes to those modules output high and calculate the lcm of those counters to get our result
    let counters = {
        bt: Infinity,
        dl: Infinity,
        fr: Infinity,
        rv: Infinity,
    }
    let count = 0;
    while ( !(counters['bt'] + counters['dl'] + counters['fr'] + counters['rv'] < Infinity) ) {
        count++;
        modulesDict[ 'broadcaster' ].receive('aptly', false);
        proccessQueue.push( 'broadcaster' )
        while ( proccessQueue.length > 0 ) {
            const m = proccessQueue.shift();
            modulesDict[m].proccess();
        }

        if (modulesDict['bt'].lastSent)
            counters['bt'] = Math.min(counters['bt'], count); 

        if (modulesDict['dl'].lastSent)
            counters['dl'] = Math.min(counters['dl'], count); 

        if (modulesDict['fr'].lastSent)
            counters['fr'] = Math.min(counters['fr'], count); 

        if (modulesDict['rv'].lastSent)
            counters['rv'] = Math.min(counters['rv'], count); 
    }

    const values = [ counters['bt'], counters['dl'], counters['fr'], counters['rv'] ];
    const result = lcmArray(values);

    console.log("Result: %d", result);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function buildGraph(modulesDict) {
    const graph = {};
    for (const key in modulesDict)
        graph[ key ] = { 
            type: modulesDict[key].constructor.name,
            in: new Set(),
            out: new Set()
        };
    
    for (const key in modulesDict) {
        for (const m of modulesDict[key].outputs ) {
            graph[ m ].in.add( key )
            graph[ key ].out.add( m )
        }
    }

    console.log(graph);
}

// Euclidean algorithm > Greatest Common Divisor
// A more efficient variant in which the difference of the two numbers a and b is replaced 
//  by the remainder of the Euclidean division (also called division with remainder) of a by b.
// Denoting this remainder as a mod b, the algorithm replaces (a, b) by (b, a mod b), with a > b
function gcd(a, b) {
    if ( b > a )
        return gcd(b, a);

    while ( b != 0 ) {
        const temp = b;
        b = a % b;
        a = temp;
    }

    return a;
}

// Least Common Multiple
function lcm(a, b) {
    return a * ( b / gcd(a, b) )
}

function lcmArray( arr ) {
    let _lcm = arr.pop();
    while ( arr.length ) {
        _lcm = lcm(_lcm, arr.pop());
    } 
    return _lcm;
}


function parseInput( str ) {
    const [ moduleName, connectionsStr ] = str.split(' -> ');
    const connections = connectionsStr.split(', ');
    return [ moduleName, connections ];
}

class IModules {
    constructor(name, modulesDict, proccessQueue) {
        this.name = name;
        this.modulesDict = modulesDict;
        this.proccessQueue = proccessQueue;
        this.inputs = [];
        this.outputs = [];
        this.queue = [];

        this.lastSent = null;
    }

    addOutputs(outputList) {
        this.outputs = outputList;
    }

    addInput() {

    }

    connectInputs() {
        for(const m of this.outputs) {
            if ( this.modulesDict[ m ] == undefined )
                this.modulesDict[ m ] = new IModules(m, {}, [], {});
            this.modulesDict[ m ].addInput( this.name );
        }
    }

    receive(origin, signal) {
        this.queue.push([ origin, signal ]);
    }

    proccess() {

    }
}

class RX extends IModules {
    constructor(...args) {
        super(...args);
        this.final = false;
    }

    receive(_origin, signal) {
        if ( !signal )
            this.final = true;
    }
}

class FlipFlop extends IModules {
    constructor(...args) {
        super(...args);
        this.state = false;
    }

    proccess() {
        const [ _origin, signal ] = this.queue.shift();
        if ( signal )
            return;
        this.state = !this.state;
        for (const m of this.outputs) {
            this.modulesDict[ m ].receive( this.name, this.state );
            this.proccessQueue.push( m );
        }
    }
}

class Conjunction extends IModules {
    constructor(...args) {
        super(...args);
        this.inputs = {};
        this.memory = 0;
        this.mask = 0;
        this.nextPos = 1;
    }

    addInput(input) {
        this.inputs[ input ] = this.nextPos;
        this.nextPos <<= 1;
        this.mask = (this.mask << 1) | 1; 
    }

    proccess() {
        const [ origin, signal ] = this.queue.shift();
        const pos = this.inputs[ origin ];
        const bitVal = (this.memory & pos) > 0;
        // if they are different, then flip the bit
        if ( bitVal ^ signal ) {
            this.memory ^= pos; 
        }

        let outputVal = true;
        if ( (this.memory & this.mask) == this.mask )
            outputVal = false;

        if ( outputVal )
            this.lastSent = true;
        for (const m of this.outputs) {
            this.modulesDict[ m ].receive( this.name, outputVal );
            this.proccessQueue.push( m );
        }
    }
}

class Broadcaster extends IModules {
    constructor(...args) {
        super(...args);
    }

    proccess() {
        const [ _origin, signal ] = this.queue.shift();
        for (const m of this.outputs) {
            this.modulesDict[ m ].receive( this.name, signal );
            this.proccessQueue.push( m );
        }
    }
}


// rx -> high
//     rs -> high
//         bt -> mj
//         dl -> qs
//         fr -> rd
//         rv -> cs

/*
Last sents
rx: null
rs: true
bt: false
  mj: true
dl: false
  qs: true
fr: false
  rd: true
rv: false
  cs: true
*/