import { inject, Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoggerFactory } from '../../shared/patterns/creational/logger-factory';
import { HttpQueryBuilder } from '../../shared/patterns/creational/http-query-builder';
import { adaptPosts } from '../../shared/patterns/structural/post.adapter';
import { withLogging } from '../../shared/patterns/structural/with-logging.decorator';
import { NotificationBus } from '../../shared/patterns/behavioral/notification-bus';
import { Post } from './post.model';
import { POSTS_SOURCE } from './posts.data';

@Injectable({ providedIn: 'root' })
export class PostsApiService {
  private readonly notificationBus = inject(NotificationBus);
  private readonly logger = LoggerFactory.create(environment.enableRequestLogging);

  private readonly fetchPosts = withLogging(
    (limit: number) => this.requestPosts(limit),
    this.logger,
    'GET /posts',
  );

  list(limit = 20): Observable<Post[]> {
    return this.fetchPosts(limit).pipe(
      catchError((error) => {
        this.notificationBus.publish({
          kind: 'error',
          message: 'No se pudieron cargar los posts. Intenta de nuevo.',
        });
        return throwError(() => error);
      }),
    );
  }

  private requestPosts(limit: number): Observable<Post[]> {
    const { _limit, _order } = new HttpQueryBuilder().withLimit(limit).withSort('id', 'desc').build();

    const sorted = [...POSTS_SOURCE].sort((a, b) =>
      _order === 'desc' ? b.id - a.id : a.id - b.id,
    );
    const page = sorted.slice(0, Number(_limit));

    // delay() simulates the latency of a real network call.
    return of(page).pipe(delay(200), map(adaptPosts));
  }
}
