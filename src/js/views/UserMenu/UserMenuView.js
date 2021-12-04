import './UserMenuView.css';
import { LoggedMenuView } from './LoggedMenuView';
import { AnonymousMenuView } from './AnonymousManuView';
import { View } from '../View';

export class UserMenuView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  get profile() {
    return this.logged.profile;
  }

  #build() {
    this.root = document.getElementById('user-menu-view');
    this.anonymous = new AnonymousMenuView(this);
    this.logged = new LoggedMenuView(this);
  }
}
