const fs = require('fs');
const readline = require('readline');

async function main() {
    const linesStream = await getFileStreamLines('./input.txt');

    let state = 0;

    // build piles
    let stacks = [];
    for await (const line of linesStream) {
        if ( state == 0 ) {
            if (line.length == 0) {
                // fix stacks
                for(let i=0; i < stacks.length; i++) {
                    stacks[i].pop(); // to remove number in the base
                    stacks[i].reverse();
                }

                console.log(stacks);
                state = 1;
                continue;
            }

            // init stacks
            if ( stacks.length == 0 ) {
                for(let i=0; i < line.length / 4; i++)
                    stacks.push([]);
            }

            // map containers
            let k=0;
            for(let i=1; i < line.length; i+=4) {
                if (line[i] != " ")
                    stacks[k].push( line[i] );
                k++;
            }
        } else {
            // commands >> move 5 from 4 to 7
            const commands = line.split(' ');
            const amount = +commands[1];
            const from = (+commands[3]) - 1;
            const to = (+commands[5]) - 1;

            const tmp = [];
            for(let i=0; i < amount; i++)
                tmp.push( stacks[ from ].pop() )
            
            stacks[ to ] = stacks[ to ].concat( tmp.reverse() );
        }
    }

    console.log("\n\n")
    console.log(stacks)

    let result = "";
    for(const stack of stacks)
        result += '' + stack.pop();

    console.log("Final tops: %s", result);

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