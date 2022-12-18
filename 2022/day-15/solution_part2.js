const fs = require('fs');
const readline = require('readline');

function manhatanDistance(oX, oY, dX, dY) {
    return Math.abs( oX - dX ) + Math.abs( oY - dY );
}

async function main() {
    let linesStream = await getFileStreamLines('./input.txt');

    const sensors = [];
    for await (const line of linesStream) {
        const input = line.split(': ');
        let [sensorX, sensorY] = input[0].split(', ').map(i => parseInt( i.replace(/[^-\d]/g, '') ));
        let [beaconX, beaconY] = input[1].split(', ').map(i => parseInt( i.replace(/[^-\d]/g, '') ));
        const dist = manhatanDistance(sensorX, sensorY, beaconX, beaconY);
        sensors.push([ [sensorX, sensorY], dist ]);
    }

    const borderLimit = 4000000; // 20
    
    for(let y=0; y <= borderLimit; y++) {
        const intervals = [];
        for (const [[sx, sy], d] of sensors) {
            let range = d - Math.abs(sy - y);

            if (range < 0) continue;

            const lRange = sx - range;
            const hRange = sx + range;

            intervals.push([lRange, hRange]);
        }
        
        intervals.sort((a, b) => a[0] - b[0])

        const finalInterval = [];
        for(const [lR, hR] of intervals) {
            if(!finalInterval.length) {
                finalInterval.push([lR, hR]);
                continue;
            }

            const [l, h] = finalInterval[ finalInterval.length -1 ];

            if ( lR > l + 1 ) {
                finalInterval.push([lR, hR]);
                continue;
            }

            finalInterval[ finalInterval.length -1 ][1] = Math.max(h, hR);
        }


        let c = 0;
        for(const [lR, hR] of finalInterval) {
            if ( c < lR ) {
                console.log("Found solution: (%d, %d)", c, y);
                console.log("Tuning Frequency: %d", c * borderLimit + y);
            }
            c = Math.max(c, hR + 1);
        }
    }
    
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