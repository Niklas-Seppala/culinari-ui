export class View {
    root = undefined;
    parent = undefined;

  get isAttached() {
    if (!this.root || !this.parent) return false;
    return this.root.parentNode === this.parent
  }

  constructor() {
    this.state = undefined;
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

    let target = parent;
    if (parent instanceof View) target = parent.root;

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
    return parent instanceof View ? parent.root : parent;
  }
}
