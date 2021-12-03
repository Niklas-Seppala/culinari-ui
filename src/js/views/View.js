export class View {
    root = undefined;
    parent = undefined;

  get isAttached() {
    if (!this.root || !this.parent) return false;
    return this.root.parentNode === this.parent
  }

  constructor(parent) {
    this.parent = View.genericParent(parent);
  }

  detach() {
    if (this.isAttached) {
      this.parent.removeChild(this.root);
      this.#detachListeners.forEach(f => f())
    }
    return this;
  }

  attach(parent) {
    this.root.classList.remove('display-none')

    if (!parent) {
      // No new parent specified, try to attach to current parent.
      this.parent.appendChild(this.root);
      this.#attachListeners.forEach(f => f())
      return this;
    }

    const target = View.genericParent(parent);
    if (this.parent) {
      // Parent exists, detach and attach to new parent.
      this.detach();
      this.parent = target;
      this.parent.appendChild(this.root);
      this.#attachListeners.forEach(f => f())
      return this;
    }

    // Recieved new parent, attach to it.
    this.parent = target;
    this.parent.appendChild(this.root);
    this.#attachListeners.forEach(f => f())
    return this;
  }

  #attachListeners = [];
  #detachListeners = [];
  on = {
    attach: listener => {
      this.#attachListeners.push(listener)
      return this;
    },
    detach: listener => {
      this.#detachListeners.push(listener)
      return this;
    },
  };

  static genericParent(parent) {
    let result = parent;
    if (typeof parent === 'string') {
      let element = document.getElementById(parent);
      if (element) result = element;
    } else if (parent instanceof View) {
      result = parent.root;
    }
    return result;
  }
}

const icon = {
  type: {
    LIKE: 0,
    COMMENT: 1,
    FORK: 2,
    TIME: 3,
    EXPAND: 4,
  },
  src: [
    ['../icons/heart.png', 'like'],
    ['../icons/comment.png', 'comment'],
    ['../icons/fork.png', 'fork'],
    ['../icons/time.png', 'duration'],
    ['../icons/more-dots.png', 'expand'],
  ],
  size: {
    SMALL: 'icon-small',
    TINY: 'icon-tiny',
    MEDIUM: 'icon-medium',
    LARGE: 'icon-large',
    HUGE: 'icon-huge'
  },

  labeled: (type, size, css) => {
    const root = document.createElement('div');
    root.classList.add('icon-label', 'column');

    const iconElement = document.createElement('img');
    
    iconElement.classList.add('icon')
    iconElement.classList.add(size)
    css?.forEach(c => iconElement.classList.add(c))
    iconElement.src = icon.src[type][0];
    iconElement.alt = icon.src[type][1];

    const label = document.createElement('span');
    label.classList.add(size)

    root.appendChild(iconElement);
    root.appendChild(label);
    return { root, label };
  },
  plain: (type, size, css) => {
    const root = document.createElement('div');
    const iconElem = document.createElement('img');

    iconElem.classList.add('icon')
    iconElem.classList.add(size)

    css?.forEach(c => iconElem.classList.add(c))
    iconElem.src = icon.src[type][0];
    iconElem.alt = icon.src[type][1];
    root.appendChild(iconElem);
    return [root];
  }
};

export {icon};