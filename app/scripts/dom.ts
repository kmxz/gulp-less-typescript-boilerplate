// module for DOM operations

module Dom {

  // remove all children of an element
  export var clearElement = function (element: Node): void {
    while (element.lastChild) {
      element.removeChild(element.lastChild);
    }
  };

  // set attributes and styles of an object
  export var setElement = function (element: HTMLElement, options: {[name: string]: any}): void {
    Object.keys(options).forEach(function (i: string) {
      var v = options[i];
      if (i === 'style') {
        Object.keys(v).forEach(function (j: string) {
          element.style[j] = v[j];
        });
      } else if (i === 'className' || i === 'class') {
        if (options[i] instanceof Array) {
          element.className = options[i].join(' ');
        } else {
          element.className = options[i];
        }
      } else {
        element.setAttribute(i, v);
      }
    });
  };

  type HTMLNode = HTMLElement | string;

  // append children (nodes or text) to an element
  export var appendChildren = function (element: HTMLElement, children: Array<HTMLNode> | HTMLNode, clearBefore?: boolean): void {
    if (clearBefore) { clearElement(element); }
    var add = function (child: HTMLNode) {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      } else {
        throw 'Unsupported child.';
      }
    };
    if (children instanceof Array) {
      children.forEach(add);
    } else {
      add(<HTMLNode>children);
    }
  };

  type EventListener = (Event) => void;

  // create an element with specific attributes/styles, children and event listeners; use tool to convert HTML to this: https://gist.github.com/kmxz/434034c2d09e87dbf373
  export var $ = function (tag: string, options?: any, children: Array<HTMLNode> | HTMLNode = [], listeners: {[type: string]: EventListener} | EventListener = {}): HTMLElement {
    var element: HTMLElement = document.createElement(tag);
    if (options) {
      if (options.constructor === Object) {
        setElement(element, options);
      } else {
        setElement(element, {'class': options})
      }
    }
    if (typeof listeners === 'function') {
       listeners = { 'click': listeners };
    }
    Object.keys(listeners).forEach(function (k: string) {
      var v: EventListener | Array<EventListener> = listeners[k];
      if (typeof v === 'function') {
        element.addEventListener(k, <EventListener>v);
      } else if (v instanceof Array) {
        v.forEach(function (f) {
          element.addEventListener(k, f);
        });
      } else {
        throw 'Unsupported listener.';
      }
    });
    appendChildren(element, children);
    return element;
  };

  // get nearest ancestor matching certain criteria
  export var getAncestor = function (node: Node, filter: (HTMLElement) => boolean): Node {
    var cur: Node = node;
    while (cur) {
      cur = cur.parentNode;
      if (filter(cur)) {
        return cur;
      }
    }
    return null;
  };

}
