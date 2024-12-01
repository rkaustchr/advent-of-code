const util = require('./../utils/utils');

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    let sum = 0;
    let arr1 = [];
    let arr2 = [];

    // load arrays
    let num1, num2;
    for await (const line of linesStream) {
        [ num1, num2 ] = line.split("   ").map(x => +x);
        arr1.push(num1);
        arr2.push(num2);
    }

    // sort second array
    arr2.sort((a, b) => a - b);

    // calc the similarity
    const visiteds = new Map();
    let simm = 0;
    let total = 0;
    for(let num of arr1) {
        if ( visiteds.has(num) ) {
            total += num * visiteds.get(num);
        } else {
            simm = countBinarySearch(num, arr2);
            visiteds.set(num, simm);
            total += num * simm;
        }
    }
    console.log("The total simm is: %d", total);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

/**
 * Counts the total occurencs of [num] in the sorted array [arr]
 */
function countBinarySearch(num, arr) {
    // BS to find if num is in arr
    let [ start, end, curr ] = [ 0, arr.length-1, 0 ];
    while ( start <= end ) {
        curr = parseInt((start + end) / 2);
        if ( arr[curr] == num )
            break;
        if ( num > arr[curr] )
            start = curr + 1;
        else
            end = curr - 1;
            end = curr - 1;
    }


    // count the occurences
    if ( arr[curr] != num )
        return 0;

    while ( curr >= 0 && arr[curr] == num)
        curr--;
    curr++; // put curr in the first occurence

    end = curr;
    while ( end < arr.length && arr[end] == num)
        end++;

    return end - curr;
}

main();
