import { Ref } from 'react';
import { AppState } from '../stateManagement/State';
import { BaseStyle } from "./GlobalStyle";

declare global {
  namespace Element {
    type JSX = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

interface Context {
  state: AppState;
  baseStylesheet: BaseStyle | null
}

const recursiveUpdate = (origin: HTMLElement, update: HTMLElement) => {
  const nodeName = update.nodeName.toLowerCase();
  if(customElements.get(nodeName)) {
    const renderResult = (update as BaseElement).render();
    update.appendChild(renderResult as unknown as HTMLElement);
  }

  if(origin.children.length === 0 && update.children.length === 0) {
    let isDifferent = false;
    // we've reached the end of both trees
    // compare content, then attributes
    
    if(origin.innerHTML !== update.innerHTML) {
      isDifferent = true;
    }

    const originAttr = origin.getAttributeNames().sort();
    const updateAttr = update.getAttributeNames().sort();
    if(originAttr.length !== updateAttr.length) {
      isDifferent = true;
    } else {
      for(let i=0; i<originAttr.length; i++) {
        const attrName1 = originAttr[i];
        const attrName2 = updateAttr[i];
        if(attrName1 !== attrName2 || origin.getAttribute(attrName1) !== update.getAttribute(attrName2)) {
          isDifferent = true;
          break;
        }
      }
    }

    if(isDifferent) {
      origin.parentElement?.replaceChild(update, origin);
      return;
    }
  }

  if(origin.children.length === 0 && update.children.length > 0) {
    origin.parentElement?.replaceChild(update, origin);
    return;
  }

  if(origin.children.length > 0 && update.children.length === 0) {
    Array.from(origin.children).forEach(child => {
      origin.removeChild(child);
    });

    return;
  }

  Array.from(origin.children).forEach((child, i) => {
    recursiveUpdate(child as HTMLElement, update.children[i] as HTMLElement);
  });
};

export class BaseElement extends HTMLElement {
  context: Context = {
    state: {},
    baseStylesheet: null,
  };

  elementStyle: string | null = null;

  private prevState: Element.JSX | null = null;

  constructor() {
    super();
  }

  getRoot() {
    return this.getRootNode();
  }

  createRef<T>(initialValue: any = null): Ref<T> {
    return {
      current: initialValue as T
    };
  }

  connectedCallback() {
    if(this.elementStyle) {
      this.context.baseStylesheet?.appendStyleFromElement(this.nodeName, this.elementStyle);
    }
    
    this.update();

    this.onMount();
  }

  attributeChangedCallback() {
    // this.update();
  }

  update(): void {
    const renderResult = this.render();
    
    if(renderResult === null) {
      return;
    }
    
    if(renderResult !== null && this.prevState === null) {
      this.appendChild(renderResult as unknown as HTMLElement);
    } else {
      const div = document.createElement('div');
      div.appendChild(renderResult as unknown as HTMLElement);
      
      recursiveUpdate(this.firstChild as unknown as HTMLElement, renderResult as unknown as HTMLElement);
    }
    
    this.prevState = renderResult;
  };

  /***  OVERRIDES  ***/
  
  // for override
  onMount() {}

  // for override
  render(): Element.JSX | null { return null }
}
