import './RecipePostView.css';
import { View, css } from '../View';
import { RecipePostPanelView } from './RecipePostPanelView';
import { RecipePostDetails } from './RecipePostDetails';
import user from '../../modules/user';

/**
 * View for users' recipe posts.
 */
export class RecipePostView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  renderPanel(state) {
    if (state) this.state = state;
    if (this.state) {
      this.panel.render({
        author: user.getUsers()[this.state.owner_id].name,
        name: this.state.name,
        like: this.state.like,
        comments: this.state.comment.length,
        forks: this.state.forks || 0,
      });
    }
    return this;
  }

  render(state) {
    if (state) this.state = state;
    if (this.state) {
      this.image.src = this.state.picture[0];
      this.panel.render({
        author: user.getUsers()[this.state.owner_id].name,
        name: this.state.name,
        like: this.state.like,
        comments: this.state.comment.length,
        forks: this.state.forks || 0,
      });
      this.summary.textContent = this.state.desc;
      this.details.render(this.state);
    }
    return this;
  }

  /** View events */
  on = {
    /** @param {(e: Event) => void} cb */
    likeClicked: cb => {
      this.delegate('click', cb, this.panel.likes.root);
      return this;
    },

    /** @param {(e: Event) => void} cb */
    commentClicked: cb => {
      this.delegate('click', cb, this.panel.comments.root);
      return this;
    },

    /** @param {(e: Event) => void} cb */
    forkClicked: listener => {
      this.delegate('click', listener, this.panel.forks.root);
      return this;
    },

    /** @param {(e: Event) => void} cb */
    expandClicked: listener => {
      this.delegate('click', listener, this.expBtn);
      return this;
    },

    /**
     * @param {{(recipe: number) => void}} postComment
     */
    comment: postComment => {
      this.details.postComment.addEventListener('click', () => {
        postComment();
        this.details.commentText.value = '';
      });
      return this;
    },
  };

  #build() {
    this.root = View.element('section', css('main-item', 'card'));
    this.image = View.element('img', css('food'), this.root);
    this.image.alt = 'food';
    this.panel = new RecipePostPanelView(this).attach();
    this.summary = View.element('p', css('card-content-item'), this.root);
    this.details = new RecipePostDetails(this).attach();
  }
}
