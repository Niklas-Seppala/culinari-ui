export class View {
  dom = {
    root: undefined,
    parent: undefined
  }

  constructor() {
    this.state = undefined;
    this.mounted = false;
  }

  detach() {
    if (this.mounted) {
      this.dom.parent.removeChild(this.dom.root);
      this.mounted = false;
    }
    return this;
  }

  attach(parent) {
    if (!parent) {
      // No new parent specified, try to attach to current parent.
      this.dom.parent.appendChild(this.dom.root);
      this.mounted = true;
      return this;
    }

    let target = parent;
    if (parent instanceof View) target = parent.dom.root;

    if (this.dom.parent) {
      // Parent exists, detach and attach to new parent.
      this.detach();
      this.dom.parent = target;
      this.dom.parent.appendChild(this.dom.root);
      this.mounted = true;
      return this;
    }

    // Recieved new parent, attach to it.
    this.dom.parent = target;
    this.dom.parent.appendChild(this.dom.root);
    this.mounted = true;

    return this;
  }
}
