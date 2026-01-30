
export function getFarmableToday(characters, day) {
  const result = new Map();

  for (const character of Object.values(characters)) {
    const isTraveler = character.id.startsWith('traveler');

    if (!isTraveler) {
      const book = character.material.book[0];
      if (!book?.day?.includes(day)) continue;

      if (!result.has(book.id)) {
        result.set(book.id, {
          material: book,
          characters: [],
        });
      }

      result.get(book.id).characters.push(character);
    } else {
      // traveler uses multiple talent books
      for (let i = 1; i <= 3; i++) {
        const book = character.material.book[i];
        if (!book?.day?.includes(day)) continue;

        const key = book.parent;

        if (!result.has(key)) {
          result.set(key, {
            material: book,
            characters: [],
          });
        }

        result.get(key).characters.push(character);
      }
    }
  }

  return [...result.values()];
}
