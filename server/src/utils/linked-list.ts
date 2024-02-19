export default class LinkedList<T> {
  private _size = 0;

  first: Node<T> | null = null;
  last: Node<T> | null = null;

  constructor(...initialItems: T[]) {
    for (const item of initialItems) {
      this.addLast(item);
    }
  }

  addLast(value: T) {
    const newNode = { value, next: null } as Node<T>;
    if (!this.last || !this.first) this.last = this.first = newNode;
    else {
      this.last.next = newNode;
      this.last = newNode;
    }

    this._size++;
  }

  removeLast() {
    if (!this.first || !this.last) return;

    this._size--;
    if (this.first === this.last) {
      this.first = this.last = null;
      return;
    }

    const previous = this.getPrevious(this.last)!;
    this.last = previous;
    previous.next = null;
  }

  addFirst(value: T) {
    const newNode = { value, next: null } as Node<T>;
    if (!this.last || !this.first) this.first = this.last = newNode;
    else {
      newNode.next = this.first;
      this.first = newNode;
    }

    this._size++;
  }

  removeFirst() {
    if (!this.first || !this.last) return;

    const node = this.first;
    this.first = this.first.next;

    this._size--;
    return node;
  }

  getPrevious(node: Node<T>) {
    let currNode = this.first;
    while (currNode) {
      if (currNode.next === node) return currNode;
      currNode = currNode.next;
    }

    return null;
  }

  forEach(callback: (value: T, index: number) => void) {
    let currNode = this.first;
    let currIndex = 0;
    while (currNode) {
      callback(currNode.value, currIndex++);
      currNode = currNode.next;
    }
  }

  some(callback: (value: T, index: number) => boolean) {
    let currNode = this.first;
    let currIndex = 0;
    while (currNode) {
      const res = callback(currNode.value, currIndex++);
      if (res) return true;
      currNode = currNode.next;
    }
    return false;
  }

  clear() {
    this.first = this.last = null;
    this._size = 0;
  }

  get size() {
    return this._size;
  }
}

type Node<T> = {
  value: T;
  next: Node<T> | null;
};
