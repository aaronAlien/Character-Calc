function n(val, fallback = 0) {
  const x = Number(val);
  return Number.isFinite(x) ? x : fallback;
}

function getMinAscensionFromLevel(level) {
  if (level > 80) return 6;
  if (level > 70) return 5;
  if (level > 60) return 4;
  if (level > 50) return 3;
  if (level > 40) return 2;
  if (level > 20) return 1;
  return 0;
}

function getMaxTalentLevelFromAscension(asc) {
  switch (asc) {
    case 6: return 10;
    case 5: return 8;
    case 4: return 6;
    case 3: return 4;
    case 2: return 2;
    default: return 1;
  }
}

/**
 * Matches the Svelte EXP optimizer.
 * values: [20000, 5000, 1000] etc for selected books.
 */
function calcExpPlan({ characterExp, currentLevel, currentExp, intendedLevel, resources }) {
  const values = resources
    .filter((r) => r.selected)
    .map((r) => n(r.value))
    .sort((a, b) => b - a);

  if (values.length === 0) {
    return { usage: [], expWasted: 0, targetExp: 0, levelingMora: 0, values };
  }

  const curLvl = n(currentLevel);
  const tgtLvl = n(intendedLevel);

  const targetExp =
    characterExp[tgtLvl - 1] - (characterExp[curLvl - 1] + n(currentExp));

  const target = Math.max(0, targetExp);

  // leveling mora rule from Svelte:
  // moraNeeded = (Math.floor(target / 1000) * 1000) / 5;
  const levelingMora = (Math.floor(target / 1000) * 1000) / 5;

  // Build candidate usages
  const items = values.map(() => 0);
  const max = [];

  // Candidate 1: all highest
  items[0] = Math.ceil(target / values[0]);
  max.push({ usage: [...items], over: target - items[0] * values[0] });

  // Candidate 2: a tweak using second
  items[0] = Math.ceil(target / values[0]);
  items[0] -= 1;
  items[1] = Math.ceil((target - items[0] * values[0]) / values[1]);
  max.push({
    usage: [...items],
    over: target - (items[0] * values[0] + items[1] * values[1]),
  });

  function process(usage, start) {
    let i = start;
    if (i === values.length - 1) return;

    while (usage[i] > 0) {
      usage[i]--;

      usage[i + 1] = 0;
      let currentTotal = usage.reduce((total, e, f) => total + e * values[f], 0);

      usage[i + 1] = Math.ceil((target - currentTotal) / values[i + 1]);

      currentTotal = usage.reduce((total, e, f) => total + e * values[f], 0);

      max.push({ usage: [...usage], over: target - currentTotal });

      if (usage[i] === 0) i++;
      if (i === values.length - 1) break;

      process([...usage], start + 1);
    }
  }

  process([...items], 1);

  // Svelte chooses: max.sort((a, b) => b.over - a.over)[0]
  // over is negative when you exceed required exp; best is closest to 0 (largest over).
  const best = max.sort((a, b) => b.over - a.over)[0];

  return {
    usage: best.usage,
    expWasted: best.over < 0 ? -best.over : 0, // wasted exp if overfilled
    targetExp: target,
    levelingMora,
    values,
  };
}

function mergeItems(target, add) {
  for (const [id, item] of Object.entries(add)) {
    if (!target[id]) target[id] = { ...item };
    else target[id].amount += item.amount;
  }
}

/**
 * Ascension material aggregation (same logic as Svelte calculateAscension()).
 */
function calcAscension({ character, currentAscension, intendedAscension }) {
  const current = Math.max(n(currentAscension), 0);
  const target = Math.max(n(intendedAscension), current);

  const unknown = {};
  const sum = {
    mora: 0,
    items: {},
  };

  const slice = character.ascension.slice(current, target);

  slice.forEach((phase, index) => {
    // Unknown handling (matches the warning behavior)
    if (phase.mora === 0) {
      unknown[index + current] = unknown[index + current] ?? [];
      unknown[index + current].push('Mora amount');
    }

    sum.mora += n(phase.mora);

    phase.items.forEach((it, i) => {
      const itemId = it.item?.id;

      if (itemId === 'unknown') {
        unknown[index + current] = unknown[index + current] ?? [];
        unknown[index + current].push(`${i + 1}${['st', 'nd', 'rd'][i] ?? 'th'} material`);
      }

      if (!sum.items[itemId]) {
        sum.items[itemId] = { ...it.item, amount: 0, order: i };
      }
      sum.items[itemId].amount += n(it.amount);
    });
  });

  return { mora: sum.mora, items: sum.items, unknown };
}

function isTravelerId(id) {
  return (
    id.startsWith('traveler_anemo') ||
    id.startsWith('traveler_geo') ||
    id.startsWith('traveler_electro') ||
    id.startsWith('traveler_dendro')
  );
}

/**
 * Talent aggregation (normal + traveler special case).
 * We ported both calculateTalent() + calculateTalentTraveler().
 */
