import { LoginFormView, RecipeFormView, RegisterFormView, SettingsFormView } from '../views/Forms/FormViews';

const components = () => {
  return {
    recipe: new RecipeFormView('main'),
    login: new LoginFormView('main'),
    register: new RegisterFormView('main'),
    settings: new SettingsFormView('main')
  }
}

export default {
  components
}
