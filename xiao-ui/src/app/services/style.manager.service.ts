import { Inject, Injectable } from '@angular/core';
import { AppState } from '../shared/app.state.interface';
import { DOCUMENT } from '@angular/common';

const KEY = 'APP_STATE';
export const ThemeNames = [
  { key: 'theme1', value: 'Default' },
  { key: 'theme2', value: 'Theme 2' },
  { key: 'theme3', value: 'Theme 3' },
  { key: 'theme4', value: 'Theme 4' },
];

@Injectable({ providedIn: 'platform' })
export class StyleManager {
  state = this.getAppState();

  constructor(@Inject(DOCUMENT) private _document: Document) {
    // this.toggleTheme(this.state.darkTheme);
  }

  ensureClassName(value = this.state.theme, dark: boolean) {
    return value + (dark ? '-dark' : '');
  }

  ensureStateValues(value: string, dark: boolean) {
    let oldClassName = this.ensureClassName(
      this.state.theme,
      this.state.darkTheme
    );
    let newClassName = this.ensureClassName(value, dark);
    return { old: oldClassName, new: newClassName };
  }

  outWithTheOld(value: string) {
    this._document.body.classList.remove(value);
    this.removeStyleLink(value);

    if (this._document.body.classList.contains('dark')) {
      this._document.body.classList.remove('dark');
    }
  }

  inWithTheNew(value: string, isDark: boolean = false) {
    if (value != 'theme1') {
      const href = value + '.css';
      this.getLinkElementForKey(value).setAttribute('href', href);
      this._document.body.classList.add(value);
    }
    if (isDark) {
      this._document.body.classList.add('dark');
    }
  }

  /**
   *
   * @param value Change from
   * @param dark
   */
  switchTheme(value = ThemeNames[0].key, dark = this.state.darkTheme) {
    let values = this.ensureStateValues(value, dark);

    this.state.theme = value;
    this.state.darkTheme = dark;

    this.setAppState(this.state);

    this.outWithTheOld(values.old);
    this.inWithTheNew(values.new, dark);
  }
  /** Gets the current appearance state of the dev app. */
  getAppState(): AppState {
    let value: AppState | null = null;

    // Needs a try/catch since some browsers throw an error when accessing in incognito.
    try {
      const storageValue = localStorage.getItem(KEY);

      if (storageValue) {
        value = JSON.parse(storageValue);
      }
    } catch {}

    if (!value) {
      value = {
        density: 0,
        animations: true,
        darkTheme: false,
        theme: ThemeNames[0].key,
        rippleDisabled: false,
        strongFocusEnabled: false,
        m3Enabled: false,
      };

      this.saveToStorage(value);
    }

    return value;
  }

  setAppState(newState: AppState): void {
    const currentState = this.getAppState();
    const keys = Object.keys(currentState) as (keyof AppState)[];

    // Only write to storage if something actually changed.
    for (const key of keys) {
      if (currentState[key] !== newState[key]) {
        this.saveToStorage(newState);
        break;
      }
    }
  }

  saveToStorage(value: AppState): void {
    // Needs a try/catch since some browsers throw an error when accessing in incognito.
    try {
      localStorage.setItem(KEY, JSON.stringify(value));
    } catch {}
  }

  removeStyleLink(key: string) {
    const existingLinkElement = this.getExistingLinkElementByKey(key);
    if (existingLinkElement) {
      this._document.head.removeChild(existingLinkElement);
    }
  }

  getLinkElementForKey(key: string) {
    return (
      this.getExistingLinkElementByKey(key) ||
      this.createLinkElementWithKey(key)
    );
  }

  getExistingLinkElementByKey(key: string) {
    return this._document.head.querySelector(
      `link[rel="stylesheet"].${this.getClassNameForKey(key)}`
    );
  }

  createLinkElementWithKey(key: string) {
    const linkEl = this._document.createElement('link');
    linkEl.setAttribute('rel', 'stylesheet');
    linkEl.classList.add(this.getClassNameForKey(key));
    this._document.head.appendChild(linkEl);
    return linkEl;
  }

  getClassNameForKey(key: string) {
    return `style-manager-${key}`;
  }
}
