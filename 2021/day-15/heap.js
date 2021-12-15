
const HEAP_TYPE = {
	MAX: "MAX",
	MIN: "MIN"
}

class Heap {
	constructor(type = HEAP_TYPE.MAX) {
		this.type = type;
		this.heap = [];
		this.itemPosMap = {};

		if ( type == HEAP_TYPE.MAX )
			this._compare = this._compareMax;
		else if ( type == HEAP_TYPE.MIN )
			this._compare = this._compareMin;
		else
			throw new Exception("Invalid HEAP_TYPE. Valid values are: HEAP_TYPE.MAX e HEAP_TYPE.MIN");
	}

	peek() {
		return this.size() > 0 ? this.heap[0].value : null;
	}

	pop() {
		if ( this.size() == 0 ) throw new Exception("Illegal action. Trying to pop an empty heap");

		let popedItem = this.heap[0];

		delete this.itemPosMap[ popedItem.key ];

		this.heap[0] = this.heap.pop();
		this.itemPosMap[ this.heap[0].key ] = 0;

		this._pushDown(0);

		return [ popedItem.value, popedItem.key ];
	}

	push( item, key = "null" ) {
		let newItem = new HeapItem(item, key);
		let newItemIndex = this.size();

		this.heap.push( newItem );
		this.itemPosMap[ key ] = newItemIndex;
		this._pushUp( newItemIndex );
	}

	size() {
		return this.heap.length;
	}

	_pushUp(index) {
		if (index == 0) return;

		let father = parseInt((index-1)/2)
		if ( this._compare(this.heap[index], this.heap[father]) ) {
			this._swap(index, father);
			this._pushUp(father);
		}
	}

	_pushDown(index) {
		let son1 = (index * 2) + 1;
		let son2 = (index * 2) + 2;
		let swapSon = null;

		if ( son1 < this.size() )
			swapSon = son1;

		if ( son2 < this.size() )
			if ( swapSon == null || this._compare(this.heap[son2], this.heap[son1]) )
				swapSon = son2;

		if ( swapSon == null )
			return;

		if ( this._compare(this.heap[swapSon], this.heap[index]) ) {
			this._swap(index, swapSon);
			this._pushDown(swapSon);
		}
	}

	_swap(indexA, indexB) {
		let tmp = this.heap[indexA];
		this.heap[indexA] = this.heap[indexB];
		this.heap[indexB] = tmp;

		this.itemPosMap[ this.heap[indexA].key ] = indexA;
		this.itemPosMap[ this.heap[indexB].key ] = indexB;
	}

	_compareMax(a, b) {
		return a.value > b.value ? 1 : 0;
	}

	_compareMin(a, b) {
		return a.value < b.value ? 1 : 0;
	}

}

class HeapItem {

	constructor( value, key = "null") {
		this.value = value;
		this.key = key;
	}

}

module.exports= {
	HEAP_TYPE,
	Heap
}
