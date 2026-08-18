import { describe, expect, it } from 'vitest';
import { Post } from '../../../features/posts/post.model';
import { SortByIdStrategy, SortByTitleStrategy } from './sort-strategy';

const posts: Post[] = [
  { id: 1, authorId: 1, title: 'Banana', summary: '' },
  { id: 3, authorId: 1, title: 'Apple', summary: '' },
  { id: 2, authorId: 1, title: 'Cherry', summary: '' },
];

describe('SortByTitleStrategy', () => {
  it('should sort posts alphabetically by title', () => {
    const sorted = new SortByTitleStrategy().sort(posts);

    expect(sorted.map((post) => post.title)).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('should not mutate the original array', () => {
    const original = [...posts];

    new SortByTitleStrategy().sort(posts);

    expect(posts).toEqual(original);
  });
});

describe('SortByIdStrategy', () => {
  it('should sort posts by id descending (newest first)', () => {
    const sorted = new SortByIdStrategy().sort(posts);

    expect(sorted.map((post) => post.id)).toEqual([3, 2, 1]);
  });
});
