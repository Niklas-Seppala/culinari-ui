import './Forms.css';
import { css, View, icon } from '../View';

/**
 * Create basic input element.
 *
 * @param {string} type Type of the input (supports textarea)
 * @param {string} name Name of the input
 * @param {string} id Id of the input
 * @param {string} placeholder Placeholder value for the input
 * @param {string} value Starting value for the input
 * @returns {HTMLInputElement|HTMLTextAreaElement}
 */
export const input = (type, name, id, placeholder, value) => {
  let input;
  // Check for textarea type.
  if (type === 'textarea') {
    input = document.createElement('textarea');
  } else {
    input = document.createElement('input');
    input.type = type;
  }
  input.autocomplete = 'off'

  input.name = name;
  if (id) input.id = id;
  if (value) input.value = value;
  if (placeholder) input.placeholder = placeholder;

  return input;
};

export class InstructionInput extends View {
  constructor(parent) {
    super(parent);
    this.inputs = [];
    this.index = 0;
    this._state = [];
    this.#build();
  }
  /**
   * @type {[{text: string, order: number}]}
   */
    _state = [];

    get state() {
      return this._state.filter(item => Object.keys(item).length !== 0);
    }

  render(state) {
    this._state = [];
    this.index = 0;
    while (this.root.lastChild) this.root.removeChild(this.root.lastChild);
    console.log(state)
    state.forEach(values => {
      const inp = this.#createInput();
      inp.children[0].value = values.content;
    });
    this.#createInput();
  }

  #createInput() {
    const subRoot = View.element('div', css('input-grp-item'), this.root);
    const instruction = input(
      'text',
      `instruction_${this.index}`,
      null,
      `${this.index + 1} Instruction`
    );
    instruction.classList.add('instruction-input')
    if (this.index > 0)
      instruction.classList.add('nth-grp-input')
      
    subRoot.appendChild(instruction);

    subRoot.index = this.index;
    instruction.addEventListener('change', e => {
      this._state[subRoot.index]['content'] = instruction.value;
      this._state[subRoot.index]['order'] = subRoot.index;
      if (subRoot.handled) return;
      if (instruction !== document.activeElement) {
        subRoot.handled = true;
        this.#createInput();
      }
    });

    this.index++;
    this.root.appendChild(subRoot);
    this._state.push({});
    return subRoot;
  }

  #build() {
    this.root = View.element('div', css('input-grp'));
    this.#createInput();
  }
}

export class IngredientInput extends View {
  constructor(parent) {
    super(parent);
    this.inputs = [];
    this.index = 0;
    this._state = [];
    this.#build();
  }

  render(state) {
    this._state = [];
    this.index = 0;
    while (this.root.lastChild) this.root.removeChild(this.root.lastChild);
    state.forEach(values => {
      const inp = this.#createInput();
      inp.children[0].value = values.name;
      inp.children[1].value = values.amount;
      inp.children[2].value = values.unit;
    });
    this.#createInput();
  }

  /**
   * @type {[{
      name: '',
      unit: '',
      amount: 0
    }]}
   */
  _state = [];

  get state() {
    return this._state.filter(item => Object.keys(item).length !== 0);
  }

  #createInput() {
    const subRoot = View.element('div', css('input-ingredient'), this.root);if (this.index > 0)
    subRoot.classList.add('nth-grp-input')
    const ingName = input(
      'text',
      `name_${this.index}`,
      null,
      `${this.index + 1} Ingredient`
    );
    ingName.classList.add('ing-name');

    const ingAmount = input('number', `amount_${this.index}`, null, 'Amount');
    ingAmount.classList.add('ing-amount');

    const ingUnit = input('text', `unit_${this.index}`, null, 'Unit');
    ingUnit.classList.add('ing-unit');

    subRoot.appendChild(ingName);
    subRoot.appendChild(ingAmount);
    subRoot.appendChild(ingUnit);
    const inputs = [ingName, ingUnit, ingAmount];
    inputs.forEach(inp => {
      subRoot.index = this.index;
      inp.addEventListener('change', e => {
        const key = e.target.name.split('_')[0];
        this._state[subRoot.index][key] = inp.value;

        if (subRoot.handled) return;
        let lostFocus = true;
        for (let i = 0; i < inputs.length; i++) {
          if (inputs[i] === document.activeElement) {
            lostFocus = true;
            break;
          }
        }
        if (lostFocus) {
          subRoot.handled = true;
          this.#createInput();
        }
      });
    });
    this.index++;
    this.root.appendChild(subRoot);
    this._state.push({});
    return subRoot;
  }

  #build() {
    this.root = View.element('div', css('ing-root', 'input-grp'));
    this.#createInput();
  }
}

/**
 * Creates dynamic multipart input.
 *
 * @param {string} type Type of the input
 * @param {string} name Name of the input
 * @param {string} id Id of the input
 * @param {string} ph Placeholder value for the input
 * @param {string} value Staring value for the input
 * @param {number} ord Order of the input
 * @returns
 */
export const multiInput = (type, name, id, ph, value, ord) => {
  const realName = `${name}_${ord}`;
  const realPh = `${ord + 1}. ${ph}`;
  /** @type {HTMLInputElement} */
  const inputElem = input(type, realName, id, realPh, value);

  // When input is set, insert new input of the same type to form,
  // below this input.
  inputElem.addEventListener('change', e => {
    if (!e.target.handled) {
      // Tag the input's "growth" as handled, so this event handling
      // is not repeated.
      e.target.handled = true;
      const newInput = multiInput(type, name, id, ph, value, ord + 1);
      e.target.parentNode.insertBefore(newInput, e.target.nextSibling);
    }
  });

  // Tag this input as multipart, so it differs from regular
  // inputs.
  inputElem.multiInput = true;
  return inputElem;
};

/**
 * Creates custom file input element.
 *
 * @param {string} name Name of the input
 * @param {string} id Id of the input
 * @param {string} fileTypes Accepted file types for the input
 * @param {string} label Label/Header for the input
 * @returns {HTMLLabelElement} Custom file input element.
 */
export const fileInput = (name, id, fileTypes, label, required) => {
  const root = document.createElement('label');
  root.for = name;
  root.className = 'file-upload';

  /** @type {HTMLInputElement} */
  const file = input('file', name, id, null, null);
  file.required = required;
  file.accept = fileTypes;
  file.multiple = true;

  const iconElem = icon.plain(icon.type.IMAGES, icon.size.LARGE);

  root.appendChild(iconElem);
  root.appendChild(file);
  root.appendChild(document.createTextNode(label));

  root.files = file;
  return root;
};
