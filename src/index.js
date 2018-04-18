class Cache {

	constructor(limit) {
		this.size = 0;
		this.limit = typeof limit === 'number' ? limit : Infinity;
		this.hashMap = {};
		this.head = null;
		this.tail = null;
	}

	/* Three steps :
		1. Make node's next to current head
		2. Make head's previous to node
		3. Make head as the node
	 */
	setNodeAsHead(node) {
		node.next = this.head;
		node.prev = null;
		if (this.head !== null)
			this.head.prev = node;
		this.head = node;
		if (this.tail === null) {
			this.tail = node;
		}
		this.size += 1;
		this.hashMap[node.content.key] = node
	}

	set(key, value) {
		const node = new Node(key, value);
		if (this.size >= this.limit) {
			delete this.hashMap[this.tail.content.key];
			this.size -= 1;
			this.tail = this.tail.prev;
			this.tail.next = null;
		}
		this.setNodeAsHead(node);
	}

	remove(node) {
		if (node.prev !== null) {
			node.prev.next = node.next;
		} else {
			this.head = node.next;
		}
		if (node.next !== null) {
			node.next.prev = node.prev;
		} else {
			this.tail = node.prev;
		}
		delete this.hashMap[node.getKey()];
		this.size -= 1;
	}

	get(key) {
		const oldNode = this.hashMap[key];
		if (oldNode) {
			const value = oldNode.getValue();
			const newNode = new Node(key, value);
			this.remove(oldNode);
			this.setNodeAsHead(newNode);
			return value
		}
		return null
	}
}

class Node {
	constructor(key, value) {
		if (key===undefined)
			throw new Error("Key not provided");
		if (value===undefined)
			throw new Error("Value not provided");
		this.content = {key, value};
		this.prev = null;
		this.next = null;
	}

	getValue() {
		return this.content.value
	}

	getKey() {
		return this.content.key
	}
}

module.exports = Cache;