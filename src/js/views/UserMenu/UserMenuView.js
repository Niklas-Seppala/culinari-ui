import './UserMenuView.css';
import { View } from '../View';

class AnonymousMenuView extends View {
  dom = {
    parent: undefined,
    root: document.getElementById('anon-menu'),
    register: document.getElementById('register-btn'),
    login: document.getElementById('login-btn'),
    about: document.getElementById('about-btn')
  };

  #aboutListeners = []
  #registerListeners = []
  #loginListeners = []
  on = {
    aboutClicked: listener => this.#aboutListeners.push(listener),
    registerClicked: listener => this.#registerListeners.push(listener),
    loginClicked: listener => this.#loginListeners.push(listener)
  }

  #bind() {
    this.dom.about.addEventListener('click', e => {
      this.#aboutListeners.forEach(listener => listener(e))
    })
    this.dom.login.addEventListener('click', e => {
      this.#loginListeners.forEach(listener => listener(e))
    })
    this.dom.register.addEventListener('click', e => {
      this.#registerListeners.forEach(listener => listener(e))
    })
  }

  constructor(parent) {
    super();
    this.dom.parent = View.genericParent(parent)
    this.#bind();
  }
}

class ProfileView extends View {
  dom = {
    parent: undefined,
    root: document.getElementById('profile'),
    avatar: document.getElementById('avatar'),
    username: document.getElementById('profile-username'),
    likes: document.getElementById('profile-likes'),
    comments: document.getElementById('profile-comments'),
    forks: document.getElementById('profile-forks'),
  }

  constructor(parent) {
    super();
    this.dom.parent = View.genericParent(parent)
  }

  #setState(state) {
    if (state) this.state = state;
    if (this.state) {
      this.dom.avatar.src = this.state.avatar
      this.dom.username.textContent = this.state.username;
      this.dom.likes.textContent = this.state.likes;
      this.dom.comments.textContent = this.state.comments;
      this.dom.forks.textContent = this.state.forks;
    }
  }

  render(state) {
    this.#setState(state);
    return this;
  }
}

class LoggedMenuView extends View {
  dom = {
    parent: undefined,
    root: document.getElementById('user-menu'),
    profile: undefined,
    myRecipes: document.getElementById('my-recipes-btn'),
    newRecipe: document.getElementById('new-recipe-btn'),
    friends: document.getElementById('friends-btn'),
    logout: document.getElementById('logout-btn'),
  }

  #myRecipeHandlers = []
  #newRecipeHandlers = []
  #friendHandlers = []
  #logoutHandlers = []
  on = {
    myRecipesClicked: f => this.#myRecipeHandlers.push(f),
    newRecipeClicked: f => this.#newRecipeHandlers.push(f),
    friendsClicked: f => this.#friendHandlers.push(f),
    logoutClicked: f => this.#logoutHandlers.push(f)
  }

  #bind() {
    this.dom.friends.addEventListener('click', e => this.#friendHandlers.forEach(f => f(e)))
    this.dom.newRecipe.addEventListener('click', e => this.#newRecipeHandlers.forEach(f => f(e)))
    this.dom.myRecipes.addEventListener('click', e => this.#myRecipeHandlers.forEach(f => f(e)))
    this.dom.logout.addEventListener('click', e => this.#logoutHandlers.forEach(f => f(e)))
  }

  constructor(parent) {
    super();
    this.dom.parent = View.genericParent(parent)
    this.dom.profile = new ProfileView(this)
    this.#bind();
  }
}

export class UserMenuView extends View {
  dom = {
    parent: undefined,
    root: document.getElementById('user-menu-view'),
    anonymous: undefined,
    logged: undefined
  }

  constructor(parent) {
    super();
    this.dom.parent = View.genericParent(parent);
    this.dom.anonymous = new AnonymousMenuView(this)
    this.dom.logged = new LoggedMenuView(this)
  }

  get profile() {
    return this.dom.logged.dom.profile
  }
}
