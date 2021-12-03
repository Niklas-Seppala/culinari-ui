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
