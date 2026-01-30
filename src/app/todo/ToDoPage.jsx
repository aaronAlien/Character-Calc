import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { todoStore, useTodos } from '../../stores/todoStore';
import { itemList } from '../../data/itemList';

function sumResources(todos) {
  const summary = {};
  for (const t of todos) {
    for (const [id, amt] of Object.entries(t.resources || {})) {
      summary[id] = (summary[id] ?? 0) + (Number(amt) || 0);
    }
  }
  return summary;
}

export default function TodoPage() {
  const todos = useTodos();

  const summary = useMemo(() => sumResources(todos), [todos]);
  const summaryRows = useMemo(
    () => Object.entries(summary).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0)),
    [summary]
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="px-6 pt-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link className="text-zinc-300 hover:text-white" to="/">
            ← Dashboard
          </Link>
          <div className="text-zinc-400/60 text-xs font-mono">/todo</div>
        </div>
      </div>

      <div className="px-6 pb-10 pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-black">Todo List</h1>

            <button
              type="button"
              onClick={() => todoStore.clearTodos()}
              className="text-sm text-zinc-300 hover:text-white border border-white/10 rounded-xl px-3 py-2"
              title="Clear all todos"
            >
              Clear all
            </button>
          </div>

          {/* Todo cards */}
          <section className="mt-6 grid gap-4 md:grid-cols-2">
            {todos.map((todo, index) => (
              <article
                key={todo.id}
                className="rounded-3xl border border-white/10 bg-zinc-900/50 p-5"
              >
                <div className="flex items-center gap-3">
                  {/* icon */}
                  {todo.icon?.kind === 'character' ? (
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={`/images/characters/${todo.icon.id}.png`}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/5" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">
                      {todo.title ?? (todo.type === 'character' ? 'Character' : 'Items')}
                    </div>
                    {todo.level ? (
                      <div className="text-zinc-400 text-sm">
                        Level {todo.level.from} → {todo.level.to}
                      </div>
                    ) : (
                      <div className="text-zinc-400 text-sm"># {index + 1}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="border border-white/10 rounded-lg px-2 py-1 text-zinc-300 hover:text-white disabled:opacity-40"
                      onClick={() => todoStore.moveTodo(todo.id, -1)}
                      disabled={index === 0}
                      title="Move up"
                      type="button"
                    >
                      ←
                    </button>
                    <button
                      className="border border-white/10 rounded-lg px-2 py-1 text-zinc-300 hover:text-white disabled:opacity-40"
                      onClick={() => todoStore.moveTodo(todo.id, 1)}
                      disabled={index === todos.length - 1}
                      title="Move down"
                      type="button"
                    >
                      →
                    </button>
                    <button
                      className="border border-white/10 rounded-lg px-2 py-1 text-zinc-300 hover:text-white"
                      onClick={() => todoStore.deleteTodo(todo.id)}
                      title="Delete"
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[380px]">
                    <tbody>
                      {Object.entries(todo.resources || {})
                        .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
                        .map(([id, amount]) => (
                          <tr key={id} className="border-b border-white/10">
                            <td className="py-2 text-right pr-3 tabular-nums text-zinc-100">
                              {Intl.NumberFormat().format(amount)}
                            </td>
                            <td className="py-2 text-zinc-200">
                              <span className="inline-flex items-center gap-2">
                                <img
                                  className="w-6 h-6 object-contain"
                                  src={`/images/items/${id}.png`}
                                  alt={itemList[id]?.name ?? id}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                <span className="font-medium">{itemList[id]?.name ?? id}</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </section>

                    {/* Summary */}
          <section className="mt-6 rounded-3xl border border-white/10 bg-zinc-900/50 p-5">
            <h2 className="text-lg font-semibold">Summary</h2>

            {summaryRows.length === 0 ? (
              <p className="text-zinc-300 mt-2">
                Nothing in your todo list yet. Add something from the calculator.
              </p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[420px]">
                  <tbody>
                    {summaryRows.map(([id, amount]) => (
                      <tr key={id} className="border-b border-white/10">
                        <td className="py-2 text-right pr-3 tabular-nums text-zinc-100">
                          {Intl.NumberFormat().format(amount)}
                        </td>
                        <td className="py-2 text-zinc-200">
                          <span className="inline-flex items-center gap-2">
                            {/* If you have item icons available, you can enable these paths */}
                            <img
                              className="w-6 h-6 object-contain"
                              src={`/images/items/${id}.png`}
                              alt={itemList[id]?.name ?? id}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <span className="font-medium">{itemList[id]?.name ?? id}</span>
                          </span>

                          {/* lightweight decrement buttons (optional now, but handy) */}
                          <span className="ml-3 inline-flex gap-2">
                            <button
                              type="button"
                              className="text-xs border border-white/10 rounded-lg px-2 py-1 text-zinc-300 hover:text-white"
                              onClick={() => todoStore.decreaseResource(id, id === 'mora' ? 1000 : 1)}
                              title="Decrease"
                            >
                              -{id === 'mora' ? '1000' : '1'}
                            </button>
                            <button
                              type="button"
                              className="text-xs border border-white/10 rounded-lg px-2 py-1 text-zinc-300 hover:text-white"
                              onClick={() => todoStore.decreaseResource(id, id === 'mora' ? 10000 : 5)}
                              title="Decrease"
                            >
                              -{id === 'mora' ? '10000' : '5'}
                            </button>
                            <button
                              type="button"
                              className="text-xs border border-white/10 rounded-lg px-2 py-1 text-zinc-300 hover:text-white"
                              onClick={() => todoStore.decreaseResource(id, id === 'mora' ? 50000 : 10)}
                              title="Decrease"
                            >
                              -{id === 'mora' ? '50000' : '10'}
                            </button>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}
