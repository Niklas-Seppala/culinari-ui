/**
 * Base class for Views. An instance of View class
 * keeps track of it's parent, and simplifies
 * attaching and detaching it.
 */
export class View {
  /** @type {HTMLElement} */
  parent;
  /** @type {HTMLElement} */
  root;

  constructor(parent) {
    this.parent = View.genericParent(parent);
  }

  get isAttached() {
    if (!this.root || !this.parent) return false;
    return this.root.parentNode === this.parent;
  }

  /**
   * Remove root of this View from children of the parent.
   * of this View.
   *
   * @returns {this} this
   */
  detach() {
    if (this.isAttached) {
      this.parent.removeChild(this.root);
    }
    return this;
  }

  /**
   * Set visibility of this View.
   *    true  --> visible
   *    false --> invisible
   *
   * @param {boolean} isVisible
   */
  set visibility(isVisible) {
    if (isVisible) this.root.classList.remove('display-none');
    else this.root.classList.add('display-none');
  }

  /**
   * Add root of this View to child of the parent.
   * of this View.
   *
   * @param {HTMLElement|string} parent id or dom element
   * @returns {this} this
   */
  attach(parent) {
    // Make sure View is visible
    this.visibility = true;

    if (!parent) {
      // No new parent specified, try to attach to current parent.
      this.parent.appendChild(this.root);
      return this;
    }

    const parentElement = View.genericParent(parent);
    if (this.parent) {
      // Parent exists, detach and attach to new parent.
      this.detach();
      this.parent = parentElement;
      this.parent.appendChild(this.root);
      return this;
    }

    // Recieved new parent, attach to it.
    this.parent = parentElement;
    this.parent.appendChild(this.root);
    return this;
  }

  /**
   * Delegates DOM event to specified listener.
   *
   * @param {Event} event
   * @param {((e: Event) => void)} listener
   * @param {HTMLElement} element
   * @returns {this} this
   */
  delegate(event, listener, element) {
    element.addEventListener(event, listener);
    return this;
  }

  /**
   * A condensed way of creating DOM elements.
   *
   * @param {string} tag DOM element tag
   * @param {[string]?} css optional list of css classes
   * @param {HTMLElement?} parent optional parent
   * @returns {HTMLElement} element
   */
  static element(tag, css, parent, id) {
    const elem = document.createElement(tag);
    css?.forEach(_class => elem.classList.add(_class));
    parent?.appendChild(elem);
    if (id) elem.id = id;
    return elem;
  }

  /**
   * Converts generic parent to HTML element.
   *
   * @param {string|View} parent generic parent
   * @returns {HTMLElement} parent dom element
   */
  static genericParent(parent) {
    let result = parent;
    if (typeof parent === 'string') {
      result = document.getElementById(parent);
    } else if (parent instanceof View) {
      result = parent.root;
    }
    return result;
  }
}

/**
 * Icon creation utility object.
 */
const icon = {
  type: {
    LIKE: 0,
    COMMENT: 1,
    FORK: 2,
    TIME: 3,
    EXPAND: 4,
    FILE: 5,
    CLOSE: 6,
  },
  src: [
    ['../icons/heart.png', 'like'],
    ['../icons/comment.png', 'comment'],
    ['../icons/fork.png', 'fork'],
    ['../icons/time.png', 'duration'],
    ['../icons/more-dots.png', 'expand'],
    ['../icons/file.png', 'file'],
    ['../icons/close.png', 'close'],
  ],
  size: {
    SMALL: 'icon-small',
    TINY: 'icon-tiny',
    MEDIUM: 'icon-medium',
    LARGE: 'icon-large',
    HUGE: 'icon-huge',
  },

  /**
   * Creates icon with label.
   *
   * @param {number} type Type enum
   * @param {number} size Size enum
   * @param {[string]} css Array of css classes
   * @returns {{root: HTMLDivElement, label: HTMLSpanElement}} root and label
   */
  labeled: (type, size, css) => {
    const root = document.createElement('div');
    root.classList.add('icon-label', 'column');

    const iconElement = document.createElement('img');

    iconElement.classList.add('icon');
    iconElement.classList.add(size);
    css?.forEach(c => iconElement.classList.add(c));
    iconElement.src = icon.src[type][0];
    iconElement.alt = icon.src[type][1];

    const label = document.createElement('span');
    label.classList.add(size);

    root.appendChild(iconElement);
    root.appendChild(label);
    root.classList.add('icon-gutter');
    return { root, label };
  },

  /**
   * Creates plain icon.
   *
   * @param {number} type Type enum.
   * @param {number} size Size enum.
   * @param {[string]} css Array of css classes
   * @returns {HTMLDivElement} root
   */
  plain: (type, size, css) => {
    const root = document.createElement('div');
    const iconElem = document.createElement('img');

    iconElem.classList.add('icon');
    iconElem.classList.add(size);

    css?.forEach(cls => iconElem.classList.add(cls));
    iconElem.src = icon.src[type][0];
    iconElem.alt = icon.src[type][1];
    root.appendChild(iconElem);
    root.classList.add('icon-gutter');
    return root;
  },
};

/**
 * Varargs wrapper for css classes.
 * @param {[string]} classes css classes
 * @returns {[string]} classes as an array
 */
const css = (...classes) => classes;

export { icon, css };
