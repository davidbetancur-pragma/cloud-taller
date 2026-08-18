import { Post } from '../../../features/posts/post.model';

/**
 * Strategy: interchangeable sorting algorithms for the posts list.
 * The consumer picks a strategy at runtime without changing its own code.
 */
export interface SortStrategy {
  readonly label: string;
  sort(posts: readonly Post[]): Post[];
}

export class SortByTitleStrategy implements SortStrategy {
  readonly label = 'Title (A-Z)';

  sort(posts: readonly Post[]): Post[] {
    return [...posts].sort((a, b) => a.title.localeCompare(b.title));
  }
}

export class SortByIdStrategy implements SortStrategy {
  readonly label = 'Newest first';

  sort(posts: readonly Post[]): Post[] {
    return [...posts].sort((a, b) => b.id - a.id);
  }
}
