import './AboutView.css'
import { View } from '../View';

export class AboutView extends View {
  constructor(parent) {
    super(parent)
    this.#build()
    this.detach();
  }

  #build() {
    this.root = document.getElementById('about');
  }
}
