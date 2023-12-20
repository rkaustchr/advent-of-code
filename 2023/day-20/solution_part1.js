//
// Pomos: 6
//
const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const modulesDict = {};
    const counter = { true: 0, false: 0 };
    const proccessQueue = [];
    for await (const line of linesStream) {
        const [ moduleName, connections ] = parseInput( line );

        if ( moduleName == 'broadcaster' ) {
            modulesDict[ moduleName ] = new Broadcaster(moduleName, modulesDict, proccessQueue, counter);
            modulesDict[ moduleName ].addOutputs( connections );
            continue;
        }

        if ( moduleName[0] == '%' ) {
            const name = moduleName.substring(1);
            modulesDict[ name ] = new FlipFlop(name, modulesDict, proccessQueue, counter);
            modulesDict[ name ].addOutputs( connections );
            continue;
        }

        if ( moduleName[0] == '&' ) {
            const name = moduleName.substring(1);
            modulesDict[ name ] = new Conjunction(name, modulesDict, proccessQueue, counter);
            modulesDict[ name ].addOutputs( connections );
            continue;
        }
    }

    for(const m in modulesDict) {
        modulesDict[ m ].connectInputs(); 
    }

    let count = 1000;
    counter[ false ] = count;
    while ( count ) {
        modulesDict[ 'broadcaster' ].receive('aptly', false);
        proccessQueue.push( 'broadcaster' )
        while ( proccessQueue.length > 0 ) {
            const m = proccessQueue.shift();
            modulesDict[m].proccess();
        }
        count--;
    }

    let total = counter[ true ] * counter[ false ];

    console.log("Result: %d", total);

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
    constructor(name, modulesDict, proccessQueue, counter) {
        this.name = name;
        this.modulesDict = modulesDict;
        this.counter = counter;
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
            this.counter[ this.state ]++;
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
            this.counter[ outputVal ]++;
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
            this.counter[ signal ]++;
        }
    }
}
