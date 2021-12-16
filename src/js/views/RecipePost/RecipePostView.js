import './RecipePostView.css';
import { View, css, icon } from '../View';
import { RecipePostPanelView } from './RecipePostPanelView';
import { RecipePostDetails } from './RecipePostDetails';
import user from '../../modules/user';
import api from '../../modules/api';

/**
 * View for users' recipe posts.
 */
export class RecipePostView extends View {
  constructor(parent, state) {
    super(parent);
    this.state = state
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
      const image = this.state.picture[0]?.filename;
      if (image) this.image.src = api.ROUTES.STATIC(image);
      this.panel.render({
        author: user.getUsers()[this.state.owner_id].name,
        name: this.state.name,
        like: this.state.like,
        comments: this.state.comment.length,
        forks: this.state.fork.length || 0,
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

    removed: listener => {
      this.#removedListener = listener;
      return this;
    },

    edit: listener => {
      if (this.editBtn)
        this.delegate('click', listener, this.editBtn)
      return this;
    }
  };

  /** @type {() => void} */
  #removedListener = undefined;
  
  #build() {
    const USER = user.getUser();
    this.root = View.element('section', css('main-item', 'card'));

    if (USER && (USER.id === this.state.owner_id || USER.admin)) {

      this.menuBar = View.element('div', css('delete'), this.root)

      const removeIcon = icon.plain(
        icon.type.CLOSE,
        icon.size.SMALL,
        css('delete', 'icon-hover')
      );
      removeIcon.addEventListener('click', async () => {
        const response = await fetch(
          api.ROUTES.RECIPE.DELETE(this.state.id),
          api.METHODS.DELETE({}, USER.token)
        );
        if (response.ok) {
          console.log('ok', await response.json());
          this.#removedListener?.call()

        } else {
          console.log(await response.json());
        }
      });

      this.editBtn = icon.plain(
        icon.type.EXPAND,
        icon.size.SMALL,
        css('edit', 'icon-hover')
      );

      this.menuBar.appendChild(this.editBtn);
      this.menuBar.appendChild(removeIcon);
    }

    this.image = View.element('img', css('food'), this.root);
    this.image.alt = 'food';
    this.panel = new RecipePostPanelView(this).attach();
    this.summary = View.element('p', css('card-content-item'), this.root);
    this.details = new RecipePostDetails(this).attach();
  }
}
