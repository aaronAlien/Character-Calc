// src/stores/todoStore.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createTodoStore } from './todoStore.js';

function makeMemoryStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    clear: () => map.clear(),
  };
}

test('adds a character todo and persists', () => {
  const storage = makeMemoryStorage();
  const store = createTodoStore({ storage });

  store.addTodo({
    type: 'character',
    title: 'Aino',
    icon: { kind: 'character', id: 'aino' },
    level: { from: 1, to: 90 },
    resources: { mora: 123, heros_wit: 9 },
    original: { mora: 123, heros_wit: 9 },
  });

  const snap = store.getSnapshot();
  assert.equal(snap.length, 1);
  assert.equal(snap[0].type, 'character');
  assert.equal(snap[0].resources.mora, 123);

  // ensure original is separate copy (not same ref)
  snap[0].resources.mora = 1;
  assert.equal(snap[0].original.mora, 123);
});

test('decreases resource across todos in order', () => {
  const storage = makeMemoryStorage();
  const store = createTodoStore({ storage });

  store.addTodo({
    type: 'character',
    title: 'First',
    icon: { kind: 'character', id: 'a' },
    level: { from: 1, to: 20 },
    resources: { mora: 1000 },
    original: { mora: 1000 },
  });

  store.addTodo({
    type: 'character',
    title: 'Second',
    icon: { kind: 'character', id: 'b' },
    level: { from: 1, to: 20 },
    resources: { mora: 1000 },
    original: { mora: 1000 },
  });

  store.decreaseResource('mora', 1500);

  const snap = store.getSnapshot();
  assert.equal(snap[0].resources.mora, 0);
  assert.equal(snap[1].resources.mora, 500);
});
