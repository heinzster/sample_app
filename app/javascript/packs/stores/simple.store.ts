import { action, computed, observable } from 'mobx';

import { logger } from '../common/logger';

import { restServer } from './rest.server';

interface Identity {
  id: number;
  displayName: string;
}

export interface Option {
  text: string;
  value: number;
}

/**
 * Generic employeeStore provider for everything, implemented to simplify data fetching from Rails CRUD controller.
 */
class SimpleStore<T extends Identity> {

  /**
   * True if data is being loaded or stored, false otherwise.
   */
  @observable public isLoading = false;

  /**
   * List of all records for form select options, provides reduced set of two model attributes: text and value.
   */
  @observable public options: Option[] = [];

  /**
   * Number of form options total available.
   */
  @observable public numOptions: number = 0;

  /**
   * List of all records including all model attributes.
   */
  @observable public items: T[] = [];

  /**
   * Number of items total available.
   */
  @observable public numItems: number = 0;

  /**
   * List of paginated items, a subset of all records available.
   */
  @observable public paginatedItems: T[] = [];

  /**
   * Number of paginated items available.
   */
  @observable public numPaginatedItems: number = 0;

  /**
   * A specific record, selected for further processing, operations or to be shown in a view.
   */
  @observable public selectedItem: T = null;

  /**
   * True if the selected item got some property updates, false otherwise.
   */
  @observable public selectedItemIsDirty: boolean = false;

  /**
   * Reference to transport layer that communicates with the database server.
   */
  protected api = restServer;

  /**
   * Base string to call REST API for this model.
   */
  protected basePath: string;

  /**
   * Model name of the records this store operates on.
   */
  protected modelName: string;

  /* COMMON */

  @action
  public loading(state: boolean): void {
    this.isLoading = state;
  }

  /* SELECTED ITEM */

  @action
  public async getSelectedItem(id: number): Promise<void> {
    logger.of('SimpleStore.getSelectedItem').data('id', id);

    this.loading(true);

    return this.api.fetchById(this.basePath, id)
      .then(data => {
        logger.of('SimpleStore.getSelectedItem', 'callback').data('data', data);

        this.setSelectedItem(data);
        this.loading(false);
      })
      .catch((error) => {
        this.loading(false);

        return Promise.reject(error);
      });
  }

  @action
  public setSelectedItem = (item: T | null): void => {
    logger.of('SimpleStore.setSelectedItem').data('item', item);

    this.selectedItem = item;
    this.selectedItemIsDirty = false;
  };

  @action
  public clearSelectedItem = (): void => {
    this.setSelectedItem(null);
  };

  @computed
  get selectedItemId(): number {
    return (this.selectedItem) ? this.selectedItem.id : -1;
  }

  @computed
  get selectedItemDisplayName(): string {
    return (this.selectedItem) ? this.selectedItem.displayName : '';
  }

  @computed
  get hasItemSelected(): boolean {
    return this.selectedItem !== null;
  }

  /* HELPERS */

  @action
  public async getOptions(): Promise<void> {
    logger.of('SimpleStore.getOptions').trace();

    this.loading(true);

    return this.api.fetchAll(this.basePath + '/options')
      .then(async data => {
        logger.of('SimpleStore.getOptions', 'callback').data('data', data);

        this.setOptions(data);
        this.loading(false);
      })
      .catch((error) => {
        this.loading(false);

        return Promise.reject(error);
      });
  }

  @action
  protected setOptions = (options: Option[]): void => {
    logger.of('SimpleStore.setOptions').data('options', options);

    this.options = options;
    this.numOptions = this.options.length;
  };

  /* ITEMS */

  @action
  public async getItems(): Promise<void> {
    logger.of('SimpleStore.getItems').trace();

    this.loading(true);

    return this.api.fetchAll(this.basePath)
      .then(async data => {
        logger.of('SimpleStore.getItems', 'callback').data('data', data);

        this.setItems(data);
        this.loading(false);
      })
      .catch((error) => {
        this.loading(false);

        return Promise.reject(error);
      });
  }

  @action
  protected setItems = (items: T[]): void => {
    logger.of('SimpleStore.setItems').data('items', items);

    if (this.items && this.numItems > 0) {
      this.items = [...items];
    } else {
      this.items = items;
    }

    this.numItems = this.items.length;
  };

