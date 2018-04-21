# lru-cache-node

> A lighting fast cache manager for node with least-recently-used policy.

A super fast cache for node with LRU policy. Cache will keep on adding values until the `limit` is reached.

After that it will start popping out the least recently used/accessed value from the cache in order to set the new ones.


Supports expiry and stale gets.

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

let cache = new Cache(3, 10); //Intialise Cache with size 3 and expiry for keys as 10ms
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