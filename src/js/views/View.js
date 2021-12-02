export class View {
  dom = {
    root: undefined,
    parent: undefined
  }

  get isAttached() {
    if (!this.dom.root || !this.dom.parent) return false;
    return this.dom.root.parentNode === this.dom.parent
  }

  constructor() {
    this.state = undefined;
  }

  detach() {
    if (this.isAttached) {
      this.dom.parent.removeChild(this.dom.root);
    }
    return this;
  }

  attach(parent) {
    if (!parent) {
      // No new parent specified, try to attach to current parent.
      this.dom.parent.appendChild(this.dom.root);
      return this;
    }

    let target = parent;
    if (parent instanceof View) target = parent.dom.root;

    if (this.dom.parent) {
      // Parent exists, detach and attach to new parent.
      this.detach();
      this.dom.parent = target;
      this.dom.parent.appendChild(this.dom.root);
      return this;
    }

    // Recieved new parent, attach to it.
    this.dom.parent = target;
    this.dom.parent.appendChild(this.dom.root);
    return this;
  }

  static genericParent(parent) {
    return parent instanceof View ? parent.dom.root : parent;
  }
}
