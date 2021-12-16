import { ContentNavView, TopMenuView } from '../views/TopMenu/TopMenuView';
import { FlashView } from '../views/Flash/FlashView';
import { LoadingView } from '../views/Loading/LoadingView';
import { css, View } from '../views/View';
import { SearchView } from '../views/Search/SearchView';
import { RecipePostView } from '../views/RecipePost/RecipePostView';
import { AboutView } from '../views/About/AboutVIew';
import api from './api';
import user from './user';

const handleRecipeLike = async (post, recipe) => {
  const USER = user.getUser();
  if (!USER) return;

  const response = await fetch(
    api.ROUTES.RECIPE.LIKE(recipe.id),
    api.METHODS.POST({}, USER.token)
  );
  if (response.ok) {
    const { OP, data } = await response.json();
    switch (OP) {
      case 'DEL':
        const likes = post.state.like;
        post.state.like = likes.filter(item => item.user_id !== USER.id);
        break;
      case 'POST':
        post.state.like.push(data);
        break;
      default:
        break;
    }
    post.renderPanel();
  } else {
    this.flash.render({ message: 'Something went wrong', type: 'error' });
  }
};

const handleCommentPost = async (post, recipe) => {
  const token = user.getUser()?.token;
  if (!token) return;
  const body = {
    text: post.details.commentText.value,
    recipe: recipe.id,
  };
  const req = await fetch(api.ROUTES.COMMENT.POST, api.METHODS.POST(body, token));
  const json = await req.json();
  recipe.comment.push(json);
  post.render(recipe);
};

const unixtime = ISO_time => new Date(ISO_time).getTime() / 1000;

/**
 * @type {{
    menu: TopMenuView,
    nav: ContentNavView,
    browser: ContentBrowser,
    loading: LoadingView,
    search: SearchView,
    flash: FlashView,
    about: AboutView
  }}
 */
let __views = undefined;

class BrowserPosts extends View {
  constructor(parent) {
    super(parent);
    this.root = View.element('div', css('content-page'));
  }
}

export class ContentBrowser {
  static NAV = {
    TALKED: 0,
    LATEST: 1,
    LIKED: 2,
  };

  /**
   * @param {ContentNavView} contentNav
   * @param {FlashView} flash
   */
  constructor(contentNav, flash) {
    this.posts = new BrowserPosts('main').attach();
    this.flash = flash;
    this.nav = contentNav;
    this.navIndex = -1;
    this.elements = [];
    this.recipes = [];
  }

  displayLatest(force) {
    if (!force && this.navIndex === ContentBrowser.NAV.LATEST) return;
    this.#sort((a, b) => unixtime(b.state.createdAt) - unixtime(a.state.createdAt));
    this.navIndex = ContentBrowser.NAV.LATEST;
    this.nav.highlight(this.nav.buttons[this.navIndex]);
  }

  displayTalked(force) {
    if (!force && this.navIndex === ContentBrowser.NAV.TALKED) return;
    this.#sort((a, b) => b.state.comment.length - a.state.comment.length);
    this.navIndex = ContentBrowser.NAV.TALKED;
    this.nav.highlight(this.nav.buttons[this.navIndex]);
  }

  displayLiked(force) {
    if (!force && this.navIndex === ContentBrowser.NAV.LIKED) return;
    this.#sort((a, b) => b.state.like.length - a.state.like.length);
    this.navIndex = ContentBrowser.NAV.LIKED;
    this.nav.highlight(this.nav.buttons[this.navIndex]);
  }

  load(recipes) {
    if (recipes) this.recipes = recipes;
    this.#clean();
    this.elements = [];
    this.recipes.forEach(recipe => {
      const post = new RecipePostView(null, recipe).render().on.removed(() => {
        this.recipes = this.recipes.filter(r => r.id !== recipe.id);
        this.elements = this.elements.filter(r => r.state.id !== recipe.id);
        post.detach();
      });
      post.on.comment(() => handleCommentPost(post, recipe));
      post.on.commentClicked(() => post.details.comments.toggle());
      post.on.likeClicked(() => handleRecipeLike(post, recipe));
      this.elements.push(post);
    });
    this.changeContentByIndex(this.navIndex, true);
  }

  changeContentByIndex(index, force) {
    if (index < 0 || index > ContentBrowser.NAV.LIKED) return;

    this.nav.highlight(this.nav.buttons[this.navIndex]);
    switch (index) {
      case ContentBrowser.NAV.TALKED:
        this.displayTalked(force);
        break;
      case ContentBrowser.NAV.LATEST:
        this.displayLatest(force);
        break;
      case ContentBrowser.NAV.LIKED:
        this.displayLiked(force);
        break;
      default:
        break;
    }
  }

  search(str) {
    this.#clean();
    this.elements
      .filter(post => post.state.name.includes(str))
      .forEach(post => post.attach(this.posts));
  }

  cancelSearch() {
    this.changeContentByIndex(this.navIndex, true);
  }

  browseRight() {
    this.changeContentByIndex(this.navIndex + 1);
  }

  browseLeft() {
    this.changeContentByIndex(this.navIndex - 1);
  }

  #clean() {
    while (this.posts.root.lastChild)
      this.posts.root.removeChild(this.posts.root.lastChild);
  }

  #sort(predicate) {
    this.elements.sort(predicate);
    this.#clean();
    this.elements.forEach(ele => ele.attach(this.posts.root));
  }
}

const components = () => {
  const topPanel = new TopMenuView('top-panel-view');
  __views = {
    menu: topPanel,
    nav: topPanel.contentNav,
    browser: new ContentBrowser(topPanel.contentNav),
    loading: new LoadingView('main'),
    search: new SearchView('main'),
    flash: new FlashView('main'),
    about: new AboutView('main', 'About the Application'),
  };
  return __views;
};

export default {
  components,
};
