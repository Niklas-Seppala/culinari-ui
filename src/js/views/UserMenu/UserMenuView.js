import './UserMenuView.css';
import { View } from '../View';

class AnonymousMenuView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  #aboutListeners = [];
  #registerListeners = [];
  #loginListeners = [];
  on = {
    aboutClicked: listener => this.#aboutListeners.push(listener),
    registerClicked: listener => this.#registerListeners.push(listener),
    loginClicked: listener => this.#loginListeners.push(listener),
  };

  #build() {
    this.root = document.getElementById('anon-menu');
    this.register = document.getElementById('register-btn');
    this.login = document.getElementById('login-btn');
    this.about = document.getElementById('about-btn');

    this.about.addEventListener('click', e => {
      this.#aboutListeners.forEach(listener => listener(e));
    });
    this.login.addEventListener('click', e => {
      this.#loginListeners.forEach(listener => listener(e));
    });
    this.register.addEventListener('click', e => {
      this.#registerListeners.forEach(listener => listener(e));
    });
  }
}

class ProfileView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

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

class LoggedMenuView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  #myRecipeHandlers = [];
  #newRecipeHandlers = [];
  #friendHandlers = [];
  #logoutHandlers = [];
  on = {
    myRecipesClicked: f => this.#myRecipeHandlers.push(f),
    newRecipeClicked: f => this.#newRecipeHandlers.push(f),
    friendsClicked: f => this.#friendHandlers.push(f),
    logoutClicked: f => this.#logoutHandlers.push(f),
  };

  #build() {
    this.profile = new ProfileView(this);
    this.root = document.getElementById('user-menu');
    this.myRecipes = document.getElementById('my-recipes-btn');
    this.newRecipe = document.getElementById('new-recipe-btn');
    this.friends = document.getElementById('friends-btn');
    this.logout = document.getElementById('logout-btn');

    this.friends.addEventListener('click', e =>
      this.#friendHandlers.forEach(f => f(e))
    );
    this.newRecipe.addEventListener('click', e =>
      this.#newRecipeHandlers.forEach(f => f(e))
    );
    this.myRecipes.addEventListener('click', e =>
      this.#myRecipeHandlers.forEach(f => f(e))
    );
    this.logout.addEventListener('click', e =>
      this.#logoutHandlers.forEach(f => f(e))
    );
  }
}

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
