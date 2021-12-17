import { css, View } from '../View';
import { PopupView } from './PopupView';

export class PromptView extends PopupView {
  constructor(header, yes, no) {
    super('main', header)
    this.#build()
    this.noCb = no
    this.yesCb = yes
  }

  #build() {
    const promptRoot = View.element('div', css('yes-no-prompt', 'card-content-item'), this.root);

    const close = this.root.getElementsByClassName('popup-close').item(0)
    close.parentElement.removeChild(close);

    this.no = View.element('button', css('btn'), promptRoot);
    this.no.textContent = 'No';
    this.yes = View.element('button', css('btn'), promptRoot);
    this.yes.textContent = 'Yes';

    this.yes.addEventListener('click', () => {
      this.detach();
      this.yesCb?.call()
    });
    this.no.addEventListener('click', () => {
      this.detach()
      this.noCb?.call()
    });
  }
}
