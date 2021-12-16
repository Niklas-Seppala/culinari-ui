import { ForkRecipeForm, LoginFormView, RecipeFormView, RegisterFormView, SettingsFormView, UpdateRecipeForm } from '../views/Forms/FormViews';

/**
 * @type {{
 * recipe: RecipeFormView,
 * login: LoginFormView,
 * register: RegisterFormView,
 * settings: SettingsFormView,
 * updateRecipe: UpdateRecipeForm,
 * forkRecipe: ForkRecipeForm
 * }}
 */
let __forms = undefined;

const components = () => {
  __forms = {
    recipe: new RecipeFormView('main'),
    login: new LoginFormView('main'),
    register: new RegisterFormView('main'),
    settings: new SettingsFormView('main'),
    updateRecipe: new UpdateRecipeForm('main'),
    forkRecipe: new ForkRecipeForm('main')
  }
  return __forms;
}

export default {
  components,
  forms : __forms
}
