import swipe from './modules/swipe';
import user from './modules/user';
import formsModule from './modules/forms';
import content from './modules/content';
import api from './modules/api';

// MOCK DATA
import { recipes } from './mock/recipes';

const main = async () => {
  const forms = formsModule.components();
  const { menu, nav, browser, flash, loading, search } = content.components();
  const { userMenu } = user.components();

  //*****************************************/
  //**********    MAIN MENU    **************/
  //*****************************************/

  // Content navigation click events.
  nav.on.talkedClicked(() => {
    if (browser.currentIndex != 0) browser.changeContentByIndex(0);
  });
  nav.on.latestClicked(() => {
    if (browser.currentIndex != 1) browser.changeContentByIndex(1);
  });
  nav.on.likedClicked(() => {
    if (browser.currentIndex != 2) browser.changeContentByIndex(2);
  });

  // Search button click events.
  menu.on.searchClicked(() => (search.isAttached ? search.detach() : search.attach()));

  // User menu click events.
  menu.on.userMenuClicked(() =>
    userMenu.isAttached ? userMenu.detach() : userMenu.attach()
  );

  //*****************************************/
  //**********    USER MENU    **************/
  //*****************************************/
  {
    // If user is loaded, reflect this in user menu.
    if (user.loadStorage()) {
      console.log(user.getUser())
      userMenu.profile.render(user.getUser());
      userMenu.anonymous.detach();
    } else {
      userMenu.logged.detach();
    }
  }

  // ANONYMOUS USER MENU EVENTS
  userMenu.anonymous.on.aboutClicked(() => {
    console.log('about page');
  });
  userMenu.anonymous.on.loginClicked(() => {
    userMenu.detach();
    forms.login.attach();
  });
  userMenu.anonymous.on.registerClicked(() => {
    userMenu.detach();
    forms.register.attach();
  });

  // LOGGED IN USER MENU EVENTS
  userMenu.logged.on.logoutClicked(() => {
    user.dispose();
    userMenu.logged.detach();
    userMenu.anonymous.attach();
    flash.render({ message: 'You are now logged out', type: 'success', duration: 3000 }).attach();
    userMenu.detach();
  });
  userMenu.logged.on.myRecipesClicked(() => {
    console.log('my recipes');
  });
  userMenu.logged.on.newRecipeClicked(() => {
    // userMenu.detach();
    forms.recipe.attach();
  });

  //*****************************************/
  //********    SWIPE DETECTION   ***********/
  //*****************************************/

  swipe.configure({
    left: _ => browser.browseLeft(),
    right: _ => browser.browseRight(),
    validator: dist => dist.x > 80 && dist.y < 50,
  });

  //*****************************************/
  //*********    LOGIN/REGISTER   ***********/
  //*****************************************/

  forms.login.on.submit(async fields => {
    try {
      const login = await fetch(api.ROUTES.AUTH.LOGIN, api.METHODS.POST(fields));
      const json = await login.json();

      if (login.ok) {
        // Store user to local storage/user module
        user.store(json);
        // Update and open user menu
        userMenu.anonymous.detach();
        userMenu.profile.render(user.getUser());
        userMenu.logged.attach();

        flash
          .render({ message: `Welcome, ${json.name}`, type: 'success', duration: 4000 })
          .attach();
        forms.login.detach();
      } else {
        flash.render({ message: 'Login failed', type: 'error', duration: 4000 }).attach();
        console.error(json);
      }
    } catch (err) {
      flash.render({ message: 'Login failed', type: 'error', duration: 4000 }).attach();
      console.error(err);
    }
  });

  forms.register.on.submit(async fields => {
    try {
      const register = await fetch(api.ROUTES.AUTH.REGISTER, api.METHODS.POST(fields));
      const json = await register.json();

      if (register.ok) {
        console.log(json);
        flash
          .render({
            message: 'Success. You can now log in.',
            type: 'success',
            duration: 4000,
          })
          .attach();
        forms.register.detach();
        forms.login.attach();
      } else {
        flash.render({ message: 'Failed', type: 'error', duration: 4000 }).attach();
        console.log(json);
      }
    } catch (err) {
      flash.render({ message: 'Failed', type: 'error', duration: 4000 }).attach();
      console.error(err);
    }
  });

};

window.onload = main;
