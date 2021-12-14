/**
 * Varargs wrapper for css classes.
 * @param {[string]} classes css classes
 * @returns {[string]} classes as an array
 */
const __css = (...classes) => classes;

/**
 * Icon creation utility object.
 */
const __icon = {
  type: {
    LIKE: 0,
    COMMENT: 1,
    FORK: 2,
    TIME: 3,
    EXPAND: 4,
    FILE: 5,
    CLOSE: 6,
    DOWN_ARROW: 7,
    POST: 8,
    SEND: 9,
    LIKE_ACTIVE: 10
  },
  src: [
    ['./icons/heart.png', 'like'],
    ['./icons/comment.png', 'comment'],
    ['./icons/fork.png', 'fork'],
    ['./icons/time.png', 'duration'],
    ['./icons/more-dots.png', 'expand'],
    ['./icons/file.png', 'file'],
    ['./icons/close.png', 'close'],
    ['./icons/down.png', 'down'],
    ['./icons/post.png', 'post'],
    ['./icons/send.png', 'send'],
    ['./icons/heart-filled.png', 'like-active'],
  ],
  size: {
    SMALL: 'icon-small',
    TINY: 'icon-tiny',
    MEDIUM: 'icon-medium',
    LARGE: 'icon-large',
    HUGE: 'icon-huge',
  },

  newSrc: (type) => {
    return __icon.src[type][0]
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
    iconElement.src = __icon.src[type][0];
    iconElement.alt = __icon.src[type][1];

    const label = document.createElement('span');
    label.classList.add(size);

    root.appendChild(iconElement);
    root.appendChild(label);
    return { root, label };
  },

  /**
   * Creates plain icon.
   *
   * @param {number} type Type enum.
   * @param {number} size Size enum.
   * @param {[string]} css Array of css classes
   * @returns {HTMLImageElement} Icon
   */
  plain: (type, size, css) => {
    const icon = View.element('img', __css('icon', size).concat(css));
    icon.src = __icon.src[type][0];
    icon.alt = __icon.src[type][1];
    return icon;
  },
};

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

  /**
   *
   * @param {HTMLElement|string|View} parent
   */
  constructor(parent) {
    this.parent = View.resolveParent(parent);
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

    // Try to detach (if attached)
    this.detach();
    if (parent) this.parent = View.resolveParent(parent);

    this.parent.appendChild(this.root);
    return this;
  }

  /**
   * Inject the root of this View to the parent.
   * of this View.
   *
   * @param {number} position injection position
   * @param {HTMLElement|string} parent id or dom element
   * @returns {this} this
   */
  inject(position, parent) {
    // Make sure View is visible
    this.visibility = true;

    // Try to detach (if attached)
    this.detach();
    if (parent) this.parent = View.resolveParent(parent);

    if (this.parent.children.length <= position) {
      // Parent doesnt have enough children to begin with, just append.
      this.parent.appendChild(this.root);
    } else {
      this.parent.insertBefore(this.root, this.parent.children[position]);
    }

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
    View.resolveParent(parent)?.appendChild(elem);
    // parent?.appendChild(elem);
    if (id) elem.id = id;
    return elem;
  }

  /**
   * Converts generic parent to HTML element.
   *
   * @param {string|View} parent generic parent
   * @returns {HTMLElement} parent dom element
   */
  static resolveParent(parent) {
    let result = parent;
    if (typeof parent === 'string') {
      result = document.getElementById(parent);
    } else if (parent instanceof View) {
      result = parent.root;
    }
    return result;
  }

  /**
   *
   * @param {HTMLElement} parent
   */
  static removeChildrend(parent) {
    while (parent.lastChild) parent.removeChild(parent.lastChild);
  }
}

export class ExpandableView extends View {
  /** @type {HTMLDivElement} */
  contentRoot;

  constructor(parent, header) {
    super(parent);
    this.#build(header);
    this.active = false;
  }

  /**
   *
   * @param {string} text
   */
  #build(text) {
    this.root = View.element('div', __css('card-content-item'));

    const headerWrapper = View.element('div', __css('header-w-icon', 'click'), this.root);
    this.header = View.element('h4', __css(), headerWrapper);
    this.header.textContent = text;
    // Rotating icon.
    this.headerIcon = __icon.plain(
      __icon.type.DOWN_ARROW,
      __icon.size.SMALL,
      __css('icon-rotateable')
    );
    headerWrapper.appendChild(this.headerIcon);

    // View contents are mounted to this.
    this.contentRoot = View.element('div', __css('expandable-content'));

    // Rotate animation and content display.
    headerWrapper.addEventListener('click', () => this.toggle());
  }

  toggle() {
    this.headerIcon.classList.toggle('icon-rotate');
    if (this.active) this.root.removeChild(this.contentRoot);
    else this.root.appendChild(this.contentRoot);
    this.active = !this.active;
  }
}

export { __icon as icon, __css as css };
