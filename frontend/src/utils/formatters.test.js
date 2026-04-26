import assert from 'node:assert/strict';
import test from 'node:test';

import { cx, formatCurrency, formatDate, formatNumber, getInitials } from './formatters.js';

test('formatCurrency formats numeric values as whole-dollar USD', () => {
  assert.equal(formatCurrency(12500), '$12,500');
  assert.equal(formatCurrency(undefined), '$0');
});

test('formatNumber formats numeric values with US grouping', () => {
  assert.equal(formatNumber(1234567), '1,234,567');
  assert.equal(formatNumber(null), '0');
});

test('formatDate returns a fallback for empty values', () => {
  assert.equal(formatDate(''), 'Not available');
});

test('formatDate supports caller-provided Intl options', () => {
  assert.equal(
    formatDate('2026-04-26T00:00:00Z', { timeZone: 'UTC', month: 'long' }),
    'April 26, 2026',
  );
});

test('getInitials builds initials from the first two name parts', () => {
  assert.equal(getInitials('Jane Mary Cooper'), 'JM');
  assert.equal(getInitials('  alex   smith  '), 'AS');
  assert.equal(getInitials(), '');
});

test('cx joins truthy class names and skips falsey entries', () => {
  assert.equal(cx('btn', false && 'hidden', null, undefined, 'active'), 'btn active');
});
