import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";

import Tooltip from "../../components/toolTip.jsx";
import { characters } from "../../data/characters.js";
import { itemGroup } from "../../data/itemGroup.js"; // if you have it; if not, see note below
import { loadCharacterSheet } from "../../lib/loadCharacterData.js";

function rarityStars(rarity) {
  return "★★★★★".slice(0, rarity ?? 0);
}

function statLabel(statGrow) {
  if (statGrow === "em") return "Elemental Mastery";
  if (statGrow === "critRate") return "CRIT Rate";
  if (statGrow === "critDamage") return "CRIT DMG";
  return statGrow;
}

function formatGrowValue(sheet, statGrow, idx) {
  const v = sheet?.[statGrow]?.[idx];
  if (v == null) return "-";
  if (statGrow === "em") return Math.round(v);
  if (statGrow === "critRate" || statGrow === "critDamage")
    return `${(v * 100).toFixed(1)}%`;
  // most other growth stats are % arrays
  return `${(v * 100).toFixed(1)}%`;
}

export default function CharacterPage() {
  const { id } = useParams();

  console.log("has aino in characters?", Boolean(characters.aino));
  console.log("some character keys:", Object.keys(characters).slice(0, 10));
  console.log("id from route:", id);

  const charMeta = characters[id];
  const sheet = loadCharacterSheet(id);

  // Basic not-found handling
  if (!charMeta || !sheet) {
    return (
      <main className='min-h-screen bg-zinc-950 text-white p-6'>
        <div className='max-w-4xl mx-auto'>
          <Link className='text-zinc-300 hover:text-white' to='/'>
            ← Back
          </Link>
          <h1 className='text-3xl font-bold mt-6'>Character not found</h1>
          <p className='text-zinc-300 mt-2'>
            No data for id: <span className='font-mono'>{id}</span>
          </p>
        </div>
      </main>
    );
  }

  // Data used by the page
  const bookId = charMeta.material?.book?.[0]?.id;
  const book = bookId ? itemGroup?.[bookId] : null;
  const bossItem = charMeta.material?.boss ?? null;
  const ascMaterials = charMeta.ascension ?? [];

  // 2-rows-per-phase display recipe (mirrors original logic)
  const ascTable = useMemo(() => {
    // these indices/labels are tuned to the data arrays in characterData JSON
    const showedIndex = [1, 20, 21, 41, 42, 52, 53, 63, 64, 74, 75, 85, 86, 96];
    const levelLabel = [1, 20, 20, 40, 40, 50, 50, 60, 60, 70, 70, 80, 80, 90];
    const ascLabel = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];

    const rows = showedIndex.map((idx, i) => {
      return {
        i,
        idx,
        level: levelLabel[i],
        asc: ascLabel[i],
        hp: Math.round(sheet.hp?.[idx] ?? 0),
        atk: Math.round(sheet.atk?.[idx] ?? 0),
        def: Math.round(sheet.def?.[idx] ?? 0),
        grow: formatGrowValue(sheet, sheet.statGrow, idx),
        // Materials show once per phase; for asc > 0 use previous phase materials (same as original)
        materials:
          ascLabel[i] > 0 ? (ascMaterials?.[ascLabel[i] - 1] ?? null) : null,
        isPhaseHeaderRow: i % 2 === 0, // row 0,2,4,... gets the rowSpan cells
      };
    });

    return rows;
  }, [sheet, ascMaterials]);

  return (
    <main className='min-h-screen bg-zinc-950 text-white relative overflow-hidden'>
      {/* Hero backdrop (fixed behind content) */}
      <div className='pointer-events-none fixed inset-0 -z-0'>
        {/* Soft gradient wash */}
        <div className='absolute inset-0' />

        {/* Character art */}
        <div className='absolute inset-0 flex items-start justify-center pt-24'>
          <img
            src={`/images/characters/full/${id}.png`}
            alt=''
            className='h-full w-auto object-contain opacity-80 md:opacity-90'
          />
        </div>

        {/* Darkening overlay for readability */}
        <div className='absolute inset-0 bg-zinc-950/30' />
      </div>

      <div className='relative z-10 px-6 pt-6'>
        <div className='max-w-6xl mx-auto flex items-center justify-between'>
          <Link className='text-zinc-300 hover:text-white' to='/'>
            ← Dashboard
          </Link>
          <div className='text-zinc-400/60 text-xs font-mono'>
            /characters/{id}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className='relative z-10 px-6 pb-10 pt-2'>
        <div className='max-w-5xl mx-auto grid gap-4'>
          {/* RIGHT: Info cards */}
          <div className='min-w-0 grid gap-6'>
            {/* Header */}
            <div className='relative overflow-hidden rounded-3xl bg-zinc-900/90 border border-white/10 p-6'>
              <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
                <h1 className='text-4xl font-black tracking-tight'>
                  {charMeta.name}
                </h1>

                {/* element icon */}
                {charMeta.element?.id && (
                  <img
                    src={`/images/elements/${charMeta.element.id}.png`}
                    alt={charMeta.element.name}
                    className='h-8 w-8 object-contain'
                  />
                )}

                <span className='text-zinc-300'>
                  {charMeta.weapon?.name ?? sheet.weapon}
                </span>
              </div>

              <p className='text-zinc-300 mt-3 max-w-2xl'>
                {sheet.description}
              </p>

              {/* Highlight stat grow */}
              <div className='mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-2'>
                <span className='text-zinc-400 text-sm'>Ascension Bonus</span>
                <span className='font-semibold'>
                  {statLabel(sheet.statGrow)}
                </span>
              </div>
              <img
                src={`/images/characters/portrait/${id}.png`}
                alt=''
                className='pointer-events-none select-none absolute right-6 top-1/2 -translate-y-1/2 h-28 w-28 object-contain opacity-90 hidden md:block'
              />
            </div>

            {/* Key materials strip */}
            <div className='rounded-3xl bg-zinc-900/90 border border-white/10 p-6'>
              <div className='flex flex-wrap gap-6 items-start'>
                <div>
                  <div className='text-sm text-zinc-400 mb-2'>Talent Book</div>
                  {bookId ? (
                    <Tooltip title={book?.name ?? bookId}>
                      <div className='flex items-center gap-3'>
                        <div className='h-12 w-12 rounded-2xl bg-black/30 border border-white/10 p-2'>
                          <img
                            src={`/images/items/${bookId}.png`}
                            alt={book?.name ?? bookId}
                            className='h-full w-full object-contain'
                          />
                        </div>
                        <div className='min-w-0'>
                          <div className='font-semibold truncate'>
                            {book?.name ?? bookId}
                          </div>
                          {/*<div className="text-xs text-zinc-400">From charMeta.material.book</div>*/}
                        </div>
                      </div>
                    </Tooltip>
                  ) : (
                    <div className='text-zinc-400'>—</div>
                  )}
                </div>

                <div>
                  <div className='text-sm text-zinc-400 mb-2'>Boss</div>
                  {bossItem?.id ? (
                    <Tooltip title={bossItem.name ?? bossItem.id}>
                      <div className='h-12 w-12 rounded-2xl bg-black/30 border border-white/10 p-2'>
                        <img
                          src={`/images/items/${bossItem.id}.png`}
                          alt={bossItem.name ?? bossItem.id}
                          className='h-full w-full object-contain'
                        />
                      </div>
                    </Tooltip>
                  ) : (
                    <div className='text-zinc-400'>—</div>
                  )}
                </div>

                <div className='flex-1 min-w-[240px]'>
                  <div className='text-sm text-zinc-400 mb-2'>
                    Ascension Materials (preview)
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {(ascMaterials?.[0]?.items ?? [])
                      .filter((x) => x?.item?.id && x.item.id !== "none")
                      .map((x) => (
                        <Tooltip
                          key={x.item.id}
                          title={x.item.name ?? x.item.id}
                        >
                          <div className='h-12 w-12 rounded-2xl bg-black/30 border border-white/10 p-2'>
                            <img
                              src={`/images/items/${x.item.id}.png`}
                              alt={x.item.name ?? x.item.id}
                              className='h-full w-full object-contain'
                            />
                          </div>
                        </Tooltip>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Ascension table */}
            <div className='rounded-3xl bg-zinc-900/90 border border-white/10 p-6 overflow-x-auto'>
              <div className='flex items-end justify-between gap-4 mb-4'>
                <div>
                  <h2 className='text-xl font-bold'>Ascension Planner</h2>
                  <p className='text-sm text-zinc-400'>
                    Clean rows (cap stats + mats). We can add the
                    “two-rows-per-phase” view later if you want.
                  </p>
                </div>
              </div>

              <table className='min-w-[900px] w-full text-sm'>
                <thead className='text-zinc-300'>
                  <tr className='border-b border-white/10'>
                    <th className='text-left py-3 pr-3'>ASC</th>
                    <th className='text-left py-3 pr-3'>Cap</th>
                    <th className='text-left py-3 pr-3'>HP</th>
                    <th className='text-left py-3 pr-3'>ATK</th>
                    <th className='text-left py-3 pr-3'>DEF</th>
                    <th className='text-left py-3 pr-3'>
                      {statLabel(sheet.statGrow)}
                    </th>
                    <th className='text-left py-3'>Materials</th>
                  </tr>
                </thead>

                <tbody>
                  {ascTable.map((row) => (
                    <tr
                      key={row.i}
                      className='border-b border-white/5 align-top'
                    >
                      {/* ASC cell once per phase (rowSpan=2) */}
                      {row.isPhaseHeaderRow && (
                        <td
                          rowSpan={2}
                          className='py-3 pr-3 font-semibold align-middle'
                        >
                          {row.asc}
                        </td>
                      )}

                      {/* LEVEL */}
                      <td className='py-3 pr-3 text-zinc-300'>
                        Lv. {row.level}
                      </td>

                      {/* STATS */}
                      <td className='py-3 pr-3'>{row.hp}</td>
                      <td className='py-3 pr-3'>{row.atk}</td>
                      <td className='py-3 pr-3'>{row.def}</td>

                      {/* Bonus stat once per phase */}
                      {row.isPhaseHeaderRow && (
                        <td
                          rowSpan={2}
                          className='py-3 pr-3 font-semibold align-middle'
                        >
                          {row.grow}
                        </td>
                      )}

                      {/* Materials once per phase */}
                      {row.isPhaseHeaderRow && (
                        <td rowSpan={2} className='py-3 align-middle'>
                          {row.materials ? (
                            <div className='flex flex-col gap-2'>
                              <div className='flex flex-wrap gap-2 items-center'>
                                {row.materials.items
                                  .filter(
                                    (x) => x?.item?.id && x.item.id !== "none",
                                  )
                                  .map((x) => (
                                    <Tooltip
                                      key={x.item.id}
                                      title={x.item.name ?? x.item.id}
                                    >
                                      <div className='inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-black/20 px-2 py-1'>
                                        <img
                                          src={`/images/items/${x.item.id}.png`}
                                          alt={x.item.name ?? x.item.id}
                                          className='h-6 w-6 object-contain'
                                        />
                                        <span className='text-zinc-200'>
                                          ×{x.amount}
                                        </span>
                                      </div>
                                    </Tooltip>
                                  ))}
                              </div>

                              <div className='text-zinc-300 inline-flex items-center gap-2'>
                                <img
                                  src='/images/mora.png'
                                  alt='Mora'
                                  className='h-5 w-5'
                                />
                                <span>
                                  {Intl.NumberFormat("en").format(
                                    row.materials.mora ?? 0,
                                  )}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className='text-zinc-500'>—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
