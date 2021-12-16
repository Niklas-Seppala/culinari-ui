import { LoginFormView, RecipeFormView, RegisterFormView, SettingsFormView } from '../views/Forms/FormViews';

/**
 * @type {{
 * recipe: RecipeFormView,
 * login: LoginFormView,
 * register: RegisterFormView,
 * settings: SettingsFormView
 * }}
 */
let __forms = undefined;

const components = () => {

  __forms = {
    recipe: new RecipeFormView('main'),
    login: new LoginFormView('main'),
    register: new RegisterFormView('main'),
    settings: new SettingsFormView('main')
  }
  return __forms;
}

export default {
  components,
  forms : __forms
}
