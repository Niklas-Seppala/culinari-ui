import { View, icon } from '../View';

export class FoodPostPanelView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  #build() {
    this.root = document.createElement('div');
    this.root.classList.add('post-panel');

    const css = ['icon-hover'];
    this.likes = icon.labeled(icon.type.LIKE, icon.size.SMALL, css);
    this.comments = icon.labeled(icon.type.COMMENT, icon.size.SMALL, css);
    this.forks = icon.labeled(icon.type.FORK, icon.size.SMALL, css);
    this.time = icon.labeled(icon.type.TIME, icon.size.SMALL, css);
    this.time.root.classList.add('cooking-time');

    this.root.appendChild(this.likes.root);
    this.root.appendChild(this.comments.root);
    this.root.appendChild(this.forks.root);
    this.root.appendChild(this.time.root);

    const panelHeader = document.createElement('div');
    panelHeader.classList.add('post-header', 'column');

    this.header = document.createElement('h3');
    this.author = document.createElement('span');
    panelHeader.appendChild(this.header);
    panelHeader.appendChild(this.author);

    this.root.appendChild(panelHeader);
  }

  render(state) {
    if (state) this.state = state;
    if (this.state) {
      this.likes.label.textContent = this.state.likes;
      this.comments.label.textContent = this.state.comments.count;
      this.forks.label.textContent = this.state.forks;
      this.time.label.textContent = this.state.time;
      this.header.textContent = this.state.name;
      this.author.textContent = this.state.author;
    }
  }
}
