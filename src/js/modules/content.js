import { ContentNavView, TopMenuView } from '../views/TopMenu/TopMenuView';
import { FlashView } from '../views/Flash/FlashView';
import { LoadingView } from '../views/Loading/LoadingView';
import { css, icon, View } from '../views/View';
import { SearchView } from '../views/Search/SearchView';
import { RecipePostView } from '../views/RecipePost/RecipePostView';
import api from './api';
import user from './user';

/**
 * @type {{
    menu: TopMenuView,
    nav: ContentNavView,
    browser: ContentBrowser,
    loading: LoadingView,
    search: SearchView,
    flash: FlashView,
  }}
 */
let __views = undefined;

class ContentBrowser {
  /**
   * @param {ContentNavView} contentNav
   * @param {FlashView} flash
   */
  constructor(contentNav, flash) {
    this.latest = View.element('div'); //css('content-page')
    this.flash = flash;
    View.resolveParent('main').appendChild(this.latest);

    this.nav = contentNav;
    this.lastViewIndex = 2;
  }

  loadRecipes(recipes) {
    const USER = user.getUser();
    this.recipes = recipes;
    this.recipes
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .forEach(recipe => {
        const post = new RecipePostView(this.latest).render(recipe).attach();

        post.on.comment(async data => {
          const token = user.getUser().token;
          const req = await fetch(api.ROUTES.COMMENT.POST, api.METHODS.POST(data, token));
          const json = await req.json();
          recipe.comment.push(json);
          post.render(recipe);
        });

        post.on.commentClicked(() => {
          post.details.comments.toggle();
        });

        post.on.likeClicked(async () => {
          let resp;
          let req = await fetch(
            api.ROUTES.RECIPE.LIKE(recipe.id),
            api.METHODS.POST({}, USER.token)
          );
          if (req.ok) {
            resp = await req.json();
            post.state.like.push(resp);
            post.renderPanel();
          } else {
            req = await fetch(
              api.ROUTES.RECIPE.LIKE(recipe.id),
              api.METHODS.DELETE({}, USER.token)
            );
            if (req.ok) {
              resp = await req.json();
              post.state.like = post.state.like.filter(item => item.user_id !== USER.id);
              post.renderPanel();
            } else {
              this.flash.render({ message: 'Something went wrong', type: 'error' });
            }
          }
        });
      });
  }

  changeContentByIndex(index) {
    if (index < 0 || index > this.lastViewIndex) return;
    this.currentIndex = index;
    this.nav.highlight(this.nav.buttons[index]);
  }

  browseRight() {
    if (this.currentIndex < this.lastViewIndex)
      this.changeContentByIndex(++this.currentIndex);
  }

  browseLeft() {
    if (this.currentIndex > 0) this.changeContentByIndex(--this.currentIndex);
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
  };
  return __views;
};

export default {
  components,
};
