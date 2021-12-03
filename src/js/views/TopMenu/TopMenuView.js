import './TopMenu.css';
import { View } from '../View';

class ContentNavView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  #buttons = [];
  on = {
    talkedClicked: listener => this.#buttons[0][1].push(listener),
    latestClicked: listener => this.#buttons[1][1].push(listener),
    likedClicked: listener => this.#buttons[2][1].push(listener),
  };

  #build() {
    this.root = document.getElementById('content-nav');
    this.talked = document.getElementById('nav-talked');
    this.latest = document.getElementById('nav-latest');
    this.liked = document.getElementById('nav-liked');
    this.#buttons = [
      [this.talked, []],
      [this.latest, []],
      [this.liked, []],
    ];

    this.#buttons.forEach(btn => {
      const [button, listeners] = btn;
      button.addEventListener('click', e => {
        this.highlight(button);
        listeners.forEach(listener => listener(e));
      });
    });
  }


  highlight(btn) {
    this.#buttons.forEach(button =>
      button[0].classList.remove('nav-btn-active')
    );
    btn.classList.add('nav-btn-active');
  }
}

export class TopMenuView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  #menuListeners = [];
  #searchListeners = [];
  on = {
    userMenuClicked: listener => this.#menuListeners.push(listener),
    searchClicked: listener => this.#searchListeners.push(listener),
  };

  #build() {
    this.root = document.getElementById('nav-panel');
    this.contentNav = new ContentNavView(this.root);
    this.search = document.getElementById('search-btn');
    this.search.addEventListener('click', e =>
      this.#searchListeners.forEach(listener => listener(e))
    );
    this.userMenu = document.getElementById('menu-btn');
    this.userMenu.addEventListener('click', e =>
      this.#menuListeners.forEach(listener => listener(e))
    );
  }
}
