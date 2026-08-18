import { describe, expect, it } from 'vitest';
import { composeTransducers, filtering, mapping, transduce } from './transducers';

describe('transduce', () => {
  it('should apply a single mapping transducer to every item', () => {
    const double = mapping((n: number) => n * 2);

    const result = transduce(double, [1, 2, 3]);

    expect(result).toEqual([2, 4, 6]);
  });

  it('should apply a single filtering transducer, dropping non-matching items', () => {
    const evensOnly = filtering((n: number) => n % 2 === 0);

    const result = transduce(evensOnly, [1, 2, 3, 4, 5]);

    expect(result).toEqual([2, 4]);
  });

  it('should compose filtering and mapping into a single pass over the data', () => {
    const evensOnly = filtering((n: number) => n % 2 === 0);
    const double = mapping((n: number) => n * 2);
    const pipeline = composeTransducers(evensOnly, double);

    const result = transduce(pipeline, [1, 2, 3, 4, 5]);

    expect(result).toEqual([4, 8]);
  });

  it('should match the result of chaining .filter().map() manually', () => {
    const evensOnly = filtering((n: number) => n % 2 === 0);
    const double = mapping((n: number) => n * 2);
    const pipeline = composeTransducers(evensOnly, double);
    const source = [1, 2, 3, 4, 5, 6];

    const transducerResult = transduce(pipeline, source);
    const chainedResult = source.filter((n) => n % 2 === 0).map((n) => n * 2);

    expect(transducerResult).toEqual(chainedResult);
  });
});
