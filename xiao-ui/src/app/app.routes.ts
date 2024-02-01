import { Routes } from '@angular/router';

import { HomePageComponent } from './pages/home/home.page';
import { RecordingsListComponent } from './pages/audio-capture/recordings-list.page';
import { RecordingPageComponent } from './pages/audio-capture/recording.page';

export const ROUTES: Routes = [
  { path: '', component: HomePageComponent, title: 'Home' },
  {
    path: 'record',
    component: RecordingPageComponent,
    title: 'Recording Page',
  },
  {
    path: 'records',
    component: RecordingsListComponent,
    title: 'Manage Recordings',
  },
  { path: '**', redirectTo: 'home' },
];
