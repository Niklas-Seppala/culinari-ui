import './PopupView.css';
import { View } from '../View';

export class PopupView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
    this.state = { header: '' };
  }

  render(state) {
    if (state) this.state = state;
    if (this.state) {
      this.header.textContent = this.state.header;
    }
    return this;
  }

  #build() {
    this.root = document.createElement('div');
    this.root.classList.add('card', 'popup');

    this.panel = document.createElement('div');
    this.panel.classList.add('popup-panel');

    const left = document.createElement('div');
    left.classList.add('side-padding');
    this.panel.appendChild(left);

    this.header = document.createElement('h2');
    this.panel.appendChild(this.header);

    const right = document.createElement('div');
    right.classList.add('side-padding');
    this.panel.appendChild(right);

    const close = document.createElement('img');
    close.classList.add('icon', 'icon-hover', 'icon-tiny', 'popup-close');
    close.alt = 'close window';
    close.src = '../icons/close.png';
    close.addEventListener('click', () => this.detach());
    right.appendChild(close);

    this.root.appendChild(this.panel);
  }
}
