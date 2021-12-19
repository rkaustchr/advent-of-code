
class SnailfishNode {
    constructor(parent, value, left = null, right = null) {
        this.parent = parent;
        this.value = value;
        this.left = left;
        this.right = right;

        if ( Array.isArray( value ) ) {
            this.value = null;

            this.left  = new SnailfishNode( this, value[0] );
            this.right = new SnailfishNode( this, value[1] );
        }
    }

    magnitude() {
        if ( this.value != null )
            return this.value;

        return ( 3*this.left.magnitude() + 2*this.right.magnitude() );
    }

    print() {
        if (this.value != null)
            return this.value;
        
        return `[ ${this.left.print()}, ${this.right.print()} ]`;
    }
}

class SnailfishTree {
    constructor( initialStatus ) {
        this.root = new SnailfishNode(null, null);

        this.root.left  = new SnailfishNode( this.root, initialStatus[0] );
        this.root.right = new SnailfishNode( this.root, initialStatus[1] );
    }

    add( tree ) {
        if ( this.root == null)
            this.root = tree;
        else {
            let newRoot = new SnailfishNode(null, null, this.root, tree.root);
            this.root.parent = newRoot;
            tree.root.parent = newRoot;
            this.root = newRoot;
        }

        let additionIsFinished = false;
        while (!additionIsFinished) {
            additionIsFinished = true;
            let nodeToExplode = this.needToExplode();
            if (nodeToExplode) {
                additionIsFinished = false;
                this.explode( nodeToExplode );
                continue;
            }
            
            let nodeToSplit = this.needToSplit();
            if (nodeToSplit) {
                additionIsFinished = false;
                this.split( nodeToSplit );
                continue;
            }
        }
    }

    explode(node) {
        let left = this.getLeftNeighbor(node);
        let right = this.getRightNeighbor(node);

        if (left)
            left.value += node.left.value;
        
        if (right)
            right.value += node.right.value;
        
        node.left = null;
        node.right = null;
        node.value = 0;
    }

    split(node) {
        node.left  = new SnailfishNode( node, Math.floor( node.value / 2 ) );
        node.right = new SnailfishNode( node, Math.ceil( node.value / 2 ) );
        node.value = null;
    }

    magnitude() {
        return this.root.magnitude();
    }

    needToExplode(_node = null, level = 0) {
        let node = _node || this.root;

        if ( node.value != null && level < 5 )
            return null;
        
        if ( node.value == null && level >= 4 )
            return node;
        
        let nodeToExplode = this.needToExplode(node.left, level+1 );
        if ( nodeToExplode != null )
            return nodeToExplode;
        
        nodeToExplode = this.needToExplode(node.right, level+1 );
        if ( nodeToExplode != null )
            return nodeToExplode;

        return null;
    }

    needToSplit(_node = null) {
        let node = _node || this.root;

        if ( node.value != null && node.value < 10 )
            return null;
        
        if ( node.value != null && node.value > 9 )
            return node;
        
        let nodeToSplit = this.needToSplit(node.left);
        if ( nodeToSplit != null )
            return nodeToSplit;
        
        nodeToSplit = this.needToSplit(node.right);
        if ( nodeToSplit != null )
            return nodeToSplit;

        return null;
    }

    getLeftNeighbor(node) {
        while (node.parent != null && node.parent.left == node) {
            node = node.parent;
        }

        if ( node.parent == null ) return null;
            
        node = node.parent.left;

        
        while (node != null && node.right != null) {
            node = node.right;
        }
        
        return node;
    }
    
    getRightNeighbor(node) {
        while (node.parent != null && node.parent.right == node) {
            node = node.parent;
        }

        if ( node.parent == null ) return null;
            
        node = node.parent.right;

        
        while (node != null && node.left != null) {
            node = node.left;
        }
        
        return node;
    }

    print() {
        return this.root.print();
    }
}

module.exports = {
    SnailfishTree
}