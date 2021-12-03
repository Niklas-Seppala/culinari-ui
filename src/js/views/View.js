export class View {
    root = undefined;
    parent = undefined;

  get isAttached() {
    if (!this.root || !this.parent) return false;
    return this.root.parentNode === this.parent
  }

  constructor(parent) {
    this.state = undefined;
    this.parent = View.genericParent(parent);
  }

  detach() {
    if (this.isAttached) {
      this.parent.removeChild(this.root);
    }
    return this;
  }

  attach(parent) {
    if (!parent) {
      // No new parent specified, try to attach to current parent.
      this.parent.appendChild(this.root);
      return this;
    }

    const target = View.genericParent(parent);

    if (this.parent) {
      // Parent exists, detach and attach to new parent.
      this.detach();
      this.parent = target;
      this.parent.appendChild(this.root);
      return this;
    }

    // Recieved new parent, attach to it.
    this.parent = target;
    this.parent.appendChild(this.root);
    return this;
  }

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
