import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import { store as uiStore } from './stores/ui.store';
import { store as categoryStore } from './stores/category.store';
import { store as productStore } from './stores/product.store';

import Application from './pages/index/application';

ReactDOM.render(
  <Provider uiStore={uiStore} categoryStore={categoryStore} productStore={productStore}><Application/></Provider>,
  document.body.appendChild(document.createElement('div'))
);
