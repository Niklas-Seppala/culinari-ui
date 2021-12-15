import { LoginFormView, RecipeFormView, RegisterFormView } from '../views/Forms/FormViews';

const components = () => {
  return {
    recipe: new RecipeFormView('main'),
    login: new LoginFormView('main'),
    register: new RegisterFormView('main'),
  }
}

export default {
  components
}

 // const forms = {
  //   recipe: new RecipeFormView('main').on.submit(fields => {
  //     console.log(fields)
  //     flash
  //       .render({ message: 'Not yet implemented', type: 'error', duration: 3000 })
  //       .attach();
  //     forms.recipe.detach();
  //   }),

  //   login: new LoginFormView('main').on.submit(async fields => {
  //     const url = 'http://127.0.0.1:3000/auth/login';
      
  //     const fetchOptions = {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(fields)
  //     }

  //     const response = await fetch(url, fetchOptions)
  //     if (response.status === 200) {
  //       flash
  //         .render({ message: 'Success', type: 'success', duration: 5000 })
  //         .attach();
  //       forms.register.detach();
  //       user.store(await response.json());
  //       forms.login.detach();
  //       userMenu.anonymous.detach();
  //       userMenu.profile.render(user.getUser())
  //       console.log(user.getUser())
  //       userMenu.logged.attach();
  //     }
  //   }),

  // };