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
const uniquePaths = {};
function dfs(node, visited = {}, usedTwice = false, path = []) {
	let count = 0;

	path.push(node);

	if (node == 'end') {
		if (uniquePaths[ path.join('_') ]) {
			path.pop();
			return 0;
		} 

		uniquePaths[ path.join('_') ] = true;
		path.pop();
		return 1;
	}

	visited[ node ] = isBig(node) ? false : true;

	for (let neighbor of graph[ node ].adj) {
		if ( isBig( neighbor ) || !visited[ neighbor ] ) {
			count += dfs( neighbor, visited, usedTwice, path );
			if ( !isBig(node) && !usedTwice && node != 'start') {
				visited[ node ] = false;
				count += dfs( neighbor, visited, true, path );
				visited[ node ] = true;
			}
		}
	}

	visited[ node ] = false;
	path.pop();

	return count;
}


let result = dfs('start');

console.log(`Paths: ${result}`);
