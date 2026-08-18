import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { NotificationBus } from '../../shared/patterns/behavioral/notification-bus';
import { PostsApiService } from './posts-api.service';

function setup(getImpl: ReturnType<typeof vi.fn>) {
  TestBed.configureTestingModule({
    providers: [
      PostsApiService,
      NotificationBus,
      { provide: HttpClient, useValue: { get: getImpl } },
    ],
  });
  return {
    service: TestBed.inject(PostsApiService),
    notificationBus: TestBed.inject(NotificationBus),
  };
}

describe('PostsApiService', () => {
  it('should adapt raw API posts into the internal Post model', () => {
    const get = vi.fn().mockReturnValue(of([{ id: 1, userId: 2, title: 'Hello', body: 'World' }]));
    const { service } = setup(get);
    let received: unknown;

    service.list(5).subscribe((posts) => (received = posts));

    expect(received).toEqual([{ id: 1, authorId: 2, title: 'Hello', summary: 'World' }]);
  });

  it('should request posts sorted by id descending with the given limit', () => {
    const get = vi.fn().mockReturnValue(of([]));
    const { service } = setup(get);

    service.list(5).subscribe();

    expect(get).toHaveBeenCalledWith(expect.stringContaining('/posts'), {
      params: { _limit: '5', _sort: 'id', _order: 'desc' },
    });
  });

  it('should publish an error notification when the request fails', () => {
    const get = vi.fn().mockReturnValue(throwError(() => new Error('network error')));
    const { service, notificationBus } = setup(get);
    const listener = vi.fn();
    notificationBus.subscribe(listener);

    service.list().subscribe({ error: () => {} });

    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ kind: 'error' }));
  });
});
