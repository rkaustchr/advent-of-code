const fs = require('fs');
const readline = require('readline');

async function main() {
    const linesStream = await getFileStreamLines('./input.txt');

    let cycles = 0;
    let register = 1;
    let crt = "";

    let cmd, val;
    for await (const line of linesStream) {
        [ cmd, val ] = line.split(' ');

        if (cmd == "addx") {
            val = +val;
            
            crt += Math.abs(register - cycles) < 2 ? "#" : ".";
            if ( cycles % 40 == 0 ) {
                crt += "\n";
                cycles = 0;
            }
            cycles++;
        } else {
            val = 0;
        }

        crt += Math.abs(register - cycles) < 2 ? "#" : ".";
        if ( cycles % 40 == 0 ) {
            crt += "\n";
            cycles = 0;
        }
        cycles++;

        register += val;
    }
    
    console.log("Screen:");
    console.log(crt);
    
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