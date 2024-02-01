// Load `$localize` for examples using it.
import '@angular/localize/init';

import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app/app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  OverlayContainer,
  FullscreenOverlayContainer,
} from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { AppConfigService } from './app/services/config.service';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule.withConfig({
        disableAnimations: false,
      }),
      RouterModule.forRoot(ROUTES),
      HttpClientModule
    ),
    {
      provide: OverlayContainer,
      useClass: FullscreenOverlayContainer,
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => () =>
        appConfigService.init(),
    },
  ],
});
