import './Forms.css';
import { PopupView } from '../Popup/PopupView';
import { css, icon, View } from '../View';
import { input, fileInput, multiInput, IngredientInput, InstructionInput } from './inputs';
import api from '../../modules/api';

/**
 * Base class that holds common methods for all
 * future form views.
 * @extends {PopupView}
 */
class FormView extends PopupView {
  constructor(parent, header) {
    super(parent, header);
    super.closeListener = this.cancel.bind(this);
  }

  /**
   * Gather form's input field values.
   */
  get formData() {
    throw Error('Unimplemented method');
  }

  /**
   * Cancels form, aka clears values.
   */
  cancel() {
    this.#cancelListeners.forEach(f => f(this.formData));
    this.form?.reset();
  }

  /**
   * Calls subscribed onSubmit listeners.
   * Clears fields. Optionally closes this form.
   *
   * @param {boolean} close
   */
  submit(close) {
    this.#submitListeners.forEach(f => f(this.formData));
    if (close === true) this.detach();
  }

  /** @type {[(fields:object) => void]} */
  #submitListeners = [];
  /** @type {[(fields:object) => void]} */
  #cancelListeners = [];
  on = {
    /**  @param {(fields:object) => void} listener */
    submit: listener => {
      this.#submitListeners.push(listener);
      return this;
    },
    /** @param {(fields:object) => void} listener */
    cancel: listener => {
      this.#cancelListeners.push(listener);
      return this;
    },
  };
}

/**
 * From view for registering to the application.
 *
 * @extends {FormView}
 */
export class RegisterFormView extends FormView {
  constructor(parent) {
    super(parent, 'Register');
    this.#build();
  }

  get formData() {
    return {
      username: this.username.value,
      email: this.email.value,
      password: this.password.value,
      confirm: this.confirm.value,
    };
  }

  #build() {
    this.form = View.element('form');
    this.username = input('text', 'username', '', 'Username');
    this.email = input('email', 'email', '', 'Email');
    this.password = input('password', 'password', '', 'Password');
    this.confirm = input('password', 'confirm', '', 'Password Again');
    this.submitBtn = input('submit', 'submit', null, null, 'Register');

    this.form.appendChild(this.username);
    this.form.appendChild(this.email);
    this.form.appendChild(this.password);
    this.form.appendChild(this.confirm);
    this.form.appendChild(this.submitBtn);
    this.root.appendChild(this.form);

    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.submit();
    });
  }
}

/**
 * From view for registering to the application.
 *
 * @extends {FormView}
 */
 export class SettingsFormView extends FormView {
  constructor(parent) {
    super(parent, 'Profile Settings');
    this.#buildAvatarForm();
    this.#build();
    this.#buildPasswodForm();
    this.changes = false;
  }

  render(state) {
    this.username.value = state.name || '';
    this.email.value = state.email || '';

    if (state.avatar) {
      this.avatarImage.src = api.ROUTES.STATIC(state.avatar)
    } else {
      this.avatarImage.src = './img/def-profile.png'
    }
    return this;
  }

  on = {
    submitPasswords: f => this.delegate('submit', () => f(this.formData), this.passwordForm),
    submitInfo: f => this.delegate('submit', () => f(this.formData), this.infoForm),
    submitAvatar: f => this.delegate('submit', () =>  f(this.formData), this.avatarForm)
  }
 
  get formData() {
    return {
      username: this.username.value,
      email: this.email.value,
      password: this.password.value,
      avatar: this.fInput.files[0],
      confirm: this.confirm.value,
    };
  }

  #buildAvatarForm() {
    /** @type {HTMLImageElement} */
    const header = View.element('h2', css('form-sub-header'), this.root)
    header.textContent = 'Change Profile Avatar'

    this.avatarForm = View.element('form', css('settings'), this.root);
    this.avatarForm.addEventListener('submit', e => e.preventDefault())


    const avatarSettings = View.element('div', css('avatar-settings'), this.avatarForm);
    this.avatarImage = View.element('img', css('avatar'), avatarSettings);
    this.avatarImage.src = './img/def-profile.png'

    this.avatar = fileInput('avatar', null, 'image/*', 'Change Avatar')
    this.fInput = this.avatar.getElementsByTagName('input').item(0);

    const reader = new FileReader();
    reader.addEventListener('load', () => this.avatarImage.src = reader.result);

    this.fInput.addEventListener('change', () => {
      const selectedFile = this.fInput.files[0];
      if (selectedFile) reader.readAsDataURL(selectedFile)
    })
    this.avatar.classList.add('change-avatar')
    avatarSettings.appendChild(this.avatar)

    const submitBtn = input('submit', 'submit', null, null, 'Update');
    this.avatarForm.appendChild(submitBtn);
  }

  #buildPasswodForm() {
    const header = View.element('h2', css('form-sub-header'), this.root)
    header.textContent = 'Change Profile Password'
    this.passwordForm = View.element('form', css('settings'), this.root);
    this.passwordForm.addEventListener('submit', e => e.preventDefault())

    this.password = input('password', 'password', '', 'Password');
    this.password.required = true;
    
    this.confirm = input('password', 'confirm', '', 'Password Again');
    this.confirm.required = true;

    const submitBtn = input('submit', 'submit', null, null, 'Update');

    this.passwordForm.appendChild(this.password);
    this.passwordForm.appendChild(this.confirm);
    this.passwordForm.appendChild(submitBtn);

    this.passwordForm.addEventListener('submit', e => {
      e.preventDefault();
    });
  }

  #build() {
    const header = View.element('h2', css('form-sub-header'), this.root)
    header.textContent = 'Change Profile Info'
    this.infoForm = View.element('form', css('settings'), this.root);
    this.infoForm.addEventListener('submit', e => e.preventDefault())

    this.username = input('text', 'username', '', 'Username');
    this.username.required = true;
    this.email = input('email', 'email', '', 'Email');
    this.email.required = true;
    const submitBtn = input('submit', 'submit', null, null, 'Update');

    this.infoForm.appendChild(this.username);
    this.infoForm.appendChild(this.email);
    this.infoForm.appendChild(submitBtn);
  }
}

