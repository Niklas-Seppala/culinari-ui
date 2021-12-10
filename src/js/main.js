import { TopMenuView } from './views/TopMenu/TopMenuView';
import { UserMenuView } from './views/UserMenu/UserMenuView';
import { SearchView } from './views/Search/SearchView';
import { LoadingView } from './views/Loading/LoadingView';
import { RecipePostView } from './views/RecipePost/RecipePostView';
import { RecipeFormView, LoginFormView, RegisterFormView } from './views/Forms/FormViews';
import { FlashView } from './views/Flash/FlashView';
import swipe from './modules/swipe';

// MOCK DATA
import { recipes } from './mock/recipes';

const main = () => {
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
    avatar: '../img/def-profile.png',
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
  // Content navigation clicks.
  topMenu.contentNav.on.talkedClicked(e => console.log('talked'));
  topMenu.contentNav.on.likedClicked(e => console.log('liked'));
  topMenu.contentNav.on.latestClicked(e => console.log('latest'));
  // Search and menu clicks.
  topMenu.on.searchClicked(e => (search.isAttached ? search.detach() : search.attach()));
  topMenu.on.userMenuClicked(e =>
    userMenu.isAttached ? userMenu.detach() : userMenu.attach()
  );

  swipe.configure({
    left: dist => console.log(dist, 'left'),
    right: dist => console.log(dist, 'right'),
    validator: dist => dist.x > 80 && dist.y < 50,
  });

  // Append these Views normally to 'main'.
  new RecipePostView('main').attach().render(recipes[0]);
  new RecipePostView('main').attach().render(recipes[0]);
};

window.onload = main;
