const fs = require('fs');
const readline = require('readline');

function parseCommand(line) {
    const [ _dolar, cmd, param ] = line.split(' ');
    return {
        type: 'cmd',
        cmd,
        param
    };
}

function parseItem(line) {
    const [ it1, it2 ] = line.split(' ');
    return {
        type: it1 == "dir" ? "dir" : "file",
        name: it2,
        size: it1 == "dir" ? 0 : parseInt(it1)
    };
}

function parseLine(line) {
    if (line[0] == "$")
        return parseCommand(line);
    return parseItem(line);
}

class Node {
    constructor(type, name, size = 0) {
        this.type = type;
        this.name = name;
        this.size = size;
        this.parent = null;
        this.children = {};
    }
}

function calculateSize( node ) {
    let totalSize = 0;
    for(const key in node.children) {
        if ( node.children[ key ].type == "file" )
            totalSize += node.children[ key ].size;
        else
            totalSize += calculateSize( node.children[ key ] );
    }
    node.size = totalSize;
    return totalSize;
}

function findSmallestFolderBiggerThan(node, lowerBound) {
    let smallest = Infinity;
    for(const key in node.children) {
        if ( node.children[ key ].type != "dir" )
            continue;

        if ( node.children[ key ].size > lowerBound && node.children[ key ].size < smallest )
            smallest = node.children[ key ].size;

        smallest = Math.min( smallest, findSmallestFolderBiggerThan(node.children[ key ], lowerBound) );
    }
    return smallest;
}

async function main() {
    const linesStream = await getFileStreamLines('./input.txt');

    const root = new Node("dir", "");
    root.children['/'] = new Node("dir", '/');
    root.children['/'].parent = root;

    let currentDir = root;

    // build tree structure
    for await (const line of linesStream) {
        const obj = parseLine(line);

        if (obj.type == "cmd") {
            if (obj.cmd == "cd") {
                if (obj.param == "..") {
                    currentDir = currentDir.parent;
                } else {
                    currentDir = currentDir.children[ obj.param ];
                }
            } else if (obj.cmd == "ls") {
                // nothing
            }
        } else {
            if ( currentDir.children[ obj.name ] )
                continue;

            currentDir.children[ obj.name ] = new Node(obj.type, obj.name, obj.size);
            currentDir.children[ obj.name ].parent = currentDir;
        }
    }

    // compute dir size
    calculateSize(root);

    const totalUsed = root.size;
    const totalToFree = 30000000 - (70000000 - totalUsed);

    const smallestFolderSize = findSmallestFolderBiggerThan(root, totalToFree);

    console.log("Total used: %d", totalUsed);
    console.log("Total needed to free: %d", totalToFree);
    console.log("Total found: %d", smallestFolderSize);
    
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

/* UTILS // */ 
async function getFileStream(path) {
    const fileStream = fs.createReadStream(path);
    return fileStream;
}

async function getFileStreamLines(path) {
    const fileStream = await getFileStream(path);

    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    return rl;
}
/* // UTILS */