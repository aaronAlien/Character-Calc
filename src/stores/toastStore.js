import { useSyncExternalStore } from 'react';

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `toast_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/**
 * @typedef {'success'|'error'|'info'} ToastType
 * @typedef {{ id: string, type: ToastType, message: string, description?: string, durationMs?: number }} Toast
 */

function createToastStore() {
  /** @type {Toast[]} */
  let toasts = [];
  const listeners = new Set();

  function emit() {
    for (const l of listeners) l();
  }

  function getSnapshot() {
    return toasts;
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function remove(id) {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }

  function push(toast) {
    const id = toast.id ?? makeId();
    const durationMs = toast.durationMs ?? (toast.type === 'error' ? 5000 : 3000);

    toasts = [...toasts, { ...toast, id, durationMs }];
    emit();

    // auto-dismiss
    const timer = setTimeout(() => remove(id), durationMs);
    return () => clearTimeout(timer);
  }

  function clear() {
    toasts = [];
    emit();
  }

  return { subscribe, getSnapshot, push, remove, clear };
}

export const toastStore = createToastStore();

export function useToasts() {
  return useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot, toastStore.getSnapshot);
}

// helpers
export function toastSuccess(message, description) {
  toastStore.push({ type: 'success', message, description, durationMs: 3000 });
}

export function toastError(message, description) {
  toastStore.push({ type: 'error', message, description, durationMs: 5000 });
}
