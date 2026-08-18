import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { NotificationBus } from '../../../shared/patterns/behavioral/notification-bus';
import { Post } from '../post.model';
import { PostsApiService } from '../posts-api.service';
import { PostsListComponent } from './posts-list.component';

const posts: Post[] = [
  { id: 1, authorId: 1, title: 'Banana bread', summary: 'a'.repeat(200) },
  { id: 2, authorId: 1, title: 'Apple pie', summary: 'short' },
];

function setup(list = vi.fn().mockReturnValue(of(posts))) {
  TestBed.configureTestingModule({
    providers: [{ provide: PostsApiService, useValue: { list } }, NotificationBus],
  });
  const fixture = TestBed.createComponent(PostsListComponent);
  fixture.detectChanges();
  return {
    component: fixture.componentInstance,
    list,
    notificationBus: TestBed.inject(NotificationBus),
  };
}

describe('PostsListComponent', () => {
  it('should load posts on init and expose them sorted by id descending by default', () => {
    const { component } = setup();

    expect(component.visiblePosts.map((post) => post.id)).toEqual([2, 1]);
  });

  it('should cycle to sorting by title when cycleSort is called', () => {
    const { component } = setup();

    component.cycleSort();

    expect(component.visiblePosts.map((post) => post.title)).toEqual(['Apple pie', 'Banana bread']);
  });

  it('should filter visible posts by the search term', () => {
    const { component } = setup();

    component.searchTerm.set('apple');

    expect(component.visiblePosts.map((post) => post.title)).toEqual(['Apple pie']);
  });

  it('should truncate long summaries only for the filtered results', () => {
    const { component } = setup();

    component.searchTerm.set('banana');

    expect(component.visiblePosts[0].summary.endsWith('…')).toBe(true);
  });

  it('should stop the loading state when the posts request fails', () => {
    const { component } = setup(vi.fn().mockReturnValue(throwError(() => new Error('boom'))));

    expect(component.loading()).toBe(false);
  });

  it('should surface an error message published on the shared NotificationBus', () => {
    const { component, notificationBus } = setup();

    notificationBus.publish({ kind: 'error', message: 'No se pudieron cargar los posts.' });

    expect(component.errorMessage()).toBe('No se pudieron cargar los posts.');
  });
});
