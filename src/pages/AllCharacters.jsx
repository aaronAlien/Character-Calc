import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { characters } from "../data/characters";

const SORT_OPTIONS = [
  { value: "name", label: "Name (A–Z)" },
  { value: "rarity", label: "Rarity (High–Low)" },
  { value: "element", label: "Element (A–Z)" },
  { value: "weapon", label: "Weapon (A–Z)" },
];

const ELEMENTS = [
  { id: "pyro", label: "Pyro" },
  { id: "hydro", label: "Hydro" },
  { id: "anemo", label: "Anemo" },
  { id: "electro", label: "Electro" },
  { id: "dendro", label: "Dendro" },
  { id: "cryo", label: "Cryo" },
  { id: "geo", label: "Geo" },
];

function cmp(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export default function AllCharacters() {
  const [sortBy, setSortBy] = useState("name");
  const [elementFilter, setElementFilter] = useState(() => new Set());
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowBackToTop(window.scrollY > 600);
    }

    onScroll(); // set initial state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function backToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const list = useMemo(() => {
    const arr = Object.values(characters);

    const filtered =
      elementFilter.size > 0
        ? arr.filter((c) => elementFilter.has(c?.element?.id))
        : arr;

    const sorted = [...filtered].sort((a, b) => {
      // stable tie-breaker by name then id
      const an = (a.name ?? "").toLowerCase();
      const bn = (b.name ?? "").toLowerCase();

      if (sortBy === "name") {
        return cmp(an, bn) || cmp(a.id, b.id);
      }

      if (sortBy === "rarity") {
        return (
          (b.rarity ?? 0) - (a.rarity ?? 0) || cmp(an, bn) || cmp(a.id, b.id)
        );
      }

      if (sortBy === "element") {
        const ae = (a.element?.id ?? "").toLowerCase();
        const be = (b.element?.id ?? "").toLowerCase();
        return cmp(ae, be) || cmp(an, bn) || cmp(a.id, b.id);
      }

      if (sortBy === "weapon") {
        const aw = (a.weapon?.id ?? a.weapon?.name ?? "").toLowerCase();
        const bw = (b.weapon?.id ?? b.weapon?.name ?? "").toLowerCase();
        return cmp(aw, bw) || cmp(an, bn) || cmp(a.id, b.id);
      }

      return cmp(an, bn) || cmp(a.id, b.id);
    });

    return sorted;
  }, [sortBy, elementFilter]);

  function toggleElement(id) {
    setElementFilter((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearElements() {
    setElementFilter(new Set());
  }

  function formatElementList(elements) {
    return [...elements]
      .map((el) => el.charAt(0).toUpperCase() + el.slice(1))
      .join(" - ");
  }

  return (
    <main className='min-h-screen bg-zinc-950 text-white'>
      {/* Header */}
      <div className='px-6 pt-6'>
        <div className='max-w-6xl mx-auto flex items-center justify-between gap-4'>
          <div>
            <div className='flex items-center gap-3'>
              <Link className='text-zinc-300 hover:text-white' to='/'>
                ← Dashboard
              </Link>
              <span className='text-zinc-400/60 text-xs font-mono'>
                /characters
              </span>
            </div>
            <h1 className='mt-3 text-3xl md:text-4xl font-black tracking-tight'>
              All Characters
            </h1>
            <p className='text-zinc-300 mt-2'>
              Sort and filter. Click a character to view details.
            </p>
          </div>

          {/* Sort dropdown (always visible) */}
          <div className='w-56'>
            <label className='block text-xs text-zinc-400 mb-2'>Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='w-full rounded-2xl border border-white/10 bg-zinc-900/70 px-3 py-2 text-white outline-none'
            >
              {SORT_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className='bg-zinc-900'
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className='px-6 pb-10 pt-6'>
        <div className='max-w-6xl mx-auto relative'>
          {/* Mobile / tablet element selector */}
          <div className='lg:hidden mb-4'>
            <div className='flex items-center gap-1 overflow-x-auto pb-2'>
              {ELEMENTS.map((el) => {
                const active = elementFilter.has(el.id);

                return (
                  <button
                    key={el.id}
                    type='button'
                    onClick={() => toggleElement(el.id)}
                    className='group relative flex flex-col items-center justify-center px-1 py-1 transition'
                    aria-pressed={active}
                    title={el.label}
                  >
                    {/* icon */}
                    <span
                      className={[
                        "rounded-xl p-1 transition",
                        active ? "ring-2 ring-white/70" : "ring-0",
                      ].join(" ")}
                    >
                      <img
                        src={`/static/images/elements/${el.id}.png`}
                        alt={el.label}
                        className='h-8 w-8 object-contain cursor-pointer'
                      />
                    </span>

                    {/* animated underline indicator */}
                    <span
                      className={[
                        "mt-1 h-[3px] w-6 rounded-full bg-white/80 transition-transform duration-200 origin-center",
                        active ? "scale-x-100" : "scale-x-0",
                      ].join(" ")}
                    />
                  </button>
                );
              })}

              {elementFilter.size > 0 && (
                <div className='mb-4 flex flex-wrap items-center gap-2'>
                  {elementFilter.size > 0 && (
                    <button
                      type='button'
                      onClick={clearElements}
                      className='ml-2 text-sm text-zinc-300 hover:text-white cursor-pointer'
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right-side vertical element selector (hidden on small screens) */}
          <aside className='hidden lg:flex flex-col gap-1 absolute -right-16 top-0'>
            <div className='text-xs text-zinc-400 mb-1 text-center'>
              Element
            </div>
            {ELEMENTS.map((el) => {
              const active = elementFilter.has(el.id);
              return (
                <button
                  key={el.id}
                  type='button'
                  onClick={() => toggleElement(el.id)}
                  className='group relative h-12 w-12 flex items-center justify-center'
                  aria-pressed={active}
                  title={el.label}
                >
                  <span
                    className={[
                      "rounded-2xl p-1 transition",
                      active ? "ring-2 ring-white/70" : "ring-0",
                    ].join(" ")}
                  >
                    <img
                      src={`/static/images/elements/${el.id}.png`}
                      alt={el.label}
                      className='h-8 w-8 object-contain cursor-pointer'
                    />
                  </span>

                  {/* animated dot indicator on the left */}
                  <span
                    className={[
                      "absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white/80 transition-transform duration-200",
                      active ? "scale-100" : "scale-0",
                    ].join(" ")}
                  />
                </button>
              );
            })}

            {elementFilter.size > 0 && (
              <button
                type='button'
                onClick={clearElements}
                className='mt-2 text-xs text-zinc-300 hover:text-white cursor-pointer'
                title='Clear element filter'
              >
                Clear
              </button>
            )}
          </aside>

          {/* Active filter pill */}
          {elementFilter.size > 0 && (
            <div className='mb-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/60 px-3 py-2'>
              <span className='text-sm text-zinc-200'>
                Filtering:{" "}
                <span className='font-semibold'>
                  {formatElementList(elementFilter)}
                </span>
              </span>

              <button
                type='button'
                onClick={clearElements}
                className='ml-2 text-zinc-300 hover:text-white'
                aria-label='Clear element filters'
              >
                ✕
              </button>
            </div>
          )}

          {/* Grid */}
          <div className='grid sm:gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {list.map((c) => (
              <Link
                key={c.id}
                to={`/characters/${c.id}`}
                className='group rounded-xl border border-white/10 bg-zinc-900/60 hover:border-white/25 transition overflow-hidden'
              >
                {/* portrait */}
                <div className='p-3'>
                  <div className=' overflow-hidden'>
                    <img
                      src={`/static/images/characters/portrait/${c.id}.png`}
                      alt={c.name}
                      className='w-18 h-auto mx-auto block opacity-95 group-hover:opacity-100 transition'
                      loading='lazy'
                    />
                  </div>

                  {/* name row with mini element icon next to name */}
                  <div className='mt-3 flex items-center justify-between gap-2'>
                    <div className='min-w-0'>
                      <div className='flex items-center gap-2 min-w-0'>
                        {c.element?.id && (
                          <img
                            src={`/static/images/elements/${c.element.id}.png`}
                            alt={c.element.name}
                            className='h-4 w-4 object-contain flex-shrink-0'
                            loading='lazy'
                          />
                        )}
                        <p className='font-semibold text-zinc-100 truncate'>
                          {c.name}
                        </p>
                      </div>

                      <p className='text-xs text-zinc-400 mt-1'>
                        {c.weapon?.name ?? ""}
                      </p>
                    </div>

                    {/* small rarity badge */}
                    {c.rarity && (
                      <div
                        className={[
                          "flex-shrink-0 text-xs rounded-xl border px-2 py-1 bg-black/20",
                          c.rarity === 5 &&
                            "text-amber-400 border-yellow-400/30",
                          c.rarity === 4 &&
                            "text-purple-400 border-purple-400/30",
                          c.rarity !== 5 &&
                            c.rarity !== 4 &&
                            "text-zinc-200 border-white/10",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {c.rarity}★
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {list.length === 0 && (
            <div className='mt-10 text-zinc-300'>
              No characters match the current filter.
            </div>
          )}
        </div>
      </div>
      {/* Back to top */}
      {showBackToTop && (
        <button
          type='button'
          onClick={backToTop}
          className='fixed bottom-6 right-6 z-50 rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-200 shadow-lg backdrop-blur hover:border-white/25 hover:text-white transition'
          aria-label='Back to top'
        >
          ↑ Back to top
        </button>
      )}
    </main>
  );
}
