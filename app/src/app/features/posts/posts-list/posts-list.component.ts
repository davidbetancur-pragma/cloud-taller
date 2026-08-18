import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { truncate } from '../../../shared/functional/curry';
import { containsInTitle } from '../../../shared/functional/partial';
import {
  composeTransducers,
  filtering,
  mapping,
  transduce,
} from '../../../shared/functional/transducers';
import { NotificationBus } from '../../../shared/patterns/behavioral/notification-bus';
import {
  SortByIdStrategy,
  SortByTitleStrategy,
  SortStrategy,
} from '../../../shared/patterns/behavioral/sort-strategy';
import { Post } from '../post.model';
import { PostsApiService } from '../posts-api.service';

const truncateSummary = truncate(120);
const titleMatches = containsInTitle<Post>();

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsListComponent {
  private readonly postsApi = inject(PostsApiService);
  private readonly notificationBus = inject(NotificationBus);
  private readonly destroyRef = inject(DestroyRef);

  private readonly sortStrategies: readonly SortStrategy[] = [
    new SortByIdStrategy(),
    new SortByTitleStrategy(),
  ];

  readonly posts = signal<Post[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly searchTerm = signal('');
  readonly activeSortIndex = signal(0);

  constructor() {
    const unsubscribe = this.notificationBus.subscribe((event) => {
      if (event.kind === 'error') {
        this.errorMessage.set(event.message);
      }
    });
    this.destroyRef.onDestroy(unsubscribe);

    this.loadPosts();
  }

  get activeSortLabel(): string {
    return this.sortStrategies[this.activeSortIndex()].label;
  }

  get visiblePosts(): Post[] {
    const sorted = this.sortStrategies[this.activeSortIndex()].sort(this.posts());
    const term = this.searchTerm().trim();

    if (!term) {
      return sorted;
    }

    // Single-pass filter + summary truncation via transducers.
    const pipeline = composeTransducers(
      filtering((post: Post) => titleMatches(term, post)),
      mapping((post: Post) => ({ ...post, summary: truncateSummary(post.summary) })),
    );
    return transduce(pipeline, sorted);
  }

  cycleSort(): void {
    this.activeSortIndex.set((this.activeSortIndex() + 1) % this.sortStrategies.length);
  }

  loadPosts(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.postsApi.list().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
