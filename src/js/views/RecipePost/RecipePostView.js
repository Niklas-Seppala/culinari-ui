import './RecipePostView.css';
import { View, css } from '../View';
import { RecipePostPanelView } from './RecipePostPanelView';
import { RecipePostDetails } from './RecipePostDetails';

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
        likes: this.state.likes,
        comments: this.state.comments.length,
        forks: this.state.forks,
      });
      this.summary.textContent = this.state.summary;

      this.details.render(this.state);
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

    this.details = new RecipePostDetails(this.root).attach();
  }
}
