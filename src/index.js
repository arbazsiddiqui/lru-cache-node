class Cache {

	constructor(limit, maxAge, stale) {
		this.size = 0;
		this.limit = typeof limit === 'number' ? limit : Infinity;
		this.maxAge = typeof maxAge === 'number' ? maxAge : Infinity;
		this.stale = typeof stale === 'boolean' ? stale : false;
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

	set(key, value, maxAge) {
		maxAge = typeof maxAge === 'number' ? maxAge : this.maxAge;
		const node = new Node(key, value, maxAge, Date.now() + maxAge);
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
			const nodeMaxAge = oldNode.getMaxAge();
			const maxAge = typeof nodeMaxAge === 'number' ? nodeMaxAge : this.maxAge;
			if (Date.now() >= oldNode.getExpiry()) {
				this.remove(oldNode);
				return this.stale ? oldNode.getValue() : null
			}
			const newNode = new Node(key, value, maxAge, Date.now() + maxAge);
			this.remove(oldNode);
			this.setNodeAsHead(newNode);
			return value
		}
		return null
	}

	peek(key) {
		return this.hashMap[key] ? this.hashMap[key].getValue() : null
	}

	reset() {
		this.size = 0;
		this.hashMap = {};
		this.head = null;
		this.tail = null;
	}

	toArray() {
		const arr = [];
		let node = this.head;
		while (node) {
			arr.push({
				key: node.getKey(),
				value: node.getValue()
			});
			node = node.next;
		}
		return arr;
	}

	contains(key) {
		return !!this.hashMap[key]
	}

	forEach(callback) {
		let node = this.head;
		let i = 0;
		while (node) {
			callback.apply(this, [node.getKey(), node.getValue(), i]);
			i++;
			node = node.next;
		}
	}

	getSize() {
		return this.size
	}

	delete(key) {
		const node = this.hashMap[key];
		this.remove(node)
	}
}

class Node {
	constructor(key, value, maxAge, expires) {
		if (key === undefined)
			throw new Error("Key not provided");
		if (value === undefined)
			throw new Error("Value not provided");
		this.content = {key, value};
		this.prev = null;
		this.next = null;
		this.maxAge = typeof maxAge === 'number' ? maxAge : Infinity;
		this.expires = typeof expires === 'number' ? expires : Infinity;
	}

	getValue() {
		return this.content.value
	}

	getMaxAge() {
		return this.maxAge
	}

	getExpiry() {
		return this.expires
	}

	getKey() {
		return this.content.key
	}
}

module.exports = Cache;