import { useSyncExternalStore } from "react";

const STORAGE_KEY = "gi_todos_v1";

function defaultStorage() {
  // in tests, window/localStorage won't exist
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `todo_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/**
 * @typedef {'character'|'item'} TodoType
 *
 * @typedef {{
 *  id: string,
 *  type: TodoType,
 *  title?: string,
 *  icon?: { kind: 'character'|'item', id?: string },
 *  level?: { from: number, to: number },
 *  resources: Record<string, number>,
 *  original: Record<string, number>,
 *  createdAt: number,
 * }} Todo
 */

export function createTodoStore({ storage = defaultStorage() } = {}) {
  /** @type {Todo[]} */
  let todos = [];
  const listeners = new Set();

  function emit() {
    for (const l of listeners) l();
  }

  function hasCharacterTodo(characterId) {
    return todos.some(
      (t) =>
        t.type === "character" &&
        t.icon?.kind === "character" &&
        t.icon?.id === characterId,
    );
  }

  function load() {
    if (!storage) return;
    const raw = storage.getItem(STORAGE_KEY);
    const parsed = safeJsonParse(raw, []);
    if (Array.isArray(parsed)) todos = parsed;
  }

  function save() {
    if (!storage) return;
    storage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  // load once
  load();

  function getSnapshot() {
    return todos;
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function setTodos(next) {
    todos = next;
    save();
    emit();
  }

  /** merge resource counts into a target object (mutates target). */
  function mergeInto(target, add) {
    for (const [k, v] of Object.entries(add)) {
      const n = Number(v) || 0;
      target[k] = (target[k] ?? 0) + n;
    }
  }

  /**
   * append todo - toast success or duplicate character 
   * @param {Omit<Todo, 'id'|'createdAt'>} data
   * @returns {{ ok: true, todo: Todo } | { ok: false, reason: 'duplicate'|'invalid' }}
   */
  function addTodo(data) {
    if (!data?.type || !data?.resources) {
      return { ok: false, reason: "invalid" };
    }

    // prevent duplicate character todo (same character id)
    if (
      data.type === "character" &&
      data.icon?.kind === "character" &&
      data.icon?.id
    ) {
      if (hasCharacterTodo(data.icon.id)) {
        return { ok: false, reason: "duplicate" };
      }
    }

    const todo = {
      ...data,
      id: makeId(),
      createdAt: Date.now(),
      // IMPORTANT - ensure original/resources are not the same reference
      resources: clone(data.resources),
      original: clone(data.original ?? data.resources),
    };

    // if later add item todos?? - merge them
    if (todo.type === "item") {
      const idx = todos.findIndex((t) => t.type === "item");
      if (idx !== -1) {
        const merged = clone(todos[idx]);
        mergeInto(merged.resources, todo.resources);
        mergeInto(merged.original, todo.resources); // baseline increases too
        const next = todos.slice();
        next[idx] = merged;
        setTodos(next);
        return { ok: true, todo: next[idx] };
      }
    }

    setTodos([...todos, todo]);
    return { ok: true, todo };
  }

  /** delete by id */
  function deleteTodo(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  /** move up/down by id */
  function moveTodo(id, direction) {
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) return;
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= todos.length) return;

    const next = todos.slice();
    const [item] = next.splice(idx, 1);
    next.splice(nextIdx, 0, item);
    setTodos(next);
  }

  /* Decrease a resource */
  function decreaseResource(resourceId, amount) {
    let leftover = amount;

    const next = todos.map((t) => {
      if (leftover <= 0) return t;
      const current = Number(t.resources?.[resourceId] ?? 0);
      if (current <= 0) return t;

      const reducedBy = Math.min(current, leftover);
      leftover -= reducedBy;

      return {
        ...t,
        resources: {
          ...t.resources,
          [resourceId]: current - reducedBy,
        },
      };
    });

    setTodos(next);
  }

  function clearTodos() {
    setTodos([]);
  }

  return {
    // react subscription API
    getSnapshot,
    subscribe,

    // actions
    addTodo,
    deleteTodo,
    moveTodo,
    decreaseResource,
    clearTodos,
  };
}

// singleton store for the app
export const todoStore = createTodoStore();

/* hook to read todos - auto re-renders on change */
export function useTodos() {
  return useSyncExternalStore(
    todoStore.subscribe,
    todoStore.getSnapshot,
    todoStore.getSnapshot,
  );
}
