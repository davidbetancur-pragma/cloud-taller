import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoggerFactory } from '../../shared/patterns/creational/logger-factory';
import { HttpQueryBuilder } from '../../shared/patterns/creational/http-query-builder';
import { adaptPosts, RawJsonPlaceholderPost } from '../../shared/patterns/structural/post.adapter';
import { withLogging } from '../../shared/patterns/structural/with-logging.decorator';
import { NotificationBus } from '../../shared/patterns/behavioral/notification-bus';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsApiService {
  private readonly http = inject(HttpClient);
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
    const params = new HttpQueryBuilder().withLimit(limit).withSort('id', 'desc').build();

    return this.http
      .get<RawJsonPlaceholderPost[]>(`${environment.apiBaseUrl}/posts`, { params })
      .pipe(map(adaptPosts));
  }
}