  @action
  public clearItems = (): void => {
    this.setItems([]);
  };

  @action
  public async getNumItems(): Promise<void> {
    logger.of('SimpleStore.getNumItems').debug('going to request items count');

    this.loading(true);

    return this.api.get(this.basePath + '/count')
      .then(async data => {
        logger.of('SimpleStore.getNumItems', 'callback').data('data', data);

        this.setNumItems(data.count);
        this.loading(false);
      })
      .catch((error) => {
        this.loading(false);

        return Promise.reject(error);
      });
  }

  @action
  protected setNumItems = (count: number): void => {
    logger.of('SimpleStore.setNumItems').data('count', count);

    this.numItems = count;
  };

  /* PAGINATED ITEMS */

  @action
  public async getPaginatedItems(page: number, per_page: number, query?: string): Promise<void> {
    logger.of('SimpleStore.getPaginatedItems').debug(`going to request paginated items for page ${page}, ${per_page} items per page`);

    this.loading(true);

    return this.api.fetchPaginated(this.basePath, page, per_page, query)
      .then(async data => {
        logger.of('SimpleStore.getPaginatedItems', 'callback').data('data', data);

        this.setPaginatedItems(data);
        this.loading(false);
      })
      .catch((error) => {
        this.loading(false);

        return Promise.reject(error);
      });
  }

  @action
  protected setPaginatedItems = (paginatedItems: T[]): void => {
    logger.of('SimpleStore.setPaginatedItems').data('paginatedItems', paginatedItems);

    if (this.paginatedItems && this.paginatedItems.length > 0) {
      this.paginatedItems = [...paginatedItems];
    } else {
      this.paginatedItems = paginatedItems;
    }

    this.numPaginatedItems = this.paginatedItems.length;
  };

  @action
  public clearPaginatedItems = (): void => {
    this.setPaginatedItems([]);
  };

  /* CRUD OPERATIONS */

  @action
  public destroyItem = (item?: T): Promise<void> => {
    if (item) {
      this.setSelectedItem(item);
    }

    if (this.selectedItem) {
      logger.of('SimpleStore.destroyItem').data('item', this.selectedItem);

      this.loading(true);

      return this.api.delete(this.basePath, this.selectedItem.id)
        .then(data => {
          if (this.numItems > 0) {
            this.setItems(this.items.filter(item => item.id !== this.selectedItem.id));
            this.setOptions(this.options.filter(item => item.value !== this.selectedItem.id));
          }

          this.clearSelectedItem();
          this.loading(false);
        })
        .catch((error) => {
          this.loading(false);

          return Promise.reject(error);
        });
    }
  };

  @action
  public updateItem = (attrKeys: string[], item?: T): Promise<void> => {
    if (item) {
      this.setSelectedItem(item);
    }

    if (this.selectedItem) {
      logger.of('SimpleStore.updateItem').data('item', this.selectedItem);

      const attrs = Object.keys(this.selectedItem)
        .reduce((object, key) => {
          if (attrKeys.indexOf(key) > -1) {
            object[key] = this.selectedItem[key];
          }

          return object;
        }, {});

      const json = { [this.modelName]: attrs };
      logger.of('SimpleStore.updateItem').data('json', json);

      this.loading(true);

      return this.api.put(this.basePath, this.selectedItem.id, json)
        .then(data => {
          logger.of('SimpleStore.updateItem', 'callback').data('data', data);

          if (this.numItems > 0) {
            this.getItems();
            this.getOptions();
          }

          this.clearSelectedItem();
          this.loading(false);
        })
        .catch((error) => {
          this.loading(false);

          return Promise.reject(error);
        });
    }
  };

  @action
  public createItem = (attrs: {}): Promise<T> => {
    logger.of('SimpleStore.createItem').data('attrs', attrs);

    const json = { [this.modelName]: attrs };

    this.loading(true);

    return this.api.post(this.basePath, json)
      .then(data => {
        logger.of('SimpleStore.createItem', 'callback').data('data', data);

        this.getItems();
        this.getOptions();

        this.setSelectedItem(data);
        this.loading(false);

        return this.selectedItem;
      })
      .catch((error) => {
        this.loading(false);

        return Promise.reject(error);
      });
  };

}

export default SimpleStore;
