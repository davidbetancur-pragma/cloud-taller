import { Post } from '../../../features/posts/post.model';

/** Shape returned by the public JSONPlaceholder API. */
export interface RawJsonPlaceholderPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

/**
 * Adapter: translates the external API response shape into the app's
 * internal Post model, so the rest of the app never depends on the
 * third-party API's naming/structure.
 */
export function adaptPost(raw: RawJsonPlaceholderPost): Post {
  return {
    id: raw.id,
    authorId: raw.userId,
    title: raw.title,
    summary: raw.body,
  };
}

export function adaptPosts(raw: RawJsonPlaceholderPost[]): Post[] {
  return raw.map(adaptPost);
}
