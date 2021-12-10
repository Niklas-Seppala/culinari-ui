import { ContentNavView, TopMenuView } from './views/TopMenu/TopMenuView';
import { UserMenuView } from './views/UserMenu/UserMenuView';
import { SearchView } from './views/Search/SearchView';
import { LoadingView } from './views/Loading/LoadingView';
import { RecipePostView } from './views/RecipePost/RecipePostView';
import { LoginFormView, RecipeFormView, RegisterFormView } from './views/Forms/FormViews';
import { FlashView } from './views/Flash/FlashView';
import swipe from './modules/swipe';
import user from './modules/user';

// MOCK DATA
import { recipes } from './mock/recipes';
import { css, View } from './views/View';

const main = () => {
  const loading = new LoadingView('main').attach();
  const flash = new FlashView('main');

  const forms = {
    recipe: new RecipeFormView('main').on.submit(fields => {
      console.log(fields)
      flash
        .render({ message: 'Not yet implemented', type: 'error', duration: 3000 })
        .attach();
      forms.recipe.detach();
    }),

    login: new LoginFormView('main').on.submit(fields => {
      console.log(fields)
      flash
        .render({ message: 'Not yet implemented', type: 'error', duration: 3000 })
        .attach();
      forms.login.detach();
    }),

    register: new RegisterFormView('main').on.submit(async fields => {
      console.log(fields)
      const url = 'http://127.0.0.1:3000/auth/register';
      
      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields)
      }

      const response = await fetch(url, fetchOptions)
      const json = await response.json();
      console.log(json);

      console.log(response.status)
      if (response.status === 200) {
        flash
          .render({ message: 'Success', type: 'success', duration: 3000 })
          .attach();
        forms.register.detach();
      }
    }),
  };

  user.loadCurrent();

  const userMenu = new UserMenuView('main').detach();
  const u = user.getUser();
  if (u) {
    console.log(u)
    userMenu.profile.render(u)
  } else {
    userMenu.logged.detach();
  }

  // userMenu.profile.render({
  //   username: 'Test User',
  //   avatar: './img/def-profile.png',
  //   likes: 6,
  //   comments: 12,
  //   forks: 16,
  // });


  // Detach anonymous part from user menu.
  // userMenu.anonymous.detach();

  // Menu click events.
  userMenu.anonymous.on.aboutClicked(() => console.log('about'));
  userMenu.anonymous.on.loginClicked(() => {
    forms.login.attach();
  });
  userMenu.anonymous.on.registerClicked(() => {
    forms.register.attach()
  });
  
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
