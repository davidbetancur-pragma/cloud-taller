/**
 * Builder: assembles the query parameters for a paginated/sorted list request
 * step by step, instead of passing a large untyped options object around.
 */
export class HttpQueryBuilder {
  private readonly params = new Map<string, string>();

  withLimit(limit: number): this {
    this.params.set('_limit', String(limit));
    return this;
  }

  withSort(field: string, order: 'asc' | 'desc' = 'asc'): this {
    this.params.set('_sort', field);
    this.params.set('_order', order);
    return this;
  }

  withUserId(userId: number): this {
    this.params.set('userId', String(userId));
    return this;
  }

  build(): Record<string, string> {
    return Object.fromEntries(this.params);
  }
}
