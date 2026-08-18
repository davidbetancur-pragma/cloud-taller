import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'posts',
    loadChildren: () => import('./features/posts/posts.routes').then((m) => m.POSTS_ROUTES),
  },
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
];
