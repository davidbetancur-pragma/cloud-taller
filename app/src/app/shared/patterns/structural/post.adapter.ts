import { Post } from '../../../features/posts/post.model';

/** Shape stored in the content source (mirrors a typical REST API response). */
export interface RawSourcePost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

/**
 * Adapter: translates the content source's response shape into the app's
 * internal Post model, so the rest of the app never depends on the
 * source's naming/structure.
 */
export function adaptPost(raw: RawSourcePost): Post {
  return {
    id: raw.id,
    authorId: raw.userId,
    title: raw.title,
    summary: raw.body,
  };
}

export function adaptPosts(raw: RawSourcePost[]): Post[] {
  return raw.map(adaptPost);
}
