import './TopMenu.css';
import { View } from '../View';

/**
 * Sub View for TopNavigationView. Contains content navigation
 * buttons.
 */
class ContentNavView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  /**
   * Highlights specified navigation button.
   * @param {HTMLButtonElement} button
   */
  highlight(button) {
    this.#buttons.forEach(btn => btn.classList.remove('nav-btn-active'));
    button.classList.add('nav-btn-active');
  }

  /** View events */
  on = {
    /** @param {(e: Event) => void} listener */
    talkedClicked: listener => this.delegate('click', listener, this.talked),

    /** @param {(e: Event) => void} listener */
    latestClicked: listener => this.delegate('click', listener, this.latest),

    /** @param {(e: Event) => void} listener */
    likedClicked: listener => this.delegate('click', listener, this.liked),
  };

  #buttons = [];
  #build() {
    this.root = document.getElementById('content-nav');
    this.talked = document.getElementById('nav-talked');
    this.latest = document.getElementById('nav-latest');
    this.liked = document.getElementById('nav-liked');
    this.#buttons = [this.talked, this.latest, this.liked];
    this.#buttons.forEach(btn => {
      btn.addEventListener('click', () => this.highlight(btn));
    });
  }
}

/**
 * View of the top menu. Contains UI elements for content
 * browsing and search/menu buttons.
 */
export class TopMenuView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  /** View events */
  on = {
    /** @param {(e: Event) => void} listener */
    userMenuClicked: listener => this.delegate('click', listener, this.userMenu),

    /** @param {(e: Event) => void} listener */
    searchClicked: listener => this.delegate('click', listener, this.search),
  };

  #build() {
    this.root = document.getElementById('nav-panel');
    this.contentNav = new ContentNavView(this.root);
    this.search = document.getElementById('search-btn');
    this.userMenu = document.getElementById('menu-btn');
  }
}
