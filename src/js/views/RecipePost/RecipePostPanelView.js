import { View, icon, css } from '../View';

/**
 * Sub view of the recipe's info panel for RecipePostView.
 */
export class RecipePostPanelView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  #build() {
    this.root = View.element('div', css('post-panel'));

    const classes = css('icon-hover', 'icon-vert');
    this.likes = icon.labeled(icon.type.LIKE, icon.size.SMALL, classes);
    this.comments = icon.labeled(icon.type.COMMENT, icon.size.SMALL, classes);
    this.forks = icon.labeled(icon.type.FORK, icon.size.SMALL, classes);

    this.root.appendChild(this.likes.root);
    this.root.appendChild(this.comments.root);
    this.root.appendChild(this.forks.root);

    const header = View.element('div', css('post-header', 'column'), this.root);
    this.name = View.element('h3', null, header);
    this.author = View.element('span', null, header);
  }

  render(state) {
    if (state) this.state = state;
    if (this.state) {
      this.likes.label.textContent = this.state.likes;
      this.comments.label.textContent = this.state.comments;
      this.forks.label.textContent = this.state.forks;
      this.name.textContent = this.state.name;
      this.author.textContent = this.state.author;
    }
  }
}
