import { PopupView } from '../Popup/PopupView';
import './AboutView.css'

export class AboutView extends PopupView {
  constructor(parent, header) {
    super(parent, header)
    this.detach();
    this.#build()
    this.content.classList.remove('display-none')
  }

  #build() {
    this.content = document.getElementById('about')
    this.root.appendChild(this.content)
  }
}
