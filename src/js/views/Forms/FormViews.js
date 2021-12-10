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
      password2: this.password2.value,
    };
  }

  #build() {
    this.form = View.element('form');
    this.username = input('text', 'username', '', 'Username');
    this.email = input('email', 'email', '', 'Email');
    this.password = input('password', 'password', '', 'Password');
    this.password2 = input('password', 'password2', '', 'Password Again');
    this.submitBtn = input('submit', 'submit', '', 'Register');

    this.form.appendChild(this.username);
    this.form.appendChild(this.email);
    this.form.appendChild(this.password);
    this.form.appendChild(this.password2);
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
      summary: this.summary.value,
      instructions: [],
      ingredients: [],
      files: this.files.files.files,
    };

    for (let i = 0; i < this.form.children.length; i++) {
      const inpt = this.form.children[i];
      if (inpt.name?.startsWith('instruction') && inpt.value) {
        result.instructions.push(inpt.value);
      } else if (inpt.name?.startsWith('ingredient') && inpt.value) {
        result.ingredients.push(inpt.value);
      }
    }
    return result;
  }

  #build() {
    this.form = View.element('form');
    this.name = input('text', 'name', '', 'Name');
    this.summary = input('textarea', 'summary', '', 'Summary');
    this.instructions = multiInput('text', 'instruction', '', 'Instruction', '', 0);
    this.ingredients = multiInput('text', 'ingredients', '', 'Ingredient', '', 0);
    this.files = fileInput('foodImg', '', 'image/*', 'Image');
    this.submitBtn = input('submit', 'submit', '', 'Log In');

    this.form.appendChild(this.name);
    this.form.appendChild(this.summary);
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
