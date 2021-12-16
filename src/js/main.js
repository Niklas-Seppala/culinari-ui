import swipe from './modules/swipe';
import user from './modules/user';
import formsModule from './modules/forms';
import content, { ContentBrowser } from './modules/content';
import api from './modules/api';

const fetchRecipes = async browser => {
  const resp = await fetch(api.ROUTES.RECIPE.ALL);
  const data = await resp.json();
  if (resp.ok) {
    console.log(data);
  }
  browser.load(data);
};

const main = async () => {
  
  const forms = formsModule.components();
  const { menu, nav, browser, flash, loading, about, search } = content.components();
  const { userMenu } = user.components();

  const smoothLoading = (work) => {
    loading.attach()
    setTimeout(async () => {
      work();
      loading.detach();
    }, 400); // DEV
  }

  //*****************************************/
  //**********    LOAD API DATA  ************/
  //*****************************************/

  smoothLoading(async () => {
    await user.fetch(api.ROUTES.USER.ALL);
    await fetchRecipes(browser);
    browser.displayLatest();
    loading.detach();
  })
  user.loadStorage()
  

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
    const USER = user.getUser();
    if (USER) {
      userMenu.profile.render(USER);
      userMenu.anonymous.detach();
    } else {
      userMenu.logged.detach();
    }
  }

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
    user.dispose();
    userMenu.logged.detach();
    userMenu.anonymous.attach();
    flash
      .render({ message: 'You are now logged out', type: 'success', duration: 3000 })
      .attach();
    userMenu.detach();
    browser.load();
  });
  userMenu.logged.on.myRecipesClicked(() => {
    console.log('my recipes');
  });
  userMenu.logged.on.newRecipeClicked(() => {
    userMenu.detach();
    forms.recipe.attach();
  });
  userMenu.logged.on.aboutClicked(() => {
    userMenu.detach();
    about.attach();
  })
  userMenu.logged.on.settingsClicked(() => {
    forms.settings.render(user.getUser()).attach();
    userMenu.detach();
  })

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
        browser.load();

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

  forms.settings.on.submit(async fields => {
    const USER = user.getUser();
    if (!USER) return;

    console.log(fields)

    if (fields.avatar) {
      const imgBody = new FormData();
      imgBody.append('avatar', fields.avatar)
      const avatarRes = await fetch(
        api.ROUTES.USER.AVATAR(USER.id),
        api.METHODS.POST_FORM(imgBody, USER.token)
      );
      if (avatarRes.ok) {
      }
    }
    location.reload();
  })

  forms.recipe.on.submit(async fields => {
    const TOKEN = user.getUser().token;
    const files = [...fields.files]
    const textualData = {...fields};
    delete textualData.files;
    
    const textRes = await fetch(api.ROUTES.RECIPE.POST, api.METHODS.POST(textualData, TOKEN))
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
        flash.render({message: 'Upload failed', type: 'error', duration: 3000}).attach();
        return;
      }
      location.reload();
    }
  });
};

window.onload = main;
