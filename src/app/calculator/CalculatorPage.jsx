import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTodos, todoStore } from '../../stores/todoStore';
import { calculateCharacterPlan, calculatorHelpers } from '../../lib/calculator/calculatorEngine';
import { characters } from '../../data/characters'
import { itemList } from '../../data/itemList';
import { characterExp } from '../../data/characterExp';
import { talent as talentCosts } from '../../data/talent';


const DEFAULT_RESOURCES = [
  { selected: true, id: 'heros_wit', label: "Hero's Wit", value: 20000 },
  { selected: true, id: 'adventurers_experience', label: "Adventurer's Experience", value: 5000 },
  { selected: true, id: 'wanderes_advice', label: "Wanderer's Advice", value: 1000 },
];

function num(v) {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

export default function CalculatorPage() {
  // toggles
  const [withAscension, setWithAscension] = useState(true);
  const [withTalent, setWithTalent] = useState(false);

  // character
  const [characterId, setCharacterId] = useState('');

  // current
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentExp, setCurrentExp] = useState(0);

  // intended
  const [intendedLevel, setIntendedLevel] = useState(1);

  // resources
  const [resources, setResources] = useState(DEFAULT_RESOURCES);

  // talent
  const [currentTalentLevel, setCurrentTalentLevel] = useState({ first: 1, second: 1, third: 1 });
  const [targetTalentLevel, setTargetTalentLevel] = useState({ first: 1, second: 1, third: 1 });

  const selectedCharacter = characterId ? characters[characterId] : null;

  // derived ascensions (match Svelte behavior: asc derived from level)
  const currentAscension = useMemo(
    () => calculatorHelpers.getMinAscensionFromLevel(num(currentLevel)),
    [currentLevel]
  );
  const intendedAscension = useMemo(
    () => calculatorHelpers.getMinAscensionFromLevel(num(intendedLevel)),
    [intendedLevel]
  );

  const maxTalentLevel = useMemo(
    () => calculatorHelpers.getMaxTalentLevelFromAscension(intendedAscension),
    [intendedAscension]
  );

  // keep withTalent off if withAscension toggled off (match Svelte)
  function toggleWithAscension(next) {
    setWithAscension(next);
    if (!next) setWithTalent(false);
  }

  const canCalculate = useMemo(() => {
    const cL = num(currentLevel);
    const iL = num(intendedLevel);
    if (cL < 1 || cL > 90 || iL < 1 || iL > 90) return false;
    if (iL < cL) return false;
    if (withAscension && !selectedCharacter) return false;
    return true;
  }, [currentLevel, intendedLevel, withAscension, selectedCharacter]);

  const [result, setResult] = useState(null);
  const [changed, setChanged] = useState(false);

  function markChanged() {
    setChanged(true);
  }

  function onCalculate() {
    const res = calculateCharacterPlan({
      selectedCharacter,
      withAscension,
      withTalent,
      currentLevel: num(currentLevel),
      currentExp: num(currentExp),
      intendedLevel: num(intendedLevel),
      currentAscension,
      intendedAscension,
      currentTalentLevel,
      targetTalentLevel,
      resources,
      data: {
        characterExp,
        talentCosts,
        itemList,
        charactersMeta: characters,
      },
    });

    setResult(res);
    setChanged(false);
  }

  function addToTodo() {
    if (!result?.ok) return;

    const title = selectedCharacter ? selectedCharacter.name : 'Character';
    const todo = {
      type: 'character',
      title: selectedCharacter ? title : 'Character',
      icon: selectedCharacter ? { kind: 'character', id: selectedCharacter.id } : undefined,
      level: { from: num(currentLevel), to: num(intendedLevel) },
      resources: result.resourcesOut,
      original: result.resourcesOut,
    };

    todoStore.addTodo(todo);
  }

  function toggleResource(id) {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r))
    );
    markChanged();
  }

  function clampTalent(val) {
    const x = Math.max(1, Math.min(maxTalentLevel, num(val)));
    return x;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* header */}
      <div className="px-6 pt-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link className="text-zinc-300 hover:text-white" to="/">
            ← Dashboard
          </Link>
          <div className="text-zinc-400/60 text-xs font-mono">/calculator</div>
        </div>
      </div>

      <div className="px-6 pb-10 pt-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black">Character Calculator</h1>
          <p className="text-zinc-300 mt-2">
            Select a character, set current/target levels (and optionally talents), then add the plan to your Todo list.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-3 items-start">
            {/* LEFT: inputs */}
            <section className="rounded-3xl border border-white/10 bg-zinc-900/50 p-5 lg:col-span-2">
              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={withAscension}
                    onChange={(e) => {
                      toggleWithAscension(e.target.checked);
                      markChanged();
                    }}
                  />
                  <span className="text-zinc-200">Include ascension & materials</span>
                </label>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={withTalent}
                    disabled={!withAscension}
                    onChange={(e) => {
                      setWithTalent(e.target.checked);
                      markChanged();
                    }}
                  />
                  <span className={withAscension ? 'text-zinc-200' : 'text-zinc-500'}>
                    Include talents
                  </span>
                </label>

                <Link to="/todo" className="ml-auto text-zinc-300 hover:text-white">
                  View Todo →
                </Link>
              </div>

              {/* Character select */}
              {withAscension && (
                <div className="mt-5">
                  <div className="text-sm text-zinc-400 mb-2">Character</div>
                  <select
                    value={characterId}
                    onChange={(e) => {
                      setCharacterId(e.target.value);
                      markChanged();
                    }}
                    className="w-full rounded-xl bg-zinc-950 border border-white/10 px-3 py-2"
                  >
                    <option value="">Select a character…</option>
                    {Object.values(characters)
                      .filter((c) => c?.id && c?.name)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Current */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm text-zinc-400 mb-2">Current</div>
                  <div className="grid gap-3">
                    <label className="grid gap-1">
                      <span className="text-xs text-zinc-500">Level</span>
                      <input
                        type="number"
                        min={1}
                        max={90}
                        value={currentLevel}
                        onChange={(e) => {
                          setCurrentLevel(num(e.target.value));
                          markChanged();
                        }}
                        className="rounded-xl bg-zinc-950 border border-white/10 px-3 py-2"
                      />
                    </label>

                    <label className="grid gap-1">
                      <span className="text-xs text-zinc-500">Current EXP into level</span>
                      <input
                        type="number"
                        min={0}
                        value={currentExp}
                        onChange={(e) => {
                          setCurrentExp(num(e.target.value));
                          markChanged();
                        }}
                        className="rounded-xl bg-zinc-950 border border-white/10 px-3 py-2"
                      />
                    </label>

                    {withAscension && (
                      <div className="text-xs text-zinc-400">
                        Ascension (derived): <span className="text-white font-semibold">{currentAscension}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Intended */}
                <div>
                  <div className="text-sm text-zinc-400 mb-2">Target</div>
                  <div className="grid gap-3">
                    <label className="grid gap-1">
                      <span className="text-xs text-zinc-500">Level</span>
                      <input
                        type="number"
                        min={currentLevel}
                        max={90}
                        value={intendedLevel}
                        onChange={(e) => {
                          setIntendedLevel(num(e.target.value));
                          markChanged();
                        }}
                        className="rounded-xl bg-zinc-950 border border-white/10 px-3 py-2"
                      />
                    </label>

                    {withAscension && (
                      <div className="text-xs text-zinc-400">
                        Ascension (derived): <span className="text-white font-semibold">{intendedAscension}</span>
                      </div>
                    )}

                    {withTalent && (
                      <div className="text-xs text-zinc-400">
                        Max talent level for this target ascension:{' '}
                        <span className="text-white font-semibold">{maxTalentLevel}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* EXP resources */}
              <div className="mt-6">
                <div className="text-sm text-zinc-400 mb-2">EXP Resources</div>
                <div className="grid gap-2">
                  {resources.map((r) => (
                    <label key={r.id} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={r.selected}
                        onChange={() => toggleResource(r.id)}
                      />
                      <span className="text-zinc-200">{r.label}</span>
                      <span className="text-zinc-500 text-xs ml-auto">{r.value} EXP</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Talents */}
              {withTalent && (
                <div className="mt-6">
                  <div className="text-sm text-zinc-400 mb-2">Talents</div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-xs text-zinc-500 mb-2">Current (1–{maxTalentLevel})</div>
                      <div className="grid grid-cols-3 gap-2">
                        {['first', 'second', 'third'].map((k) => (
                          <input
                            key={k}
                            type="number"
                            min={1}
                            max={maxTalentLevel}
                            value={currentTalentLevel[k]}
                            onChange={(e) => {
                              const v = clampTalent(e.target.value);
                              setCurrentTalentLevel((p) => ({ ...p, [k]: v }));
                              // keep target >= current
                              setTargetTalentLevel((p) => ({ ...p, [k]: Math.max(p[k], v) }));
                              markChanged();
                            }}
                            className="rounded-xl bg-zinc-950 border border-white/10 px-3 py-2"
                            placeholder={k}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-zinc-500 mb-2">Target (≥ current)</div>
                      <div className="grid grid-cols-3 gap-2">
                        {['first', 'second', 'third'].map((k) => (
                          <input
                            key={k}
                            type="number"
                            min={currentTalentLevel[k]}
                            max={maxTalentLevel}
                            value={targetTalentLevel[k]}
                            onChange={(e) => {
                              const v = clampTalent(e.target.value);
                              setTargetTalentLevel((p) => ({ ...p, [k]: Math.max(v, currentTalentLevel[k]) }));
                              markChanged();
                            }}
                            className="rounded-xl bg-zinc-950 border border-white/10 px-3 py-2"
                            placeholder={k}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Calculate button */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  disabled={!canCalculate}
                  onClick={onCalculate}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 hover:bg-white/15 disabled:opacity-40"
                >
                  Calculate
                </button>

                {changed && (
                  <span className="text-xs text-zinc-400">Inputs changed — recalculate to refresh.</span>
                )}
              </div>
            </section>

            {/* RIGHT: results */}
            <section className="rounded-3xl border border-white/10 bg-zinc-900/50 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Result</h2>

                <button
                  type="button"
                  disabled={!result?.ok || changed}
                  onClick={addToTodo}
                  className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 hover:bg-white/15 disabled:opacity-40"
                  title={changed ? 'Recalculate first' : 'Add this plan to Todo'}
                >
                  Add to Todo
                </button>
              </div>

              {!result ? (
                <p className="text-zinc-300 mt-3">Run a calculation to see totals.</p>
              ) : !result.ok ? (
                <p className="text-red-300 mt-3">{result.error}</p>
              ) : (
                <div className="mt-4">
                  <div className="text-sm text-zinc-200">
                    Mora: <span className="font-semibold">{Intl.NumberFormat().format(result.moraTotal)}</span>
                  </div>

                  {result.exp?.expWasted > 0 && (
                    <div className="text-xs text-red-300 mt-1">
                      EXP wasted: {Intl.NumberFormat().format(result.exp.expWasted)}
                    </div>
                  )}

                  {Object.keys(result.unknownAscension || {}).length > 0 && (
                    <div className="mt-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-3">
                      <div className="font-semibold text-red-200">Unknown data detected</div>
                      <div className="text-xs text-red-200/80 mt-1">
                        Some ascension rows contain “unknown”. You can still use the plan, but verify those materials.
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <div className="text-sm text-zinc-400 mb-2">Resources</div>
                    <div className="max-h-[420px] overflow-auto pr-1">
                      <table className="w-full">
                        <tbody>
                          {Object.entries(result.resourcesOut)
                            .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
                            .map(([id, amount]) => (
                              <tr key={id} className="border-b border-white/10">
                                <td className="py-2 text-right pr-3 tabular-nums">
                                  {Intl.NumberFormat().format(amount)}
                                </td>
                                <td className="py-2">
                                  <span className="inline-flex items-center gap-2">
                                    <img
                                      className="w-6 h-6 object-contain"
                                      src={`/images/items/${id}.png`}
                                      alt=""
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                    <span className="text-zinc-200 font-medium">{itemList[id]?.name ?? id}</span>
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    <Link to="/todo" className="inline-block mt-4 text-zinc-300 hover:text-white">
                      Go to Todo →
                    </Link>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
