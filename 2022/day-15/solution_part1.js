const fs = require('fs');
const readline = require('readline');

function manhatanDistance(oX, oY, dX, dY) {
    return Math.abs( oX - dX ) + Math.abs( oY - dY );
}

async function main() {
    const linesStream = await getFileStreamLines('./input.txt');

    const targetIdx = 2000000 //10;
    const beaconAtTarget = [];
    let notUsedPositions = new Set();

    for await (const line of linesStream) {
        const input = line.split(': ');
        let [sensorX, sensorY] = input[0].split(', ').map(i => parseInt( i.replace(/[^-\d]/g, '') ));
        let [beaconX, beaconY] = input[1].split(', ').map(i => parseInt( i.replace(/[^-\d]/g, '') ));
        const dist = manhatanDistance(sensorX, sensorY, beaconX, beaconY);

        const distToTarget = Math.abs(sensorY - targetIdx)
        if ( distToTarget > dist )
            continue;

        if (sensorY == targetIdx)
            notUsedPositions.add(sensorX);

        if (beaconY == targetIdx)
            beaconAtTarget.push(beaconX);
        
        const rangeAtDist = dist - distToTarget;
        for( let i=sensorX-rangeAtDist; i <= sensorX+rangeAtDist; i++ ) {
            notUsedPositions.add(i);
        }
    }
    
    beaconAtTarget.forEach(b => notUsedPositions.delete(b));

    console.log("Not used positions: %d", notUsedPositions.size);
    
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