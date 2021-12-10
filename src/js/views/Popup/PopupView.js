import './PopupView.css';
import { View, css, icon } from '../View';

/**
 * Base class for popup views. Holds the popup root element
 * and top bar with header and close button.
 */
export class PopupView extends View {
  constructor(parent, header) {
    super(parent);
    this.#build(header);
  }

  closeListener;
  onClose(f) {
    this.closeListener = f;
  }

  #build(header) {
    this.root = View.element('div', css('card', 'popup'));
    this.panel = View.element('div', css('popup-panel'), this.root);

    // Left side padding
    View.element('div', css('side-padding'), this.panel);

    // Popup header
    this.header = View.element('h2', null, this.panel);
    this.header.textContent = header;

    // Close icon on the right side.
    const right = View.element('div', css('side-padding'), this.panel);
    const ic = icon.plain(
      icon.type.CLOSE,
      icon.size.TINY,
      css('icon-hover', 'popup-close')
    );

    ic.addEventListener('click', () => {
      this.closeListener?.call();
      this.detach();
    });

    right.appendChild(ic);
  }
}
