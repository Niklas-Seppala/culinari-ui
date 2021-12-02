import './SearchView.css';
import { View } from '../View';

export class SearchView extends View {
  constructor(parent) {
    super();
    this.#build(parent);
  }

  state = {
    value: '',
  };

  clear() {
    this.search.value = '';
    this.#onClear.forEach(handler => handler(this.state));
  }

  render(state) {
    if (state) this.state = state;
    if (this.state) {
      this.search.value = this.state.value;
    }
    return this;
  }

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

  #build(parent) {
    this.parent = View.genericParent(parent)

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
    this.root = searchBar;
    this.search = searchText;
  }
}
