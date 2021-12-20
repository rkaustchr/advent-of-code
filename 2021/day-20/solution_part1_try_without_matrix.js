const fs = require("fs");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

let filterMap = {};

let index = 0;
for(let el of input[0].split('')) {
    filterMap[index++] = el;
}
//console.log(filterMap);

function getIndex(x, y) {
    return `${x},${y}`;
}

function getXY( index ) {
    return index.split(",").map(i => parseInt(i));
}

function getCode( dict, _x, _y, background, minX, maxX, minY, maxY ) {
    let code = "";
    for(let x = _x-1; x <= _x+1; x++) {
        for(let y = _y-1; y <= _y+1; y++) {
            code += dict[ getIndex(x, y) ] ? '#' : ( (x < minX || x > maxX || y < minY || y > maxY) ? background : '.' );
        }
    }
    return code;
    
    // let code = "";
    // for(let x = _x; x <= _x+2; x++) {
    //     for(let y = _y; y <= _y+2; y++) {
    //         code += dict[ getIndex(x, y) ] ? '#' : (  '.');
    //     }
    // }
    // return code;
}

function getFilter( code ) {
    // console.log(" >> >> ", code.replace(/#/g, '1').replace(/\./g, '0'))
    // console.log(" >> >> ", parseInt(code.replace(/#/g, '1').replace(/\./g, '0'), 2))

    let index = parseInt(code.replace(/#/g, '1').replace(/\./g, '0'), 2);
    return filterMap[ index ];
}

function fillImagePixels( minX, maxX, minY, maxY ) {
    let map = {};
    for(let i= minX; i<=maxX; i++)
        for(let j= minY; j<=maxY; j++)
            map[ getIndex(i, j) ] = true;
    return map;
}

function debug( dict, bg, minX, maxX, minY, maxY ) {
    console.log("");
    console.log(" > ", minX, maxX, minY, maxY);
    for (let x = minX - 2; x <= maxX + 2; x++) {
        let line = "";
        for (let y = minY - 2; y <= maxY + 2; y++) {
            line += dict[ getIndex(x, y) ] ? '#' : ( ( x < minX || x > maxX || y < minY || y > maxY) ? bg : '.' );
        }
        console.log(line);
    }
}

/**
 * We goona keep tracking only of the lit ones, 
 *  and assume that the others are background
 * So we can save space and process only the lit ones
 */

let litPixels = {};
// let minX, maxX, minY, maxY;
let minX = 10, maxX = 10, minY = 10, maxY = 10;
let background = '.';
for (let i=2; i < input.length; i++) {
    let line = input[i];
    if (!line) continue;
    for (let j = 0; j < line.length; j++) {
        if ( line[j] == '#' )
            litPixels[ getIndex(i, j) ] = true;
        
        if ( i < minX ) minX = i;
        if ( i > maxX ) maxX = i;
        if ( j < minY ) minY = j;
        if ( j > maxY ) maxY = j;
    }
}
// [ minX, minY ] = getXY( Object.keys(litPixels)[0] );
// [ maxX, maxY ] = getXY( Object.keys(litPixels).pop() );

console.log(minX, minY, maxX, maxY);

//console.log(litPixels)

// main
debug( litPixels, background, minX, maxX, minY, maxY );
console.log(" > ", Object.keys(litPixels).length )
for(let i=0; i < 2; i++) {
    let imagePixels = fillImagePixels(minX, maxY, minY, maxY); // used to control innerPixels that are all off and can turn on
    let newLitPixels = {};
    let newMinX = Number.MAX_SAFE_INTEGER;
    let newMaxX = Number.MIN_SAFE_INTEGER;
    let newMinY = Number.MAX_SAFE_INTEGER;
    let newMaxY = Number.MIN_SAFE_INTEGER;
    for(let key in litPixels) {
        let [x, y] = getXY(key);

        // console.log("");
        // console.log(key, x, y);
        
        // compute the 9 possible positions this point can be
        for (let _x = x-1; _x <= x+1; _x++) {
            for (let _y = y-1; _y <= y+1; _y++) {
                
                //console.log(" > > ", _x, _y);
                
                let code = getCode(litPixels, _x, _y, background, minX, maxX, minY, maxY);
                
                //console.log(" > > code ", code);
                
                let newPixel = getFilter(code);
                
                //console.log(" > > filter ", newPixel);
                if ( newPixel == '#') {
                    newLitPixels[ getIndex(_x, _y) ] = true;
                    
                    if (_x < newMinX) newMinX = _x;
                    if (_x > newMaxX) newMaxX = _x;
                    if (_y < newMinY) newMinY = _y;
                    if (_y > newMaxY) newMaxY = _y;
                }

                if(imagePixels[ getIndex(_x, _y) ])
                    delete imagePixels[ getIndex(_x,_y) ];
            }
        }
    }

    minX = newMinX;
    maxX = newMaxX;
    minY = newMinY;
    maxY = newMaxY;

    console.log("imagePixels");
    console.log(imagePixels);
    
    // imagePixels stores all '.' pixels that have only '.' neighbors
    for(let index of Object.keys(imagePixels)) {
        let newPixel = getFilter('.'.repeat(9));
        if ( newPixel == '#')
            newLitPixels[ index ] = true;
    }
    
    litPixels = newLitPixels;
    background = getFilter( background.repeat(9) );

    console.log("background", background);

    debug( litPixels, background, minX, maxX, minY, maxY );
    console.log(i, Object.keys(litPixels).length )
}


console.log(`# Lit: ${ Object.keys(litPixels).length }`);
