import { describe, expect, it } from 'vitest';
import { containsInTitle, fieldContains, partial } from './partial';

describe('partial', () => {
  it('should fix the first argument and leave the rest pending', () => {
    const greet = (greeting: string, name: string, punctuation: string) =>
      `${greeting}, ${name}${punctuation}`;

    const sayHelloTo = partial(greet, 'Hello');

    expect(sayHelloTo('Ada', '!')).toBe('Hello, Ada!');
  });
});

describe('containsInTitle', () => {
  const post = { title: 'Learning Well-Architected' };

  it('should match when the term appears in the title (case-insensitive)', () => {
    const matches = containsInTitle<typeof post>();

    expect(matches('well-architected', post)).toBe(true);
  });

  it('should not match when the term is absent from the title', () => {
    const matches = containsInTitle<typeof post>();

    expect(matches('cloudfront', post)).toBe(false);
  });

  it('should behave the same as calling fieldContains directly with "title"', () => {
    const matches = containsInTitle<typeof post>();

    expect(matches('learning', post)).toBe(fieldContains('title', 'learning', post));
  });
});
