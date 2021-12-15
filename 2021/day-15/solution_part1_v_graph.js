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

const graph = {};
const numRows = grid.length;
const numCols = grid[0].length;

function getIndex(r, c) {
	return r * numRows + c;
}

let index = 0;
for(let r=0; r < numRows; r++) {
	for (let c=0; c < numCols; c++) {
		graph[ index ] = {
			value: grid[r][c],
			adj: [],
		};

		if ( r + 1 < numRows) graph[ index ].adj.push( getIndex(r+1, c) );
		if ( c + 1 < numCols) graph[ index ].adj.push( getIndex(r, c+1) );
		if ( r > 0 ) graph[ index ].adj.push( getIndex(r-1, c) );
		if ( c > 0 ) graph[ index ].adj.push( getIndex(r, c-1) );

		index++;
	}
}

const start = getIndex( 0, 0 );
const end = getIndex( numRows-1, numCols-1 );


function dijkstra( graph, startNode, endNode ) {
	const visited = {}
	const distance = {};
	let heap = new heapLib.Heap( heapLib.HEAP_TYPE.MIN );

	distance[ startNode ] = 0;
	heap.push( 0, startNode );
	while ( heap.size() ) {
		let [ _, node ] = heap.pop();

		if ( visited[ node ] ) continue;

		visited[ node ] = true;
		let dist = distance[ node ];

		if ( node == endNode )
			return distance[ node ];

		for (let adj of graph[ node ].adj) {
			if ( visited[ adj ] ) continue;

			if ( !distance[ adj ] || distance[ adj ] > dist + graph[ adj ].value) {
				distance[ adj ] = dist + graph[ adj ].value;
				heap.push( distance[ adj ], adj );
			}
		}
	}

}

//console.log(grid);
//process.exit(0);

let distance = dijkstra(graph, start, end);

console.log(`Distance: ${distance}`);
