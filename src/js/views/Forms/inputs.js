import './Forms.css';
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

export const timeInput = text => {
  const root = View.element('div', css('multiple-fields', 'card'));
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

  root.hours = hours;
  root.mins = mins;
  return root;
};

export const multiInput = (type, name, id, ph, value, ord) => {
  const realName = `${name}_${ord}`;
  const realPh = `${ord + 1}. ${ph}`;
  const inputElem = input(type, realName, id, realPh, value);

  inputElem.addEventListener('change', e => {
    if (!e.target.handled) {
      const newInput = multiInput(type, name, id, ph, value, ord + 1);
      e.target.parentNode.insertBefore(newInput, e.target.nextSibling);
      e.target.handled = true;
    }
  });

  inputElem.multiInput = true;
  return inputElem;
};

export const fileInput = (name, id, fileTypes, label) => {
  const root = document.createElement('label');
  root.for = name;
  root.className = 'file-upload';

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
