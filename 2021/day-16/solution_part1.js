const fs = require("fs");

//const file = fs.readFileSync("./input-test.txt").toString();
const file = fs.readFileSync("./input.txt").toString();

let input = file.split(/\r?\n/);

let inputPackage = input[0];

const mapHexToBinary = {
    '0' : '0000',
    '1' : '0001',
    '2' : '0010',
    '3' : '0011',
    '4' : '0100',
    '5' : '0101',
    '6' : '0110',
    '7' : '0111',
    '8' : '1000',
    '9' : '1001',
    'A' : '1010',
    'B' : '1011',
    'C' : '1100',
    'D' : '1101',
    'E' : '1110',
    'F' : '1111',
};

function convertHexToBinary( package ) {
    let result = "";
    for(let bit of package.split(''))
        result += mapHexToBinary[ bit ];
    return result;
}

function getPackageTypeNumber( package ) {
    // AAAAABBBBBCCCCC  -> T == 100
    let number = "";
    let offset = 0;
    while (1) {
        number += package.substring(offset+1, offset+5)
        if ( package[ offset ] == 0 ) break;
        offset += 5;
    }

    return {
        data: parseInt(number, 2),
        dataSize: offset + 5,
        bits: number,
    };
}

function getPackageTypeOperatorId0( package ) {
    // LLLLLLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBBBBBB
    let size = parseInt( package.substring(0, 15), 2 );

    let packages = [];
    let offset = 0;
    while (offset < size) {
        let _package = parsePackage( package.substring(15+offset) );
        offset += _package.size;
        packages.push( _package );
    }

    return packages;
}

function getPackageTypeOperatorId1( package ) {
    // LLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC
    let size = parseInt( package.substring(0, 11), 2 );

    let packages = [];
    let offset = 0;
    for(let i=size; i > 0; i--) {
        let _package = parsePackage( package.substring(11+offset) );
        offset += _package.size;
        packages.push( _package );
    }

    return packages;
}

function getPackageTypeOperator( package ) {
    // ILLLLLLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBBBBBB -> T != 100
    
    let data;
    let id = package[0]; 
    if ( id == '0' )
        data = getPackageTypeOperatorId0( package.substring(1) );
    else
        data = getPackageTypeOperatorId1( package.substring(1) );

    let dataSize = data.reduce((prev, curr) => prev + curr.size , 0);
    return {
        data: data,
        dataSize: dataSize + (id == '0' ? 15 : 11) + 1,
        bits: id + (id == '0' ? package.substring(1, 16) : package.substring(1, 12))
    };
}

function parsePackage( package ) {
    // VVVTTTAAAAABBBBBCCCCC  -> T == 100
    // VVVTTTILLLLLLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBBBBBB -> T != 100

    let version = parseInt( package.substring(0, 3), 2 );
    let type = parseInt( package.substring(3, 6), 2 );
    let data;
    if (type == 4) {
        data = getPackageTypeNumber( package.substring(6) )
    } else {
        data = getPackageTypeOperator( package.substring(6) )
    }

    return {
        version: version,
        type: type,
        size: 6 + data.dataSize,
        data: data,
        header: package.substring(0, 3) + " " + package.substring(3, 6),
        bits: package.substring(0, 3) + " " + package.substring(3, 6) + " " + data.bits,
    };

}

function sumVersions( package ) {
    let sum = package.version;
    
    if (package.type != 4) {
        for ( let data of package.data.data )
            sum += sumVersions( data );
    }

    return sum;
}

console.log(inputPackage);
console.log(convertHexToBinary( inputPackage ));
let result = parsePackage( convertHexToBinary( inputPackage ) );

console.log( JSON.stringify(result) );

console.log(`Versions sum: ${ sumVersions(result) }`);
