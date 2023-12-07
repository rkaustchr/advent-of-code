const util = require('../utils/utils');

const cardOrder = { 
    "A": 14,
    "K": 13,
    "Q": 12,
    "J": 11,
    "T": 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
};

async function main() {
    const linesStream = await util.getFileStreamLines('./input.txt');

    const hands = [];
    for await (const line of linesStream) {
        const [ hand, bid ] = line.split(' ');
        hands.push({ hand, bid: +bid });
    }

    hands.sort(handCmp);

    let total = 0;
    let rank = hands.length;
    for (const hand of hands) {
        total += rank * hand.bid;
        rank--;
    }
    
    console.log("Result: %d", total);

    // LOG STATS
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`\n\nThe script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main();

function handCmp(h1, h2) {
    const type1 = handValue(h1.hand);
    const type2 = handValue(h2.hand);

    if ( type1 > type2 )
        return -1;
    if ( type1 < type2 )
        return 1;

    for(let i=0; i < h1.hand.length; i++) {
        if ( cardOrder[ h1.hand[i] ] > cardOrder[ h2.hand[i] ] )
            return -1;
        if ( cardOrder[ h1.hand[i] ] < cardOrder[ h2.hand[i] ] )
            return 1;
    }
    
    return 0;
}

// simple way to rank type of hands
//  get the frequency of the 2 most frequent cards and combine in one numbe: 1st * 10 + 2nd
//  Five of a kind: 50; Four of a kind: 41; Full house: 32; Three of a kind: 31; Two pair: 22; One pair: 21; High card: 11
function handValue(hand) {
    const freq = {};
    for(const c of hand)
        freq[ c ] = (freq[ c ] || 0) + 1;

    let [ first, second ] = [ 0, 0 ];
    for (const c in freq) {
        if ( freq[c] > first ) {
            second = first;
            first = freq[c];
        } else if ( freq[c] > second ) {
            second = freq[c];
        }
    }

    return first * 10 + second;
}