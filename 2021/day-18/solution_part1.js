const fs = require("fs");
const { SnailfishTree } = require("./snailfishTree");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

let tree = new SnailfishTree( JSON.parse( input[0] ));
for (let i=1; i < input.length; i++) {
    let line = input[i];
    if (!line) continue;

    let newTree = new SnailfishTree( JSON.parse( line ) );
    tree.add( newTree );

    //console.log(tree.print());
}

console.log(`Magnitude: ${ tree.magnitude() }`);
