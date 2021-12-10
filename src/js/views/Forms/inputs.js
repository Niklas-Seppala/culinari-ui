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

  input.name = name;
  if (id) input.id = id;
  if (value) input.value = value;
  if (placeholder) input.placeholder = placeholder;

  return input;
};

/**
 * Creates time input view.
 *
 * @param {string} header
 * @returns {HTMLDivElement}
 */
export const timeInput = header => {
  const root = View.element('div', css('multiple-fields', 'card'));
  const label = View.element('label', css('center-label'));
  label.textContent = header;

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

  root.hours = hours;
  root.mins = mins;
  return root;
};

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
export const fileInput = (name, id, fileTypes, label) => {
  const root = document.createElement('label');
  root.for = name;
  root.className = 'file-upload';

  /** @type {HTMLInputElement} */
  const file = input('file', name, id, null, null);
  file.accept = fileTypes;
  file.multiple = true;

  const iconElem = icon.plain(icon.type.FILE, icon.size.LARGE);

  root.appendChild(file);
  root.appendChild(iconElem);
  root.appendChild(document.createTextNode(label));

  root.files = file;
  return root;
};
