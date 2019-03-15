import SimpleStore from './simple.store';

import Category from '../models/category.model';

/**
 * Store provider for everything about categories.
 */
export default class CategoryStore extends SimpleStore<Category> {

  constructor() {
    super();

    this.modelName = 'category';
    this.basePath = '/api/categories';
  }

}

export let store = new CategoryStore();
