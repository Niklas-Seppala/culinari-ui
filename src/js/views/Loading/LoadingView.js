import './LoadingView.css';
import { css, View } from '../View';

/**
 * Loading View that has a cool spinner, shamelessly
 * copy pasted from https://loading.io/css/ .
 * This view has a side effect of stretching document body
 * to 100%, so it can be centered when no other content is active.
 */
export class LoadingView extends View {
  /** @param {HTMLElement|string} parent  */
  constructor(parent) {
    super(parent);
    this.#build();
  }

  #build() {
    this.root = View.element('section', css('main-item', 'centered'));
    this.root.innerHTML =
      '<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div>' +
      '<div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
  }
}
