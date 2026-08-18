/**
 * Currying: turns a 2-argument function into a chain of unary functions,
 * so a reusable formatter can be built once (`formatWith(locale)`) and
 * applied to many values later.
 */
export function curry2<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R {
  return (a: A) => (b: B) => fn(a, b);
}

export const formatCurrency = curry2((locale: string, value: number): string =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(value),
);

/** Curried so the UI can build reusable truncators, e.g. `truncate(80)`. */
export const truncate = curry2((maxLength: number, text: string): string =>
  text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text,
);
