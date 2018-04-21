# lru-cache-node

> A lighting fast cache manager for node with least-recently-used policy.

A super fast cache for node with LRU policy. Cache will keep on adding values until the `maxSize` is reached.

After that it will start popping out the Least recently used/accessed value from the cache in order to set the new ones.


Supports expiry and stale.

Implemented using doubly-linked-list and hashmap with O(1) time complexity for gets and sets.


## Install

```
$ npm install --save lru-cache-node
```

## Usage

```js
const Cache = require('lru-cache-node');

let cache = new Cache(3); //set max size of cache as three

cache.set('a', 7); //sets a value in cache with 'a' as key and 7 as value
cache.set('b', 5);
cache.set('c', 3); 
/*
  [ { key: 'c', value: 3 },
    { key: 'b', value: 5 },
    { key: 'a', value: 7 } ]
 */
 
cache.set('d', 10) // pops out a
/*
  [ { key: 'd', value: 10 },
    { key: 'c', value: 3 },
    { key: 'b', value: 5 } ]
 */
 
cache.get("b") //returns 5 and makes it most recently used
/*
  [ { key: 'b', value: 5 },
    { key: 'd', value: 10 },
    { key: 'c', value: 3 } ]
 */

cache.peek("d") //returns 10 but doesnt resets the order
/*
  [ { key: 'b', value: 5 },
    { key: 'd', value: 10 },
    { key: 'c', value: 3 } ]
 */

let cache = new Cache(3, 10); //Initialize Cache with size 3 and expiry for keys as 10ms
const sleep = ms => new Promise(r => setTimeout(r, ms));

cache.set('a', 7); //valid for 10ms
cache.get('a'); //returns 7 and resets 10ms counter
await sleep(15);
cache.get('a'); //null

cache.set('b', 5, 30); //overwrites cache's default expiry of 10ms and uses 30ms
await sleep(15);
cache.get('b'); //returns 5 and resets the expiry of b back to 30ms
await sleep(35);
cache.get('b'); //null
```

## API
### cache(maxSize, maxAge, stale)

#### `maxSize`
Type: `Number`<br>
Default: `Infinity`

Maximum size of the cache.

#### `maxAge`
Type: `Number`<br>
Default: `Infinity`

Default expiry for all keys for the cache. It does not proactively deletes expired keys, but will return null when an expired key is being accessed.

#### `stale`
Type: `Boolean`<br>
Default: `false`

If set to true, will return the value of expired key before deleting it from cache.

### set(key, value, maxAge)

#### `key`

Key to be set.

#### `value`

Value for the key.

#### `maxAge`

Expiry of the key. Will override cache's `maxAge` if specified.

### get(key)

Returns the value for the key. If not key does not exist will return `null`.

>Both set() and get() will update the "recently used"-ness and expiry of the key.

### peek(key)

Returns the value for the key, without making the key most recently used. If not key does not exist will return `null`.

### delete(key)
Deletes the key from the cache.

### contains(key)

Returns a boolean indication if the value exists in cache or not.

### getSize()

Returns the current size of cache.

### reset()

Clears the whole cache and reinitialize it.

### toArray()

Returns an array form of the catch.
```js
let cache = new Cache();
cache.set("a", 5);
cache.set("b", 4);
cache.set("c", 0);
cache.toArray()
/*
[ { key: 'c', value: 0 },
  { key: 'b', value: 4 },
  { key: 'a', value: 5 } ]
*/
```

### forEach(callback)

Takes a function and iterates over all the keys in the cache, in order of recent-ness. Callback takes `key`, `value` and `index` as params.
```js
let cache = new Cache();
cache.set("a", 1);
cache.set("b", 2);
cache.set("c", 3);
cache.forEach((key, value, index) => {
	console.log(key, value, index)
})
/*
c 3 0
b 2 1
a 1 2
*/
```