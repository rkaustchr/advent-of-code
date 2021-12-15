const fs = require("fs");
const heapLib = require('./heap.js');

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

const grid = [];

function fillRight(grid, offset = 0) {
	for(let i=0; i < input.length; i++) {
		let  line = input[i];
		if (!line) continue;

		if (!Array.isArray(grid[i])) grid[i] = [];

		grid[i] = grid[i].concat( line.split('').map(c => parseInt(c) + offset > 9 ? (parseInt(c) + offset) % 9 : parseInt(c) + offset) );
	}
}

function fillDown(grid) {
	let originalSize = input.length - 1;
	let gridSize = grid.length;
	for(let i=gridSize - originalSize; i < gridSize; i++) {
		let line = grid[i]
		grid.push( line.map(c => parseInt(c) % 9 + 1 ) );
	}
}

for (let i=0; i < 5; i++) fillRight(grid, i);
for (let i=1; i < 5; i++) fillDown(grid, i);

const numRows = grid.length;
const numCols = grid[0].length;

function getNeighbors( node ) {
	let [ r, c ] = node;
	let adj = [];
	if ( r + 1 < numRows) adj.push( [r+1, c] );
	if ( c + 1 < numCols) adj.push( [r, c+1] );
	if ( r > 0 ) adj.push( [r-1, c] );
	if ( c > 0 ) adj.push( [r, c-1] );
	return adj;
}

function getIndex( node ) {
	return node[0] * numRows + node[1];
}

const start = [0, 0]; //getIndex( [0, 0] );
const end = [numRows-1, numCols-1]; //getIndex( [numRows-1, numCols-1] );

function dijkstra( graph, startNode, endNode ) {
	const visited = {}
	const distance = {};
	let heap = new heapLib.Heap( heapLib.HEAP_TYPE.MIN );

	distance[ getIndex(startNode) ] = 0;
	heap.push( 0, startNode );
	while ( heap.size() ) {
		let [ _, node ] = heap.pop();
		let nodeIndex = getIndex(node);

		if ( visited[ nodeIndex ] ) continue;

		visited[ nodeIndex ] = true;
		let dist = distance[ nodeIndex ];

		if ( nodeIndex == getIndex(endNode) )
			return distance[ nodeIndex ];

		for (let adj of getNeighbors( node )) {
			let adjIndex = getIndex(adj);
			if ( visited[ adjIndex ] ) continue;

			if ( !distance[ adjIndex ] || distance[ adjIndex ] > dist + graph[ adj[0] ][ adj[1] ]) {
				distance[ adjIndex ] = dist + graph[ adj[0] ][ adj[1] ];
				heap.push( distance[ adjIndex ], adj );
			}
		}
	}

}

let distance = dijkstra(grid, start, end);

console.log(`Distance: ${distance}`);
