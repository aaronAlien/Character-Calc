import test from 'node:test';
import assert from 'node:assert/strict';

import { getFarmableToday } from './../src/logic/farmable/getFarmableToday.js';

test('groups characters by talent book available today', () => {
  const mockCharacters = {
    aino: {
      id: 'aino',
      material: {
        book: [
          {
            id: 'teachings_of_freedom',
            day: ['monday', 'thursday'],
          },
        ],
      },
    },
    amber: {
      id: 'amber',
      material: {
        book: [
          {
            id: 'teachings_of_freedom',
            day: ['monday', 'thursday'],
          },
        ],
      },
    },
    lisa: {
      id: 'lisa',
      material: {
        book: [
          {
            id: 'teachings_of_ballad',
            day: ['wednesday'],
          },
        ],
      },
    },
  };

  const result = getFarmableToday(mockCharacters, 'monday');

  assert.equal(result.length, 1);
  assert.equal(result[0].material.id, 'teachings_of_freedom');
  assert.deepEqual(result[0].characters.sort(), ['aino', 'amber']);
});

// TRAVELLER TEST

test('traveler contributes to multiple talent books', () => {
  const mockCharacters = {
    traveler_anemo: {
      id: 'traveler_anemo',
      material: {
        book: [
          null,
          { id: 'teachings_of_freedom', parent: 'teachings_of_freedom', day: ['monday'] },
          { id: 'teachings_of_resistance', parent: 'teachings_of_resistance', day: ['monday'] },
          { id: 'teachings_of_ballad', parent: 'teachings_of_ballad', day: ['monday'] },
        ],
      },
    },
  };

  const result = getFarmableToday(mockCharacters, 'monday');

  assert.equal(result.length, 3);
});

