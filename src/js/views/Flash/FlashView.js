import './FlashView.css';
import { css, icon, View } from '../View';

/**
 * Message flash view. Specify message, type and
 * optional duration of the flash.
 */
export class FlashView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  /**
   * Renders view state to browser.
   * @param {{message: string, type: string, duration: number}}
   *   state Flash state object
   * @returns {this}
   */
  render(state) {
    if (state) this.state = state;
    if (this.state) {
      this.message.textContent = this.state.message || '';
      this.root.classList.remove('error', 'success');
      this.root.classList.add(this.state.type);

      if (this.isAttached && this.state.duration)
        this.#detachAfterMS(this.state.duration);
    }
    return this;
  }

  attach(parent) {
    if (this.state.duration) this.#detachAfterMS(this.state.duration);
    return super.attach(parent);
  }

  #detachAfterMS(duration) {
    setTimeout(() => this.detach(), duration);
  }

  #build() {
    this.root = View.element('div', css('flash-msg'));
    // Left side padding
    View.element('div', css('side-padding'), this.root);

    this.message = View.element('p', css('msg-content'), this.root);

    // Close icon on the right side.
    const right = View.element('div', css('side-padding'), this.root);

    this.close = icon.plain(icon.type.CLOSE, icon.size.SMALL, css('icon-hover'));
    this.close.addEventListener('click', e => this.detach());
    right.appendChild(this.close);
  }
}
