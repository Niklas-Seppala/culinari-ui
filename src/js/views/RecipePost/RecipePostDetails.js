import { View, ExpandableView, css, icon } from '../View';
import { input } from '../Forms/inputs';
import user from '../../modules/user';
import api from '../../modules/api';
import { PromptView } from '../Popup/PromptView';

/**
 * SubView of RecipePostView of the extended content:
 * ingredients, instructions and comments.
 */
export class RecipePostDetails extends View {
  /**
   * @param {HTMLElement|string} parent
   */
  constructor(parent) {
    super(parent);
    this.#build();
  }

  /**
   * Redners state to DOM.
   *
   * @param {{
   *  ingredients: [],
   *  instructions: [],
   *  comments: []}} state
   * @returns
   */
  render(state) {
    this.state = state;
    this.#renderIngredients(state);
    this.#renderInstructions(state);
    this.#renderComments(state);
    return this;
  }

  /**
   * Renders specified recipe ingredients to DOM.
   *
   * @param {{ingredient: [{
   *   content:string,
   *   unit:string,
   *   amount:number}]}} state
   */
  #renderIngredients(state) {
    View.removeChildrend(this.ingredients);
    if (state) {
      const ingredientTable = View.element('table', css('list'));
      state.ingredient.forEach(ingr => {
        // Construct each ingredient / unit pair. We use table here.
        const row = View.element('tr', null, ingredientTable);
        const text = View.element('td', css('ingredient'), row);
        text.textContent = ingr.name;

        const amountAndUnit = View.element('td', null, row);
        amountAndUnit.textContent = `${ingr.amount} ${ingr.unit}`;
      });
      this.ingredients.appendChild(ingredientTable);
    }
  }

  /**
   * Renders specified recipe instructions to DOM.
   *
   * @param {{step: [{
   *   index: number,
   *   content: string}]}} state
   */
  #renderInstructions(state) {
    View.removeChildrend(this.instructions);

    if (state) {
      const instructionList = View.element('ol', css('instruction-list'));

      // Sort the instruction based on index field.
      const sorted = state?.step.sort((a, b) => a.order - b.order);

      sorted.forEach((instr, i) => {
        // Construct each instruction element.
        const entry = View.element('li', null, instructionList);
        const indexAndText = View.element('div', css('instruction'), entry);
        const index = View.element('span', null, indexAndText);
        index.textContent = `${i + 1}.`;
        const text = View.element('p', null, indexAndText);
        text.textContent = instr.content;
      });
      this.instructions.appendChild(instructionList);
    }
  }

  /**
   * Renders specified recipe comments to DOM.
   *
   * @param {{comment: [{
   *  timestamp: string,
   *  content:string,
   *  author: string,
   *  commentLike: number}]}} state
   */
  #renderComments(state) {
    // Remove previous comments
    while (this.comments.contentRoot.children.length > 1) {
      this.comments.contentRoot.removeChild(this.comments.contentRoot.lastChild);
    }

    if (state) {
      // A node to facilitate all of the comments.
      const commentContainer = View.element('div', null);
      const USER = user.getUser();
      state.comment?.forEach(comment => {
        const root = View.element('div', css('comment', 'card'));

        // Comment likes.
        const likes = icon.labeled(
          comment.commentLike.find(item => item.user_id === USER?.id)
            ? icon.type.LIKE_ACTIVE
            : icon.type.LIKE,
          icon.size.SMALL,
          css('icon-hover', 'icon-vert')
        );
        likes.label.textContent = comment.commentLike.length;

        likes.root.addEventListener('click', async () => {
          const USER = user.getUser();
          if (!USER) return;

          const response = await fetch(
            api.ROUTES.COMMENT.LIKE(comment.id),
            api.METHODS.POST({}, USER.token)
          );
          if (response.ok) {
            const { OP, data } = await response.json();
            const like = likes.root.getElementsByTagName('img').item(0);
            switch (OP) {
              case 'DEL':
                like.src = icon.newSrc(icon.type.LIKE);
                comment.commentLike = comment.commentLike.filter(
                  like => like.user_id !== USER.id
                );
                break;
              case 'POST':
                like.src = icon.newSrc(icon.type.LIKE_ACTIVE);
                comment.commentLike.push(data);
                break;
              default:
                break;
            }
            likes.label.textContent = comment.commentLike.length;
          }
        });

        root.appendChild(likes.root);

        // Comment author and time.
        const wrapper = View.element('div', css('comment-auth-text-date'), root);
        const authAndDate = View.element('div', css('auth-and-date'), wrapper);
        const author = View.element('span', css('comment-author'), authAndDate);
        author.textContent = user.getUsers()[comment.author_id].name;

        const dateAndRemove = View.element('div', css('date-and-remove'), authAndDate);
        const date = View.element('span', css('comment-date'), dateAndRemove);
        const datetime = new Date(comment.createdAt);
        date.textContent = `${datetime.toLocaleDateString()} ${datetime.toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'})}`

        if (USER && (USER.id === comment.author_id || USER.admin)) {
          const remove = icon.plain(icon.type.CLOSE, icon.size.TINY, css('icon-hover'));
          dateAndRemove.appendChild(remove);

          remove.addEventListener('click', () =>
            new PromptView('Delete This Comment?', async () => {
              const response = await fetch(
                api.ROUTES.COMMENT.REMOVE(comment.id),
                api.METHODS.DELETE({}, USER.token)
              );
              if (response.ok) {
                state.comment = state.comment.filter(c => c.id !== comment.id);
                commentContainer.removeChild(root);
              } else {
                console.log(await response.json());
              }
            }).attach()
          );
        }

        // Comment text content.
        const text = View.element('p', css('comment-text'), wrapper);
        text.textContent = comment.text;

        // attach
        commentContainer.appendChild(root);
      });
      // Attach comments node to DOM
      this.comments.contentRoot.appendChild(commentContainer);
    }
  }

  #build() {
    this.root = View.element('div', null);
    this.ingredients = new ExpandableView(this.root, 'Ingredients').attach().contentRoot;
    this.instructions = new ExpandableView(
      this.root,
      'Instructions'
    ).attach().contentRoot;
    this.comments = new ExpandableView(this.root, 'Comments').attach();

    // Post new comment form.
    const commentForm = View.element('form', css('leave-comment'));

    this.commentText = input('textarea', 'submit-comment', null, 'Leave a Comment');
    commentForm.appendChild(this.commentText);
    this.postComment = icon.plain(
      icon.type.POST,
      icon.size.LARGE,
      css('click', 'post-comment-btn', 'icon-hover')
    );
    commentForm.appendChild(this.postComment);

    if (user.hasUser()) this.comments.contentRoot.appendChild(commentForm);
  }
}
