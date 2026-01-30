const sheets = import.meta.glob('../data/characterData/*.json', { eager: true });

console.log(
  'Loaded characterData files:',
  Object.keys(sheets)
);


export function loadCharacterSheet(id) {
  const key = `../data/characterData/${id}.json`;
  const mod = sheets[key];
  return mod?.default ?? null;
}
