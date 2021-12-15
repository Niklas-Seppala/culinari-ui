import { PopupView } from '../Popup/PopupView';

export class AboutView extends PopupView {
  constructor(parent, header) {
    super(parent, header)
    this.detach();
    this.#build()
  }

  #build() {
    this.root.appendChild(document.getElementById('about'))
  }
}
