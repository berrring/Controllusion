import assert from 'node:assert/strict';
import test from 'node:test';

import {
  normalizeListResponse,
  normalizeUserRecord,
  pickFirstDefined,
  unwrapApiData,
} from './normalizers.js';

test('unwrapApiData unwraps single-key data payloads', () => {
  assert.deepEqual(unwrapApiData({ data: { id: 1 } }), { id: 1 });
});

test('unwrapApiData leaves multi-key payloads and primitives untouched', () => {
  assert.deepEqual(unwrapApiData({ data: { id: 1 }, meta: { total: 1 } }), {
    data: { id: 1 },
    meta: { total: 1 },
  });
  assert.equal(unwrapApiData(null), null);
});

test('pickFirstDefined returns the first non-nullish value', () => {
  assert.equal(pickFirstDefined(undefined, null, 0, 'fallback'), 0);
});

test('normalizeUserRecord finds known user containers', () => {
  assert.deepEqual(normalizeUserRecord({ data: { profile: { id: 7 } } }), { id: 7 });
});

test('normalizeUserRecord returns null for empty payloads', () => {
  assert.equal(normalizeUserRecord(null), null);
});

test('normalizeListResponse supports arrays, named keys, and common containers', () => {
  assert.deepEqual(normalizeListResponse([{ id: 1 }], 'customers'), [{ id: 1 }]);
  assert.deepEqual(normalizeListResponse({ customers: [{ id: 2 }] }, 'customers'), [{ id: 2 }]);
  assert.deepEqual(normalizeListResponse({ items: [{ id: 3 }] }, 'customers'), [{ id: 3 }]);
  assert.deepEqual(normalizeListResponse({ content: [{ id: 4 }] }, 'customers'), [{ id: 4 }]);
});

test('normalizeListResponse returns an empty list when no list is present', () => {
  assert.deepEqual(normalizeListResponse({ total: 0 }, 'customers'), []);
});
