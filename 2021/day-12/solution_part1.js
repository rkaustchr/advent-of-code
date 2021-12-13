const fs = require("fs");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

const graph = {};

for(let line of input) {
	if (!line) continue;
	let [n1, n2] = line.split('-');

	if ( !graph[ n1 ] ) graph[ n1 ] = { adj: [] };
	if ( !graph[ n2 ] ) graph[ n2 ] = { adj: [] };

	graph[ n1 ].adj.push( n2 );
	graph[ n2 ].adj.push( n1 );
}


function isBig( node ) {
	return node.toUpperCase() == node; 
}

// DFS
function dfs(node, visited = {}) {
	let count = 0;

	if (node == 'end') {
		return 1;
	}

	visited[ node ] = isBig(node) ? false : true;

	for (let neighbor of graph[ node ].adj) {
		if ( isBig( neighbor ) || !visited[ neighbor ] )
			count += dfs( neighbor, visited );
	}

	visited[ node ] = false;

	return count;
}


let result = dfs('start');

console.log(`Paths: ${result}`);
