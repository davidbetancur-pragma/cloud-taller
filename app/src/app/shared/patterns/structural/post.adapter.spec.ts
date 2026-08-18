import { describe, expect, it } from 'vitest';
import { adaptPost, adaptPosts, RawSourcePost } from './post.adapter';

const rawPost: RawSourcePost = {
  id: 1,
  userId: 7,
  title: 'Hello world',
  body: 'Post body content',
};

describe('post.adapter', () => {
  describe('adaptPost', () => {
    it('should map the source fields to the internal Post model', () => {
      const post = adaptPost(rawPost);

      expect(post).toEqual({
        id: 1,
        authorId: 7,
        title: 'Hello world',
        summary: 'Post body content',
      });
    });
  });

  describe('adaptPosts', () => {
    it('should map a list of raw posts preserving order', () => {
      const posts = adaptPosts([rawPost, { ...rawPost, id: 2, title: 'Second' }]);

      expect(posts.map((post) => post.id)).toEqual([1, 2]);
      expect(posts[1].title).toBe('Second');
    });

    it('should return an empty array when given no posts', () => {
      expect(adaptPosts([])).toEqual([]);
    });
  });
});
