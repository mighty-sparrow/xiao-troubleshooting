import { Component, Inject, OnInit } from "@angular/core";
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
  Routes,
} from "@angular/router";
import { CommonModule, DOCUMENT } from "@angular/common";

import { ROUTES } from "../../app.routes";
import { MatButtonModule } from "@angular/material/button";
import { MatCommonModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { StyleManager } from "../../services/style.manager.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ThemeNames } from "../../services/style.manager.service";
import { MatChipsModule } from "@angular/material/chips";

@Component({
  selector: "app-navigation",
  styleUrls: ["navigation.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatChipsModule,
    MatCommonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    RouterModule,
  ],
  templateUrl: "navigation.component.html",
})
export class NavigationComponent implements OnInit {
  routes: Routes = [];
  isHidden = false;
  isDark: boolean;
  themeName: string;
  themeNames: Array<{ key: string; value: string }>; // Used to iterate over keys in the HTML template.

  ngOnInit(): void {}

  constructor(private styleManager: StyleManager, public router: Router) {
    this.themeNames = ThemeNames;
    let state = this.styleManager.getAppState();
    this.styleManager.switchTheme(state.theme, state.darkTheme);
    this.themeName = state.theme;
    this.isDark = state.darkTheme;

    ROUTES.forEach((r) => {
      if (r.title != undefined && r.title.length > 0) {
        this.routes.push(r);
      }
    });

    router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.isHidden = evt.url !== "/";
      }
    });
  }

  switchTheme(newTheme: string) {
    this.themeName = newTheme;
    this.styleManager.switchTheme(this.themeName, this.isDark);
  }

  toggleDarkTheme() {
    this.isDark = !this.isDark;
    this.styleManager.switchTheme(this.themeName, this.isDark);
  }
}
