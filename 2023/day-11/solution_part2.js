const util = require('../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const galaxies = [];
    let rows = 0;
    let cols;
    for await (const line of linesStream) {
        for(cols=0; cols < line.length; cols++)
            if ( line[cols] == '#' )
                galaxies.push( { r: rows, c: cols } );

        rows++;
    }

    // find empty rows & cols;
    const isRowEmpty = new Array( rows ).fill(true);
    const isColEmpty = new Array( cols ).fill(true);
    for (const { r, c } of galaxies) {
        isRowEmpty[ r ] = false;
        isColEmpty[ c ] = false;
    }

    // create a acumulated frequence map for each row/col
    const emptyRowsCount = new Array( rows ).fill( 0 );
    for (let r=0; r < rows - 1; r++)
        emptyRowsCount[ r + 1 ] = emptyRowsCount[ r ] + (isRowEmpty[ r ] ? 1 : 0);

    const emptyColsCount = new Array( cols ).fill( 0 );
    for (let c=0; c < cols - 1; c++)
        emptyColsCount[ c + 1 ] = emptyColsCount[ c ] + (isColEmpty[ c ] ? 1 : 0);

    // Calculate distances
    const expansionRate = 1000000;
    let totalDistance = 0;
    for(let i=0; i < galaxies.length - 1; i++) {
        for(let j=i+1; j < galaxies.length; j++) {
            const d = distance(galaxies[i], galaxies[j]);
            const rowSpaces = emptyRowsCount[ Math.max(galaxies[i].r, galaxies[j].r) ] - emptyRowsCount[ Math.min(galaxies[i].r, galaxies[j].r) ];
            const colSpaces = emptyColsCount[ Math.max(galaxies[i].c, galaxies[j].c) ] - emptyColsCount[ Math.min(galaxies[i].c, galaxies[j].c) ];
            totalDistance +=  d + (rowSpaces * (expansionRate - 1)) + (colSpaces * (expansionRate - 1));
        }
    }
    
    console.log("Result: %d", totalDistance);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

// Manhatan distance
function distance(px, py) {
    return Math.abs( px.r - py.r ) + Math.abs( px.c - py.c );
}