import { BaseElement } from './BaseElement';

const ELEMENT = 'base-style';

interface MMWrapperProps extends Element.JSX {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [ELEMENT]: MMWrapperProps;
    }
  }
}

export class BaseStyle extends BaseElement {
  static appendStylesheet(root: ShadowRoot): BaseStyle {
    const stylesheet = document.createElement(ELEMENT);
    root.appendChild(stylesheet);

    return stylesheet as BaseStyle;
  }

  addedStyles: {[key: string]: string} = {};

  styleElement: HTMLStyleElement = document.createElement('style');

  constructor() {
    super();
  }

  appendStyleFromElement(nodeName: string, style: string) {
    if(!this.addedStyles[nodeName]) {
      this.addedStyles[nodeName] = style;
      this.styleElement.innerHTML += style;
    }
  }

  onMount(): void {
    this.appendChild(this.styleElement);
  }
}

customElements.define(ELEMENT, BaseStyle);
