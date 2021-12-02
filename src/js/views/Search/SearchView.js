import './SearchView.css';
import { View } from '../View';

export class SearchView extends View {
  dom = {
    parent: undefined,
    root: undefined,
    search: undefined,
  };

  state = {
    value: '',
  };

  #onSearch = [];
  #onClear = [];
  on = {
    search: listener => {
      this.#onSearch.push(listener);
      return this;
    },
    clear: listener => {
      this.#onClear.push(listener);
      return this;
    },
  };

  clear() {
    this.dom.search.value = '';
    this.#onClear.forEach(handler => handler(this.state));
  }

  #build() {
    const searchBar = document.createElement('div');
    searchBar.classList.add('search-bar');
    searchBar.id = 'search-view';

    const searchText = document.createElement('input');
    searchText.type = 'text';
    searchText.id = 'search-text';
    searchText.placeholder = 'Search Food';

    searchText.addEventListener('input', _ => {
      this.state.value = searchText.value;
      this.#onSearch.forEach(handler => handler(this.state));
    });

    searchBar.appendChild(searchText);
    this.dom.root = searchBar;
    this.dom.search = searchText;
  }

  #setState(state) {
    if (state) this.state = state;
    if (this.state) {
      this.dom.search.value = this.state.value;
    }
  }

  render(state) {
    this.#setState(state);
    return this;
  }

  constructor(parent) {
    super();
    this.dom.parent = parent instanceof View ? parent.dom.root : parent;
    this.#build();
  }
}
