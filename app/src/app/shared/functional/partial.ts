/**
 * Partial Application: fixes some leading arguments of a function and
 * returns a new function expecting the rest. Unlike currying, the
 * remaining arguments are still applied together, not one at a time.
 */
export function partial<A, B, C, R>(fn: (a: A, b: B, c: C) => R, a: A): (b: B, c: C) => R {
  return (b: B, c: C) => fn(a, b, c);
}

export function fieldContains<T, K extends keyof T>(field: K, term: string, item: T): boolean {
  return String(item[field]).toLowerCase().includes(term.toLowerCase());
}

/**
 * Fixes the "title" field on fieldContains, leaving the search term and
 * item as pending arguments to be supplied later (e.g. as the user types).
 */
export function containsInTitle<T extends { title: string }>(): (term: string, item: T) => boolean {
  return partial(fieldContains<T, 'title'>, 'title');
}