function calcTalents({
  character,
  charactersMeta,
  talentCosts,
  itemList,
  currentTalentLevel,
  targetTalentLevel,
}) {
  const items = {};
  let mora = 0;

  const cur = currentTalentLevel;
  const tgt = targetTalentLevel;

  const talentKeys = ['first', 'second', 'third'];

  if (isTravelerId(character.id)) {
    // traveler version (index-based)
    for (const key of talentKeys) {
      for (let j = n(cur[key]) - 1; j < n(tgt[key]) - 1; j++) {
        const row = talentCosts[j];
        mora += n(row.mora);

        let currentBook = character.material.book[j];
        let currentMaterial = character.material.material[j];

        // Geo traveler first talent uses material_atk in original
        if (character.id === charactersMeta.traveler_geo?.id && key === 'first') {
          currentBook = character.material_atk.book[j];
          currentMaterial = character.material_atk.material[j];
        }

        const which = character.id === charactersMeta.traveler_geo?.id && key === 'first'
          ? 'material_atk'
          : 'material';

        // book
        items[currentBook.id] = items[currentBook.id] ?? { ...currentBook, amount: 0 };
        items[currentBook.id].amount += n(row.book.amount);

        // common material
        items[currentMaterial.id] = items[currentMaterial.id] ?? { ...currentMaterial, amount: 0 };
        items[currentMaterial.id].amount += n(row.commonMaterial.amount);

        // boss
        if (n(row.bossMaterial) > 0) {
          const boss = character[which].boss;
          items[boss.id] = items[boss.id] ?? { ...boss, amount: 0 };
          items[boss.id].amount += n(row.bossMaterial);
        }

        // crown
        if (n(row.eventMaterial) > 0) {
          const crown = itemList.crown_of_insight;
          items[crown.id] = items[crown.id] ?? { ...crown, amount: 0 };
          items[crown.id].amount += n(row.eventMaterial);
        }
      }
    }

    return { mora, items };
  }

  // normal version (rarity-based tiers)
  for (const key of talentKeys) {
    const start = n(cur[key]) - 1;
    const end = n(tgt[key]) - 1;

    talentCosts.slice(start, end).forEach((row) => {
      mora += n(row.mora);

      const book = character.material.book[row.book.rarity - 2];
      const mat = character.material.material[row.commonMaterial.rarity - 1];

      items[book.id] = items[book.id] ?? { ...book, amount: 0 };
      items[book.id].amount += n(row.book.amount);

      items[mat.id] = items[mat.id] ?? { ...mat, amount: 0 };
      items[mat.id].amount += n(row.commonMaterial.amount);

      if (n(row.bossMaterial) > 0) {
        const boss = character.material.boss;
        items[boss.id] = items[boss.id] ?? { ...boss, amount: 0 };
        items[boss.id].amount += n(row.bossMaterial);
      }

      if (n(row.eventMaterial) > 0) {
        const crown = itemList.crown_of_insight;
        items[crown.id] = items[crown.id] ?? { ...crown, amount: 0 };
        items[crown.id].amount += n(row.eventMaterial);
      }
    });
  }

  return { mora, items };
}

/**
 * Main entry: compute the complete plan used by UI + Todo.
 */
export function calculateCharacterPlan({
  selectedCharacter,
  withAscension,
  withTalent,
  currentLevel,
  currentExp,
  intendedLevel,
  currentAscension,
  intendedAscension,
  currentTalentLevel,
  targetTalentLevel,
  resources,
  data, // { characterExp, talentCosts, itemList, charactersMeta }
}) {
  const { characterExp, talentCosts, itemList, charactersMeta } = data;

  // EXP plan always
  const expPlan = calcExpPlan({
    characterExp,
    currentLevel,
    currentExp,
    intendedLevel,
    resources,
  });

  let moraTotal = expPlan.levelingMora;
  let unknownAscension = {};
  let materials = {};

  // Map exp usage back to resource IDs
  const selected = resources.filter((r) => r.selected).sort((a, b) => n(b.value) - n(a.value));
  const expBooks = {};
  selected.forEach((r, i) => {
    const qty = expPlan.usage[i] ?? 0;
    if (qty > 0) expBooks[r.id] = qty;
  });

  // Ascension + talent optional
  if (withAscension) {
    if (!selectedCharacter) {
      return {
        ok: false,
        error: 'No character selected.',
      };
    }

    const asc = calcAscension({
      character: selectedCharacter,
      currentAscension,
      intendedAscension,
    });

    unknownAscension = asc.unknown;
    moraTotal += asc.mora;
    materials = asc.items;

    if (withTalent) {
      const tal = calcTalents({
        character: selectedCharacter,
        charactersMeta,
        talentCosts,
        itemList,
        currentTalentLevel,
        targetTalentLevel,
      });

      moraTotal += tal.mora;
      mergeItems(materials, tal.items);
    }
  }

  // Convert to flat resources map for Todo (id -> amount)
  const resourcesOut = { mora: Math.round(moraTotal) };

  for (const [id, amt] of Object.entries(expBooks)) {
    resourcesOut[id] = (resourcesOut[id] ?? 0) + amt;
  }

  for (const [id, item] of Object.entries(materials)) {
    if (id === 'none' || id === 'unknown') continue;
    resourcesOut[id] = (resourcesOut[id] ?? 0) + n(item.amount);
  }

  const itemsDetailed = Object.entries(materials)
    .map(([id, item]) => ({ id, ...item }))
    .sort((a, b) => n(a.order) - n(b.order));

  return {
    ok: true,
    exp: {
      targetExp: expPlan.targetExp,
      expWasted: expPlan.expWasted,
      expBooks,
    },
    unknownAscension,
    moraTotal: Math.round(moraTotal),
    itemsDetailed,
    resourcesOut,
  };
}

export const calculatorHelpers = {
  getMinAscensionFromLevel,
  getMaxTalentLevelFromAscension,
};
