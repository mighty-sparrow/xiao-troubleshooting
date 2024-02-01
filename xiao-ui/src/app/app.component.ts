import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { CommonHeaderComponent } from './components/common-header/common.header.component';
import { CommonFooterComponent } from './components/common-footer/common.footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    RouterModule,
    NavigationComponent,
    CommonHeaderComponent,
    CommonFooterComponent,
  ],
})
export class AppComponent {
  title = 'DIY WiFi HiFi Client';
  navbarCollapsed = true;
}
