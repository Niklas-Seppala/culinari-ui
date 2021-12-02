import './TopMenu.css';
import { View } from '../View';

class ContentNavView extends View {
  on = {
    talkedClicked: listener => this.#buttons[0][1].push(listener),
    latestClicked: listener => this.#buttons[1][1].push(listener),
    likedClicked: listener => this.#buttons[2][1].push(listener),
  };

  dom = {
    parent: undefined,
    root: undefined,
    talked: undefined,
    latest: undefined,
    liked: undefined,
  };

  #buttons = [];
  #bind() {
    this.dom.root = document.getElementById('content-nav');
    this.dom.talked = document.getElementById('nav-talked');
    this.dom.latest = document.getElementById('nav-latest');
    this.dom.liked = document.getElementById('nav-liked');
    this.#buttons = [
      [this.dom.talked, []],
      [this.dom.latest, []],
      [this.dom.liked, []],
    ];

    this.#buttons.forEach(btn => {
      const [button, listeners] = btn;
      button.addEventListener('click', e => {
        this.highlight(button);
        listeners.forEach(listener => listener(e));
      });
    });
  }

  constructor(parent) {
    super();
    this.dom.parent = View.genericParent(parent);
    this.#bind();
  }

  highlight(btn) {
    this.#buttons.forEach(button =>
      button[0].classList.remove('nav-btn-active')
    );
    btn.classList.add('nav-btn-active');
  }
}

export class TopMenuView extends View {
  dom = {
    parent: undefined,
    root: undefined,
    contentNav: undefined,
    search: undefined,
    userMenu: undefined,
  };

  #menuListeners = [];
  #searchListeners = [];
  on = {
    userMenuClicked: listener => this.#menuListeners.push(listener),
    searchClicked: listener => this.#searchListeners.push(listener),
  };

  #bind() {
    this.dom.root = document.getElementById('nav-panel');
    this.dom.contentNav = new ContentNavView(this.dom.root);
    this.dom.search = document.getElementById('search-btn');
    this.dom.search.addEventListener('click', e =>
      this.#searchListeners.forEach(listener => listener(e))
    );
    this.dom.userMenu = document.getElementById('menu-btn');
    this.dom.userMenu.addEventListener('click', e =>
      this.#menuListeners.forEach(listener => listener(e))
    );
  }

  constructor(parent) {
    super();
    this.dom.parent = View.genericParent(parent);
    this.#bind();
  }
}
