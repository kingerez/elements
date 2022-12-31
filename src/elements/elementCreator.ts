import { AppState } from '../stateManagement/State';
import { BaseElement } from './BaseElement';
import { BaseStyle } from './GlobalStyle';

type Child = string | HTMLElement;
type Props = null | {[key: string]: any};

export const createElementWithContext = (state: AppState, baseStylesheet: BaseStyle) => {
  const renderElement = (type: string, props: Props , ...children: Child[]) => {
    const el = document.createElement(type);

    // @ts-ignore
    el.context = el.context || {};

    // @ts-ignore
    el.context.baseStylesheet = baseStylesheet;

    //@ts-ignore
    el.context.state = state;

    if(props) {
      Object.keys(props).forEach((key: string) => {
        const value = props[key];

        if(key === 'className') {
          el.className = value;
        } else if(key === 'ref') {
          if(typeof value === 'function') {
            value(el);
          } else if(typeof value === 'object') {
            value.current = el;
          }
        } else if(typeof value === 'function') {
          const event = key.toLowerCase().replace(/^on/, '');
          el.addEventListener(event, value);
        } else {
          el.setAttribute(key, value);
        }
      });
    }

    if(typeof customElements.get(type) !== 'undefined') {
      return el as BaseElement;
    } else {
      if(children.length > 0) {
        children.forEach(child => {
          if(typeof child === 'string') {
            el.appendChild(document.createTextNode(child));
          } else {
            el.appendChild(child as HTMLElement);
          }
        });
      }

      return el;
    }
  }

  return renderElement;
};

export const elements: {[key: string]: any} = {
  createElement: () => {}
};