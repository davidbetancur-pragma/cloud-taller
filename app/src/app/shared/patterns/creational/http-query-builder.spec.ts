import { describe, expect, it } from 'vitest';
import { HttpQueryBuilder } from './http-query-builder';

describe('HttpQueryBuilder', () => {
  it('should build an empty params object when nothing was configured', () => {
    const params = new HttpQueryBuilder().build();

    expect(params).toEqual({});
  });

  it('should combine limit, sort and userId into a single params object', () => {
    const params = new HttpQueryBuilder()
      .withLimit(10)
      .withSort('title', 'desc')
      .withUserId(3)
      .build();

    expect(params).toEqual({
      _limit: '10',
      _sort: 'title',
      _order: 'desc',
      userId: '3',
    });
  });

  it('should default sort order to ascending when not specified', () => {
    const params = new HttpQueryBuilder().withSort('id').build();

    expect(params['_order']).toBe('asc');
  });
});
