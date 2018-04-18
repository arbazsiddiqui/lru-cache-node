class Cache {

	constructor(limit) {
		this.size = 0;
		this.limit = typeof limit === 'number' ? limit : Infinity;
		this.hashMap = {};
		this.head = null;
		this.tail = null;
	}

	/* Three steps :
		1. Make nodes next to current head
		2. Make heads previous to node
		3. Make head as node
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
		if (this.hashMap[key]) {

		} else {
			if (this.size >= this.limit) {
				delete this.hashMap[this.tail.content.key];
				this.size -= 1;
				this.tail = this.tail.prev;
				this.tail.next = null;
			}
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
		} else {

		}
	}

}

class Node {
	constructor(key, value) {
		if (!key)
			throw new Error("Key not provided");
		if (!value)
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