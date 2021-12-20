const fs = require("fs");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

let filterMap = {};

let index = 0;
for(let el of input[0].split('')) {
    filterMap[index++] = el;
}

function getCode( img, _x, _y, background ) {
    let code = "";
    for(let x = _x-1; x <= _x+1; x++) {
        for(let y = _y-1; y <= _y+1; y++) {
            code +=  x < 0 || x >= img.length || y < 0 || y >= img[0].length ? background : img[x][y];
        }
    }
    return code;
}

function getFilter( code ) {
    let index = parseInt(code.replace(/#/g, '1').replace(/\./g, '0'), 2);
    return filterMap[ index ];
}

function countLit( img ) {
    let count = 0;
    for(let i=0; i < img.length; i++) 
        for(let j=0; j < img[0].length; j++)
            count += img[i][j] == '#' ? 1 : 0; 
    return count;
}

let img = [];
let background = '.';
index = 0;
for (let i=2; i < input.length; i++) {
    let line = input[i];
    if (!line) continue;

    img[ index ] = [];
    for (let j = 0; j < line.length; j++) {
        img[ index ][j] = line[j];
    }
    index++;
}

// main
for(let i=0; i < 50; i++) {
    let newImg = [];
    let indexX = 0;
    for(let x=-1; x <= img.length; x++) {
        newImg[indexX] = [];
        let indexY = 0;
        for(let y=-1; y <= img[0].length; y++){
            let code = getCode(img, x, y, background);
            
            newImg[indexX][indexY] = getFilter(code);
            indexY++;
        }
        indexX++;
    }

    img = newImg;
    background = getFilter( background.repeat(9) );
}


console.log(`# Lit: ${ countLit(img) }`);
