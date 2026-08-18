import { describe, expect, it } from 'vitest';
import { curry2, formatCurrency, truncate } from './curry';

describe('curry2', () => {
  it('should return a function after applying only the first argument', () => {
    const add = curry2((a: number, b: number) => a + b);

    const addFive = add(5);

    expect(typeof addFive).toBe('function');
  });

  it('should produce the same result as calling the original function directly', () => {
    const add = curry2((a: number, b: number) => a + b);

    expect(add(5)(3)).toBe(8);
  });

  it('should allow reusing the partially applied function for multiple values', () => {
    const add = curry2((a: number, b: number) => a + b);
    const addTen = add(10);

    expect(addTen(1)).toBe(11);
    expect(addTen(2)).toBe(12);
  });
});

describe('formatCurrency', () => {
  it('should format a number as USD currency for a given locale', () => {
    const formatUs = formatCurrency('en-US');

    expect(formatUs(1234.5)).toBe('$1,234.50');
  });
});

describe('truncate', () => {
  it('should leave short text untouched', () => {
    const truncateAt80 = truncate(80);

    expect(truncateAt80('short summary')).toBe('short summary');
  });

  it('should cut long text and append an ellipsis', () => {
    const truncateAt10 = truncate(10);

    expect(truncateAt10('this is a much longer summary')).toBe('this is a…');
  });

  it('should reuse the same truncator across multiple summaries', () => {
    const truncateAt5 = truncate(5);

    expect(truncateAt5('hello world')).toBe('hello…');
    expect(truncateAt5('hi')).toBe('hi');
  });
});
