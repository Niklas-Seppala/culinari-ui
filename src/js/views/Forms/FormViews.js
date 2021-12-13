import './Forms.css';
import { PopupView } from '../Popup/PopupView';
import { View } from '../View';
import { input, fileInput, multiInput } from './inputs';

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
    this.form.reset();
  }

  /**
   * Calls subscribed onSubmit listeners.
   * Clears fields. Optionally closes this form.
   *
   * @param {boolean} close
   */
  submit(close) {
    this.#submitListeners.forEach(f => f(this.formData));
    this.form.reset();
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
    this.submitBtn = input('submit', 'submit', '', 'Register');

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
    this.submitBtn = input('submit', 'submit', '', 'Log In');

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
  constructor(parent) {
    super(parent, 'Post New Recipe');
    this.#build();
  }

  get formData() {
    const result = {
      name: this.name.value,
      desc: this.desc.value,
      instructions: [],
      ingredients: [],
      files: this.files.files.files,
    };

    for (let i = 0; i < this.form.children.length; i++) {
      const inpt = this.form.children[i];
      if (inpt.name?.startsWith('instruction') && inpt.value) {
        result.instructions.push({
          content: inpt.value,
          order: result.instructions.length
        });
      } else if (inpt.name?.startsWith('ingredient') && inpt.value) {

        result.ingredients.push({
          name: inpt.value,
          order: result.ingredients.length
        });
      }
    }
    return result;
  }

  #build() {
    this.form = View.element('form');
    this.name = input('text', 'name', '', 'Name');
    this.desc = input('textarea', 'desc', '', 'Summary');
    this.instructions = multiInput('text', 'instruction', '', 'Instruction', '', 0);
    this.ingredients = multiInput('text', 'ingredients', '', 'Ingredient', '', 0);
    this.files = fileInput('foodImg', '', 'image/*', 'Image');
    this.submitBtn = input('submit', 'submit', '', 'Log In');

    this.form.appendChild(this.name);
    this.form.appendChild(this.desc);
    this.form.appendChild(this.instructions);
    this.form.appendChild(this.ingredients);
    this.form.appendChild(this.files);
    this.form.appendChild(this.submitBtn);
    this.root.appendChild(this.form);

    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.submit();
    });
  }
}
