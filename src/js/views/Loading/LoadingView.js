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

  /**
   * Add root of this View to child of the parent.
   * of this View. Stretches document body to 100%, so
   * that this view can be at the center of the screen.
   *
   * @override
   * @param {HTMLElement|string} parent id or dom element
   * @returns {this} this
   */
  attach(parent) {
    document.body.classList.add('body-stretch')
    return super.attach(parent);
  }

  detach() {
     // Reverse body-stretch.
    document.body.classList.remove('body-stretch') 
    return super.detach();
  }

  #build() {
    this.root = View.element('section', css('main-item', 'centered'));
    this.root.innerHTML =
      '<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div>' + 
      '<div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
  }
}
