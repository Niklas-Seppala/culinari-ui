import './SearchView.css';
import { css, View } from '../View';
import { input } from '../Forms/inputs';

/**
 * View for content searching.
 */
export class SearchView extends View {
  constructor(parent) {
    super(parent);
    this.#build();
  }

  clear() {
    this.search.value = '';
  }

  /**
   * Renders current state to browser.
   *
   * @param {{value: string}} state
   * @returns {this} this
   */
  render(state) {
    if (state) this.state = state;
    if (this.state) {
      this.search.value = this.state.value;
    }
    return this;
  }

  /** View events */
  on = {
    /** @param {(e: Event) => void} listener */
    search: listener => this.delegate('input', listener, this.search),
  };

  #build() {
    this.root = View.element('div', css('search-bar'), null, 'search-view');
    this.search = input('text', '', 'search-text', 'Search Recipes');
    this.state = { value: '' };
    this.search.addEventListener('input', _ => (this.state.value = this.search.value));
    this.root.appendChild(this.search);
  }
}