/**
 * Form for logging in as registered user.
 *
 * @extends {FormView}
 */
export class LoginFormView extends FormView {
  constructor(parent) {
    super(parent, 'Login');
    this.#build();
  }

  get formData() {
    return {
      username: this.username.value,
      password: this.password.value,
    };
  }

  #build() {
    this.form = View.element('form');
    this.username = input('text', 'username', '', 'Username');
    this.password = input('password', 'password', '', 'Password');
    this.submitBtn = input('submit', 'submit', null, null, 'Log In');

    this.form.appendChild(this.username);
    this.form.appendChild(this.password);
    this.form.appendChild(this.submitBtn);
    this.root.appendChild(this.form);

    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.submit();
    });
  }
}

/**
 * Form for posting/updating recipe.
 *
 * @extends {FormView}
 */
export class RecipeFormView extends FormView {
  constructor(parent, header) {
    super(parent, header || 'Post New Recipe');
    this.#build();
  }

  render(state) {
    this.name.value = state.name;
    this.desc.value = state.desc;
    this.ingredients.render(state.ingredient)
    this.instructions.render(state.step)
    return this;
  }

  get formData() {
    const result = {
      name: this.name.value,
      desc: this.desc.value,
      instructions: this.instructions.state,
      ingredients: this.ingredients.state,
      files: this.files.files.files,
    };
    return result;
  }

  #build() {
    this.form = View.element('form');
    this.name = input('text', 'name', '', 'Name');
    this.name.required = true
    this.name.classList.add('input-grp')

    this.desc = input('textarea', 'desc', '', 'Summary');
    this.desc.required = true;
    this.desc.classList.add('input-grp')

    this.instructions = new InstructionInput(this.form);
    this.ingredients = new IngredientInput(this.form);

    this.files = fileInput('foodImg', '', 'image/*', 'Upload', true);
    this.files.classList.add('input-grp')

    this.submitBtn = input('submit', 'submit', '', 'Log In');
    this.submitBtn.addEventListener('submit', e => e.preventDefault())

    this.form.appendChild(this.name);
    this.form.appendChild(this.desc);
    this.instructions.attach();
    this.ingredients.attach();
    this.form.appendChild(this.files);
    this.form.appendChild(this.submitBtn);
    this.root.appendChild(this.form);

    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.submit();
    });
  }
}

export class UpdateRecipeForm extends RecipeFormView {
  constructor(parent) {
    super(parent, 'Update Recipe');
    this.files.files.required = false;
  }

  render(state) {
    this.loadedRecipeId = state.id
    return super.render(state);
  }
}

export class ForkRecipeForm extends RecipeFormView {
  constructor(parent) {
    super(parent, 'Fork Recipe');
  }
}
