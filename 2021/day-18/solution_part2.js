const fs = require("fs");
const { SnailfishTree } = require("./snailfishTree");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

let maxMagnitude = 0;
for (let i =0; i < input.length -1; i++) {
    for (let j=i+1; j < input.length; j++) {
        let line = input[j];
        if (!line) continue;
        
        let tree = new SnailfishTree( JSON.parse( input[i] ));
        let newTree = new SnailfishTree( JSON.parse( line ) );
        tree.add( newTree );

        let magnitude = tree.magnitude();

        if ( magnitude > maxMagnitude) maxMagnitude = magnitude;

        tree = new SnailfishTree( JSON.parse( line ) );
        newTree = new SnailfishTree( JSON.parse( input[i]) );
        tree.add( newTree );

        magnitude = tree.magnitude();

        if ( magnitude > maxMagnitude) maxMagnitude = magnitude;
    }
}

console.log(`max Magnitude: ${ maxMagnitude }`);



// let root = new SnailfishTree( [[[[4,3],4],4],[7,[[8,4],9]]] );
// let newNode = new SnailfishTree( [1,1] );
// root.add( newNode );

// console.log(root.print());

// console.log(root.root.left);
// console.log(root.root.right);

// console.log("");
// console.log("");

// console.log( root.needToExplode() );
// console.log( root.needToSplit() );

// console.log("");
// console.log("");

// console.log( root.getLeftNeighbor(root.root.left) );
// console.log( root.getRightNeighbor(root.root.right) );
//console.log( `${root.root.right.left.value} -> ${root.getLeftNeighbor(root.root.right).value}` );
//console.log( `${root.root.left.right.right.value} -> ${root.getRightNeighbor(root.root.left.right).value}` );

// console.log( `${root.root.right.right.value} -> ${root.getLeftNeighbor(root.root.right).value}` );
// console.log( `${root.root.left.right.right.value} -> ${root.getLeftNeighbor(root.root.left.right).value}` );
// console.log( `${root.root.left.left.value} -> ${root.getLeftNeighbor(root.root.left) ? root.getLeftNeighbor(root.root.left).value : root.getLeftNeighbor(root.root.left)}` );

// console.log( `${root.root.right.right.value} -> ${root.getRightNeighbor(root.root.right) ? root.getRightNeighbor(root.root.right).value : root.getRightNeighbor(root.root.right)}` );
// console.log( `${root.root.left.right.right.value} -> ${root.getRightNeighbor(root.root.left.right) ? root.getRightNeighbor(root.root.left.right).value : root.getRightNeighbor(root.root.left.right)}` );
// console.log( `${root.root.left.left.value} -> ${root.getRightNeighbor(root.root.left) ? root.getRightNeighbor(root.root.left).value : root.getRightNeighbor(root.root.left)}` );

//let root = new SnailfishTree( [[[[[9,8],1],2],3],4] );
//let root = new SnailfishTree( [7,[6,[5,[4,[3,2]]]]] );
//let root = new SnailfishTree( [[6,[5,[4,[3,2]]]],1] );
//let root = new SnailfishTree( [[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]] );
// let root = new SnailfishTree( [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]] );
// console.log(root.print());
// let nodeToExplode = root.needToExplode();
// if (nodeToExplode) {
//     //console.log(nodeToExplode);
//     console.log(nodeToExplode.print());

//     root.explode(nodeToExplode);

//     console.log(root.print());
// }

// let root = new SnailfishTree( [[[[0,7],4],[15,[0,13]]],[1,1]] );
// console.log(root.print());
// let nodeToExplode = root.needToSplit();
// if (nodeToExplode) {
//     //console.log(nodeToExplode);
//     console.log(nodeToExplode.print());

//     root.split(nodeToExplode);

//     console.log(root.print());
// }

console.log("");
console.log("");


