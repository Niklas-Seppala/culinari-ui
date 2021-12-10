import { ContentNavView, TopMenuView } from './views/TopMenu/TopMenuView';
import { UserMenuView } from './views/UserMenu/UserMenuView';
import { SearchView } from './views/Search/SearchView';
import { LoadingView } from './views/Loading/LoadingView';
import { RecipePostView } from './views/RecipePost/RecipePostView';
import { RecipeFormView } from './views/Forms/FormViews';
import { FlashView } from './views/Flash/FlashView';
import swipe from './modules/swipe';

// MOCK DATA
import { recipes } from './mock/recipes';
import { css, View } from './views/View';

const main = () => {
  const loading = new LoadingView('main').attach();
  const flash = new FlashView('main');

  const forms = {
    recipe: new RecipeFormView('main').on.submit(fields => {
      flash
        .render({ message: 'Not yet implemented', type: 'error', duration: 3000 })
        .attach();
      forms.recipe.detach();
    }),
  };

  const userMenu = new UserMenuView('main');
  userMenu.profile.render({
    username: 'Test User',
    avatar: './img/def-profile.png',
    likes: 6,
    comments: 12,
    forks: 16,
  });
  userMenu.detach();
  // Detach anonymous part from user menu.
  userMenu.anonymous.detach();

  // Menu click events.
  userMenu.anonymous.on.aboutClicked(e => console.log('about'));
  userMenu.anonymous.on.loginClicked(e => console.log('login'));
  userMenu.anonymous.on.registerClicked(e => console.log('register'));
  userMenu.logged.on.logoutClicked(e => console.log('logout'));
  userMenu.logged.on.myRecipesClicked(e => console.log('my recipes'));
  userMenu.logged.on.newRecipeClicked(e => {
    forms.recipe.attach();
    userMenu.detach();
  });

  const search = new SearchView('main');
  const topMenu = new TopMenuView('top-panel-view');
  const browser = new ContentBrowser(topMenu.contentNav);

  // Content navigation clicks.
  topMenu.contentNav.on.talkedClicked(_ => {
    if (browser.currentIndex != 0) browser.changeContentByIndex(0);
  });
  topMenu.contentNav.on.likedClicked(e => {
    if (browser.currentIndex != 2) browser.changeContentByIndex(2);
  });
  topMenu.contentNav.on.latestClicked(e => {
    if (browser.currentIndex != 1) browser.changeContentByIndex(1);
  });

  // Search and menu clicks.
  topMenu.on.searchClicked(e => (search.isAttached ? search.detach() : search.attach()));
  topMenu.on.userMenuClicked(e =>
    userMenu.isAttached ? userMenu.detach() : userMenu.attach()
  );

  swipe.configure({
    left: _ => browser.browseLeft(),
    right: _ => browser.browseRight(),
    validator: dist => dist.x > 80 && dist.y < 50,
  });

  // demo loading view
  setTimeout(() => {
    loading.detach();
    recipes.forEach(recipe => {
      new RecipePostView(browser.contents).attach().render(recipe);
    });
    setTimeout(() => browser.changeContentByIndex(1), 100);
  }, 1000);
};

class ContentBrowser {
  /**
   *
   * @param {ContentNavView} contentNav
   */
  constructor(contentNav) {
    this.contents = View.element('div', css('content-page'));
    View.resolveParent('main').appendChild(this.contents);
    this.nav = contentNav;
    this.lastViewIndex = 2;
  }

  changeContentByIndex(index) {
    if (index < 0 || index > this.lastViewIndex) return;
    this.currentIndex = index;
    this.nav.highlight(this.nav.buttons[index]);

    if (this.contents.classList.contains('fade-in'))
      this.contents.classList.toggle('fade-in');

    setTimeout(() => {
      this.contents.classList.toggle('fade-in');
    }, 300);
  }

  browseRight() {
    if (this.currentIndex < this.lastViewIndex)
      this.changeContentByIndex(++this.currentIndex);
  }

  browseLeft() {
    if (this.currentIndex > 0) this.changeContentByIndex(--this.currentIndex);
  }
}

window.onload = main;
