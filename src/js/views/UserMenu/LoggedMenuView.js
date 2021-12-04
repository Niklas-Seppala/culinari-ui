import './UserMenuView.css';
import { View } from '../View';

/**
 * Sub view component for LoggedMenuView that
 * contains profile related data.
 */
class ProfileView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  /**
   * Renders current state in browser.
   * @param {any?} state optional new state.
   * @returns {this}
   */
  render(state) {
    if (state) this.state = state;
    if (this.state) {
      this.avatar.src = this.state.avatar;
      this.username.textContent = this.state.username;
      this.likes.textContent = this.state.likes;
      this.comments.textContent = this.state.comments;
      this.forks.textContent = this.state.forks;
    }
    return this;
  }

  #build() {
    this.root = document.getElementById('profile');
    this.avatar = document.getElementById('avatar');
    this.username = document.getElementById('profile-username');
    this.likes = document.getElementById('profile-likes');
    this.comments = document.getElementById('profile-comments');
    this.forks = document.getElementById('profile-forks');
  }
}

/**
 * Menu view for the logged user. Contains profile data
 * and navigation to logged user actions.
 */
export class LoggedMenuView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  /** View events */
  on = {
    /** @param {(e: Event) => void} listener */
    myRecipesClicked: listener => this.delegate('click', listener, this.myRecipes),

    /** @param {(e: Event) => void} listener */
    newRecipeClicked: listener => this.delegate('click', listener, this.newRecipe),

    /** @param {(e: Event) => void} listener */
    friendsClicked: listener => this.delegate('click', listener, this.friends),

    /** @param {(e: Event) => void} listener */
    logoutClicked: listener => this.delegate('click', listener, this.logout),
  };

  #build() {
    this.profile = new ProfileView(this);
    this.root = document.getElementById('user-menu');
    this.myRecipes = document.getElementById('my-recipes-btn');
    this.newRecipe = document.getElementById('new-recipe-btn');
    this.friends = document.getElementById('friends-btn');
    this.logout = document.getElementById('logout-btn');
  }
}
