import './FoodPostView.css';
import { View, icon } from '../View';
import { FoodPostPanelView } from './FoodPostPanelView';

export class FoodPostView extends View {
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
        comments: this.state.comments,
        forks: this.state.forks,
      });
      this.summary.textContent = this.state.summary;
    }
    return this;
  }

  #likedListeners = [];
  #commentListeners = [];
  #forkListenres = [];
  #expandListeners = [];
  on = {
    likeClicked: listener => {
      this.#likedListeners.push(listener);
      return this;
    },
    commentClicked: listener => {
      this.#commentListeners.push(listener);
      return this;
    },
    forkClicked: listener => {
      this.#forkListenres.push(listener);
      return this;
    },
    expandClicked: listener => {
      this.#expandListeners.push(listener);
      return this;
    },
  };

  #build() {
    this.root = document.createElement('section');
    this.root.classList.add('main-item', 'card');

    // Image
    this.image = document.createElement('img');
    this.image.classList.add('food');
    this.image.alt = 'food';
    this.root.appendChild(this.image);

    // Panel
    this.panel = new FoodPostPanelView(this).attach();
    this.panel.likes.root.addEventListener('click', e =>
      this.#likedListeners.forEach(f => f())
    );
    this.panel.comments.root.addEventListener('click', e =>
      this.#commentListeners.forEach(f => f())
    );
    this.panel.forks.root.addEventListener('click', e =>
      this.#forkListenres.forEach(f => f())
    );

    // Summary
    this.summary = document.createElement('p');
    this.summary.classList.add('card-content-item');
    this.root.appendChild(this.summary);

    // Expand button
    const [expandBtn] = icon.plain(icon.type.EXPAND, icon.size.MEDIUM);
    expandBtn.classList.add('card-item-center');
    this.root.appendChild(expandBtn);
    expandBtn.addEventListener('click', e => this.#expandListeners.forEach(f => f()));
  }
}
