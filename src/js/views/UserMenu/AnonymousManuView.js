import './UserMenuView.css';
import { View } from '../View';

/**
 * Menu view for anonymous user.
 */
export class AnonymousMenuView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  on = {
    /** @param {(e: Event) => void} listener */
    aboutClicked: listener => this.delegate('click', listener, this.about),

    /** @param {(e: Event) => void} listener */
    registerClicked: listener => this.delegate('click', listener, this.register),

    /** @param {(e: Event) => void} listener */
    loginClicked: listener => this.delegate('click', listener, this.login),
  };

  #build() {
    this.root = document.getElementById('anon-menu');
    this.register = document.getElementById('register-btn');
    this.login = document.getElementById('login-btn');
    this.about = document.getElementById('about-btn');
  }
}
