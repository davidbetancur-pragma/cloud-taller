/**
 * Transducers: composable map/filter steps that run in a single pass over
 * the data, instead of `items.map(...).filter(...)` which allocates one
 * intermediate array per step.
 */
export type Reducer<Acc, T> = (acc: Acc, item: T) => Acc;
export type Transducer<A, B> = <Acc>(reducer: Reducer<Acc, B>) => Reducer<Acc, A>;

export function mapping<A, B>(fn: (item: A) => B): Transducer<A, B> {
  return (reducer) => (acc, item) => reducer(acc, fn(item));
}

export function filtering<A>(predicate: (item: A) => boolean): Transducer<A, A> {
  return (reducer) => (acc, item) => (predicate(item) ? reducer(acc, item) : acc);
}

export function composeTransducers<A, B, C>(
  first: Transducer<A, B>,
  second: Transducer<B, C>,
): Transducer<A, C> {
  return (reducer) => first(second(reducer));
}

export function pushReducer<T>(acc: T[], item: T): T[] {
  acc.push(item);
  return acc;
}

export function transduce<A, B>(transducer: Transducer<A, B>, items: readonly A[]): B[] {
  const combinedReducer = transducer<B[]>((acc, item) => pushReducer(acc, item));
  return items.reduce(combinedReducer, [] as B[]);
}
