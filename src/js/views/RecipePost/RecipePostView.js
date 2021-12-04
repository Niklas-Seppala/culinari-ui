import './RecipePostView.css';
import { View, icon, css } from '../View';
import { RecipePostPanelView } from './RecipePostPanelView';

/**
 * View for users' recipe posts.
 */
export class RecipePostView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  render(state) {
    if (state) this.state = state;
    if (this.state) {
      this.image.src = this.state.image;
      this.panel.render({
        author: this.state.author,
        name: this.state.name,
        time: this.state.time,
        likes: this.state.likes,
        comments: this.state.comments.count,
        forks: this.state.forks,
      });
      this.summary.textContent = this.state.summary;
    }
    return this;
  }

  /** View events */
  on = {
    /** @param {(e: Event) => void} cb */
    likeClicked: cb => this.delegate('click', cb, this.panel.likes.root),

    /** @param {(e: Event) => void} cb */
    commentClicked: cb => this.delegate('click', cb, this.panel.comments.root),

    /** @param {(e: Event) => void} cb */
    forkClicked: listener => this.delegate('click', listener, this.panel.forks.root),

    /** @param {(e: Event) => void} cb */
    expandClicked: listener => this.delegate('click', listener, this.expBtn),
  };

  #build() {
    this.root = View.element('section', css('main-item', 'card'));

    this.image = View.element('img', css('food'), this.root);
    this.image.alt = 'food';

    this.panel = new RecipePostPanelView(this).attach();
    this.summary = View.element('p', css('card-content-item'), this.root);

    // Expand button
    this.expBtn = icon.plain(icon.type.EXPAND, icon.size.MEDIUM, css('icon-hover'));
    this.expBtn.classList.add('card-item-center');
    this.root.appendChild(this.expBtn);
  }
}
