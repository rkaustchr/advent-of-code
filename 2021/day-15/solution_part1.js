const fs = require("fs");
const heapLib = require('./heap.js');

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

const grid = [];

for(let line of input) {
	if (!line) continue;

	grid.push( line.split('').map(c => parseInt(c)) );
}

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
