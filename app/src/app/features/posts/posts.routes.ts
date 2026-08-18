import { Routes } from '@angular/router';

export const POSTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./posts-list/posts-list.component').then((m) => m.PostsListComponent),
  },
];
