//
// Pomos: 1
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

    let count = 0;
    while ( !modulesDict[ 'rx' ].final ) {
        count++;
        modulesDict[ 'broadcaster' ].receive('aptly', false);
        proccessQueue.push( 'broadcaster' )
        while ( proccessQueue.length > 0 ) {
            const m = proccessQueue.shift();
            modulesDict[m].proccess();
        }

        if ( count % 1000000 == 0 )
            console.log(count);
    }

    console.log("Result: %d", count);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

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
