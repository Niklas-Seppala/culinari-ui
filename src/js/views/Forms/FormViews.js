import './Forms.css';
import { PopupView } from '../Popup/PopupView';
import { css, View, icon } from '../View';

export const input = (type, name, id, placeholder, value) => {
  let input;
  if (type === 'textarea') {
    input = document.createElement('textarea');
  } else {
    input = document.createElement('input');
    input.type = type;
  }
  input.name = name;

  if (id) input.id = id;
  if (value) input.value = value;
  if (placeholder) input.placeholder = placeholder;

  return input;
};

const timeInput = text => {
  const root = View.element('div', css('duration-picker', 'card'));
  const label = View.element('label', css('center-label'));
  label.textContent = text;

  const inputWrapper = View.element('div');

  const hours = input('number', 'timeHours', null, null, '0');
  const hourLabel = View.element('label');
  hourLabel.textContent = 'Hour';

  const mins = input('number', 'timeMins', null, null, '0');
  const minsLabel = document.createElement('label');
  minsLabel.textContent = 'Min';

  inputWrapper.appendChild(hours);
  inputWrapper.appendChild(hourLabel);

  inputWrapper.appendChild(mins);
  inputWrapper.appendChild(minsLabel);

  root.appendChild(label);
  root.appendChild(inputWrapper);

  return root;
};

const dynamicInput = (type, name, id, ph, value, ord) => {
  const realName = `${name}_${ord}`;
  const realPh = `${ord + 1}. ${ph}`;
  const asd = input(type, realName, id, realPh, value);

  asd.addEventListener('change', e => {
    if (!e.target.handled) {
      const newInput = dynamicInput(type, name, id, ph, value, ord + 1);
      e.target.parentNode.insertBefore(newInput, e.target.nextSibling);
      e.target.handled = true;
    }
  });

  return asd;
};

const fileInput = (name, id, fileTypes, label) => {
  const root = document.createElement('label');
  root.for = name;
  root.className = 'file-upload';

  const file = input('file', name, id, null, null);
  file.accept = fileTypes;

  const iconElem = icon.plain(icon.type.FILE, icon.size.LARGE);
  console.log(iconElem);

  root.appendChild(file);
  root.appendChild(iconElem);
  root.appendChild(document.createTextNode(label));

  return root;
};

class FormView extends PopupView {
  constructor(parent, header) {
    super(parent, header);
  }

  #submitListeners = [];
  #cancelListeners = [];
  on = {
    submit: listener => this.#submitListeners.push(listener),
    cancel: listener => this.#cancelListeners.push(listener),
  };

  cancel() {
    this.form.reset();
    this.#cancelListeners.forEach(f => f(this.state));
  }

  submit() {
    this.form.reset();
    this.#submitListeners.forEach(f => f(this.state));
  }

  render(state) {
    if (state) this.state = state;
    if (this.state) {
      for (const key in this.state) {
        this[key].value = this.state[key];
      }
    }
  }
}

export class RegisterFormView extends FormView {
  constructor(parent) {
    super(parent, 'Register');
    this.#build();
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

    this.state = {
      username: '',
      email: '',
      password: '',
      password2: '',
    };

    for (const key in this.state) {
      this[key].addEventListener('change', e => {
        this.state[key] = e.target.value;
      });
    }
  }
}

export class LoginFormView extends FormView {
  constructor(parent) {
    super(parent, 'Login');
    this.#build();
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

    this.state = { username: '', password: '' };
    for (const key in this.state) {
      this[key].addEventListener('change', e => {
        this.state[key] = e.target.value;
      });
    }
  }
}

export class RecipeFormView extends FormView {
  constructor(parent) {
    super(parent, 'Post new Recipe');
    this.#build();
  }

  #build() {
    this.form = View.element('form');
    this.name = input('text', 'name', '', 'Name');
    this.summary = input('textarea', 'summary', '', 'Summary');
    this.instructions = dynamicInput('text', 'instruction', '', 'Instruction', '', 0);
    this.ingredients = dynamicInput('text', 'ingredients', '', 'Ingredient', '', 0);
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

    const formData = new FormData(this.form);
    for (var pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  }

  state = {
    name: '',
    summary: '',
    instructions: [],
    ingredients: [],
    time: { h: '', min: '' },
    files: [],
  };
}
