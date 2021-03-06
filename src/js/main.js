import swipe from './modules/swipe';
import user from './modules/user';
import formsModule from './modules/forms';
import content from './modules/content';
import api from './modules/api';
import { PromptView } from './views/Popup/PromptView';

const fetchRecipes = async (browser, forms) => {
  const resp = await fetch(api.ROUTES.RECIPE.ALL);
  const data = await resp.json();
  if (resp.ok) {
    console.log(data);
  }
  browser.load(data, forms);
  return data;
};

const main = async () => {
  const forms = formsModule.components();
  const { menu, nav, browser, flash, loading, about, search } = content.components();
  const { userMenu } = user.components();

  const smoothLoading = work => {
    loading.attach();
    setTimeout(async () => {
      work();
      loading.detach();
    }, 400); // DEV
  };

  //*****************************************/
  //**********    LOAD API DATA  ************/
  //*****************************************/
  smoothLoading(async () => {
    await user.fetch(api.ROUTES.USER.ALL);
    await user.loadStorage();
    const recipes = await fetchRecipes(browser, forms);

    user.getMyRecipes(recipes);
    const USER = user.getUser();
    if (USER) {
      userMenu.profile.render(USER);
      userMenu.anonymous.detach();
    } else {
      userMenu.logged.detach();
    }

    browser.displayLatest();
    loading.detach();
  });

  //*****************************************/
  //**********    MAIN MENU    **************/
  //*****************************************/

  // Content navigation click events.
  nav.on.talkedClicked(() => {
    browser.displayTalked();
  });
  nav.on.latestClicked(() => {
    browser.displayLatest();
  });
  nav.on.likedClicked(() => {
    browser.displayLiked();
  });

  // Search button click events.
  menu.on.searchClicked(() => {
    if (search.isAttached) {
      search.detach();
      search.clear();
      browser.cancelSearch();
    } else {
      search.attach();
    }
  });

  search.on.search(e => browser.search(e.target.value));

  // User menu click events.
  menu.on.userMenuClicked(() =>
    userMenu.isAttached ? userMenu.detach() : userMenu.attach()
  );

  // ANONYMOUS USER MENU EVENTS
  userMenu.anonymous.on.aboutClicked(() => {
    about.attach();
    userMenu.detach();
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
    new PromptView('Goodbye?', () => {
      user.dispose();
      userMenu.logged.detach();
      userMenu.anonymous.attach();
      flash
        .render({ message: 'You are now logged out', type: 'success', duration: 3000 })
        .attach();
      userMenu.detach();
      browser.load();
    }).attach();
  });
  userMenu.logged.on.myRecipesClicked(() => {
    userMenu.detach();
    browser.displayFromUser(user.getUser().id);
  });
  userMenu.logged.on.newRecipeClicked(() => {
    userMenu.detach();
    forms.recipe.attach();
  });
  userMenu.logged.on.aboutClicked(() => {
    userMenu.detach();
    about.attach();
  });
  userMenu.logged.on.settingsClicked(() => {
    forms.settings.render(user.getUser()).attach();
    userMenu.detach();
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
        location.reload();
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
      if (register.ok) {
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
        forms.settings.changes = true;
        flash.render({ message: 'Failed', type: 'error', duration: 4000 }).attach();
      }
    } catch (err) {
      flash.render({ message: 'Failed', type: 'error', duration: 4000 }).attach();
      console.error(err);
    }
  });

  forms.settings.onClose(() => {
    if (forms.settings.changes) location.reload();
  });
  forms.settings.on.submitAvatar(async fields => {
    const USER = user.getUser();
    if (!USER) return;

    if (fields.avatar) {
      const body = new FormData();
      body.append('avatar', fields.avatar);

      const response = await fetch(
        api.ROUTES.USER.AVATAR(USER.id),
        api.METHODS.POST_FORM(body, USER.token)
      );
      if (response.ok) {
        forms.settings.changes = true;
        flash
          .render({ message: 'Avatar Updated', type: 'success', duration: 2000 })
          .attach();
      } else {
        flash
          .render({ message: 'Something Went Wrong...', type: 'error', duration: 2000 })
          .attach();
      }
    }
  });

  forms.settings.on.submitInfo(async fields => {
    const USER = user.getUser();
    if (!USER) return;

    const body = { username: fields.username, email: fields.email };
    const response = await fetch(
      api.ROUTES.USER.UPDATE,
      api.METHODS.PUT(body, USER.token)
    );
    if (response.ok) {
      forms.settings.changes = true;
      flash.render({ message: 'Info Updated', type: 'success', duration: 2000 }).attach();
    } else {
      flash
        .render({ message: 'Something Went Wrong...', type: 'error', duration: 2000 })
        .attach();
    }
  });

  forms.settings.on.submitPasswords(async fields => {
    const USER = user.getUser();
    if (!USER) return;

    const body = { password: fields.password, confirm: fields.confirm };
    const response = await fetch(
      api.ROUTES.USER.PASSWORD,
      api.METHODS.PUT(body, USER.token)
    );
    if (response.ok) {
      flash
        .render({ message: 'Password Updated', type: 'success', duration: 2000 })
        .attach();
    } else {
      flash
        .render({ message: 'Something Went Wrong...', type: 'error', duration: 2000 })
        .attach();
    }
  });

  forms.recipe.on.submit(async fields => {
    const TOKEN = user.getUser().token;
    const files = [...fields.files];
    const textualData = { ...fields };
    delete textualData.files;

    const textRes = await fetch(
      api.ROUTES.RECIPE.POST,
      api.METHODS.POST(textualData, TOKEN)
    );
    if (textRes.ok) {
      const recipe = await textRes.json();

      const imgBody = new FormData();
      for (let i = 0; i < files.length; i++) {
        imgBody.append('img', files[i]);
      }
      const picRes = await fetch(
        api.ROUTES.RECIPE.POST_IMG(recipe.id),
        api.METHODS.POST_FORM(imgBody, TOKEN)
      );
      if (!picRes.ok) {
        flash
          .render({ message: 'Upload failed', type: 'error', duration: 3000 })
          .attach();
        return;
      }
      location.reload();
    }
  });

  forms.updateRecipe.on.submit(async fields => {
    const LOADED_ID = forms.updateRecipe.loadedRecipeId;
    const TOKEN = user.getUser().token;
    const files = [...fields.files];
    const textualData = { ...fields };
    delete textualData.files;

    const textRes = await fetch(
      api.ROUTES.RECIPE.PUT(LOADED_ID),
      api.METHODS.PUT(textualData, TOKEN)
    );
    const recipe = await textRes.json();
    console.log(recipe);
    if (textRes.ok) {
      if (files.length > 0) {
        const imgBody = new FormData();
        files.forEach(f => imgBody.append('img', f));
        const picRes = await fetch(
          api.ROUTES.RECIPE.PUT_IMG(LOADED_ID),
          api.METHODS.PUT_FORM(imgBody, TOKEN)
        );
        if (!picRes.ok) {
          flash
            .render({ message: 'Upload failed', type: 'error', duration: 3000 })
            .attach();
          return;
        }
      }
      location.reload();
    } else {
      flash.render({ message: 'Update failed', type: 'error', duration: 3000 }).attach();
    }
  });

  forms.forkRecipe.on.submit(async fields => {
    const FORKED_ID = forms.forkRecipe.loadedRecipeId;
    const TOKEN = user.getUser().token;
    const files = [...fields.files];
    const textualData = { ...fields };
    delete textualData.files;
    textualData.forked_from = FORKED_ID;

    console.log(textualData);

    const textRes = await fetch(
      api.ROUTES.RECIPE.POST,
      api.METHODS.POST(textualData, TOKEN)
    );
    if (textRes.ok) {
      const recipe = await textRes.json();

      const imgBody = new FormData();
      for (let i = 0; i < files.length; i++) {
        imgBody.append('img', files[i]);
      }
      const picRes = await fetch(
        api.ROUTES.RECIPE.POST_IMG(recipe.id),
        api.METHODS.POST_FORM(imgBody, TOKEN)
      );
      if (!picRes.ok) {
        flash
          .render({ message: 'Upload failed', type: 'error', duration: 3000 })
          .attach();
        return;
      }
      location.reload();
    }
  });
};

window.onload = main;
