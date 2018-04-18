const test = require('ava');
const Cache = require('./src/index');

test('initializes a cache correctly', t => {
	const cache = new Cache(3);
	t.is(cache.limit, 3);
	t.is(cache.size, 0);
	t.is(typeof cache, 'object')
});

test('sets new keys in cache', t => {
	const cache = new Cache(3);
	cache.set("Sapiens", 5);
	t.is(Object.keys(cache.hashMap).length, 1);
	cache.set("Book Thief", 4);
	t.is(Object.keys(cache.hashMap).length, 2);
	cache.set("Catcher In The Rye", 0);
	t.is(Object.keys(cache.hashMap).length, 3);
	cache.set("Thus Spoke Zarathustra", 4);
	t.is(Object.keys(cache.hashMap).length, 3);
	t.is(cache.hashMap.Sapiens, undefined);
});

test('get key', t => {
	const cache = new Cache(3);
	cache.set("Sapiens", 5);
	t.is(Object.keys(cache.hashMap).length, 1);
	cache.set("Book Thief", 4);
	t.is(Object.keys(cache.hashMap).length, 2);
	cache.set("Catcher In The Rye", 0);
	t.is(Object.keys(cache.hashMap).length, 3);
	const sapiensRating = cache.get("Sapiens");
	t.is(sapiensRating, 5);
	cache.set("Thus Spoke Zarathustra", 4);
	t.is(Object.keys(cache.hashMap).length, 3);
	t.is(cache.hashMap.Sapiens.content.value, 5);
	t.is(cache.hashMap["Book Thief"], undefined);
});