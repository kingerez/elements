import { createElementWithContext, elements } from './elements/elementCreator';
import { BaseStyle } from './elements/GlobalStyle';
import { AppState } from './stateManagement/State';

export const init = (rootElement: HTMLElement, app: () => JSX.Element, initialState: AppState = {}) => {
  const root = rootElement.attachShadow({ mode: 'open' });
  const baseStylesheet = BaseStyle.appendStylesheet(root);

  elements.createElement = createElementWithContext(initialState, baseStylesheet);

  const tree = app();
  root.appendChild(tree as unknown as HTMLElement);

  return {}
};
