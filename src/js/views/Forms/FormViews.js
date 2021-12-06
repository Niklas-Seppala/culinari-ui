import './Forms.css';
import { PopupView } from '../Popup/PopupView';
import { View } from '../View';
import { input, fileInput, multiInput, timeInput  } from './inputs';

class FormView extends PopupView {
  constructor(parent, header) {
    super(parent, header);
    super.closeListener = this.cancel.bind(this)
  }

  get formData() {
    throw Error('Unimplemented method');
  }

  cancel() {
    this.#cancelListeners.forEach(f => f(this.formData));
    this.form.reset();
  }

  addValidator(validator) {
    this.validator = validator
    return this;
  }

  submit() {
    if (this.validator ? this.validator.call(this, this.formData) : true) {
      this.#submitListeners.forEach(f => f(this.formData));
      this.form.reset();
      this.detach();
    } else {
      window.alert('invalid')
    }
  }

  #submitListeners = [];
  #cancelListeners = [];
  on = {
    submit: listener => {
      this.#submitListeners.push(listener);
      return this;
    },
    cancel: listener => {
      this.#cancelListeners.push(listener);
      return this;
    },
  };
}


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
      password2: this.password2.value
    }
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


export class LoginFormView extends FormView {
  constructor(parent) {
    super(parent, 'Login');
    this.#build();
  }

  get formData() {
    return {
      username: this.username.value,
      password: this.password.value
    }
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
      time: {
        hours: this.time.hours.value,
        mins: this.time.mins.value,
      },
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
    this.time = timeInput('Time', 'time');
    this.files = fileInput('foodImg', '', 'image/*', 'Image');
    this.submitBtn = input('submit', 'submit', '', 'Log In');

    this.form.appendChild(this.name);
    this.form.appendChild(this.summary);
    this.form.appendChild(this.instructions);
    this.form.appendChild(this.ingredients);
    this.form.appendChild(this.time);
    this.form.appendChild(this.files);
    this.form.appendChild(this.submitBtn);
    this.root.appendChild(this.form);

    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.submit();
    });
  }
}
