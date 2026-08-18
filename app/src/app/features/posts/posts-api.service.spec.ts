import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { NotificationBus } from '../../shared/patterns/behavioral/notification-bus';
import { PostsApiService } from './posts-api.service';
import { POSTS_SOURCE } from './posts.data';

function setup() {
  TestBed.configureTestingModule({
    providers: [PostsApiService, NotificationBus],
  });
  return { service: TestBed.inject(PostsApiService) };
}

describe('PostsApiService', () => {
  it('should adapt the local posts into the internal Post model', async () => {
    const { service } = setup();

    const posts = await firstValueFrom(service.list(POSTS_SOURCE.length));

    expect(posts[0]).toEqual({
      id: expect.any(Number),
      authorId: expect.any(Number),
      title: expect.any(String),
      summary: expect.any(String),
    });
  });

  it('should return posts sorted by id descending', async () => {
    const { service } = setup();

    const posts = await firstValueFrom(service.list(POSTS_SOURCE.length));

    const ids = posts.map((post) => post.id);
    expect(ids).toEqual([...ids].sort((a, b) => b - a));
  });

  it('should limit the results to the requested amount', async () => {
    const { service } = setup();

    const posts = await firstValueFrom(service.list(3));

    expect(posts).toHaveLength(3);
  });
});
