import { View, ExpandableView, css, icon } from '../View';
import { input } from '../Forms/inputs';
import user from '../../modules/user';

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
   *  likes: number}]}} state
   */
  #renderComments(state) {
    // Remove previous comments
    while (this.comments.contentRoot.children.length > 1) {
      this.comments.contentRoot.removeChild(this.comments.contentRoot.lastChild);
    }

    if (state) {
      // A node to facilitate all of the comments.
      const commentContainer = View.element('div', null);

      const now = new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000;
      state.comment.forEach(comment => {
        const root = View.element('div', css('comment', 'card'));

        // Comment likes.
        const likes = icon.labeled(
          icon.type.LIKE,
          icon.size.SMALL,
          css('icon-hover', 'icon-vert')
        );
        likes.label.textContent = comment.likes || 0;
        root.appendChild(likes.root);

        // Comment author and time.
        const wrapper = View.element('div', css('comment-auth-text-date'), root);
        const authAndDate = View.element('div', css('auth-and-date'), wrapper);
        const author = View.element('span', css('comment-author'), authAndDate);
        author.textContent = user.getUsers()[comment.author_id].name;
        const date = View.element('span', css('comment-date'), authAndDate);

        // TODO: EXTRACT LATER
        const timeDiff = new Date(now - new Date(comment.createdAt).getTime());
        const h = timeDiff.getHours();
        const hourStr = `${h !== 0 ? h : ''} ${timeDiff.getHours() !== 0 ? 'h' : ''}`;
        const timeStr = `${hourStr || ''} ${timeDiff.getMinutes()}min`;
        date.textContent = timeStr;

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

  on = {
    comment: post =>
      this.postComment.addEventListener('click', post(this.commentText.textContent)),
  };

  #build() {
    this.root = View.element('div', null);
    this.ingredients = new ExpandableView(this.root, 'Ingredients').attach().contentRoot;
    this.instructions = new ExpandableView(
      this.root,
      'Instructions'
    ).attach().contentRoot;
    this.comments = new ExpandableView(this.root, 'Comments').attach();

    // Post new comment form.
    const commentForm = View.element('form', css('leave-comment'), this.comments.contentRoot);
    this.commentText = input('textarea', 'submit-comment', null, 'Leave a Comment');
    commentForm.appendChild(this.commentText);
    this.postComment = icon.plain(
      icon.type.POST,
      icon.size.LARGE,
      css('click', 'post-comment-btn', 'icon-hover')
    );
    commentForm.appendChild(this.postComment);
  }
}
