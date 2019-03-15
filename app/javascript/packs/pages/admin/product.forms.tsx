import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Form, Select } from 'semantic-ui-react'

import { Option } from '../../stores/simple.store';
import UiStore, { NotificationLevel } from '../../stores/ui.store';

import ProductStore from '../../stores/product.store';
import Product from '../../models/product.model';

interface Properties {
  product?: Product;
  categoryOptions: Option[];

  parentSubmitRef: (ref: React.Component) => void;
}

interface InjectedProps extends Properties {
  uiStore: UiStore;
  productStore: ProductStore;
}

@inject('uiStore', 'productStore')
@observer
export class ProductForm extends React.Component<Properties> {

  state = {
    categoryId: undefined,
    name: '',
    price: undefined,
    currency: 'EUR',
    displayCurrency: 'EUR',
  };

  get injected() {
    return this.props as InjectedProps;
  }

  get uiStore() {
    return this.injected.uiStore;
  }

  get productStore() {
    return this.injected.productStore;
  }

  public componentDidMount() {
    const { product, parentSubmitRef } = this.props;

    if (product) {
      this.setState({
        categoryId: product.categoryId,
        name: product.name,
        price: product.price,
        currency: product.currency,
        displayCurrency: product.displayCurrency,
      });
    }

    parentSubmitRef(this);
  }

  public render() {
    const { categoryOptions: options } = this.props;
    const { categoryId, name, price, currency, displayCurrency } = this.state;

    return (
      <>
        <Form>
          <Form.Field
            control={Select}
            options={options}
            label={{ children: 'Category', htmlFor: 'form-select-control-category' }}
            placeholder='ROOT'
            search
            searchInput={{ id: 'form-select-control-category' }}
            name='categoryId'
            value={categoryId}
            onChange={this.handleChange}
          />

          <Form.Field required>
            <Form.Input
              label='Name'
              placeholder='Name'
              value={name}
              name='name'
              onChange={this.handleChange}
            />
          </Form.Field>

          <Form.Group>
            <Form.Field required>
              <Form.Input
                label='Price'
                placeholder='0.00'
                value={price}
                name='price'
                onChange={this.handleChange}
              />
            </Form.Field>

            <Form.Field required>
              <Form.Input
                label='Currency'
                placeholder='EUR'
                value={currency}
                name='currency'
                onChange={this.handleChange}
              />
            </Form.Field>

            <Form.Field required>
              <Form.Input
                label='Display Currency'
                placeholder='EUR'
                value={displayCurrency}
                name='displayCurrency'
                onChange={this.handleChange}
              />
            </Form.Field>
          </Form.Group>
        </Form>
      </>
    );
  }

  /*
   * Init form submit from a parent component.
   */
  public doSubmit = (): void => {
    this.handleSubmit();
  };

  /*
   * Update component state after change of input field values.
   */
  private handleChange = (event, { name, value }): void => {
    this.setState({ [name]: value });
  };

  /*
   * Collect form data and invoke data transmission to backend.
   */
  protected handleSubmit = (): void => {
    if (this.props.product) {
      let record = this.props.product;

      record.categoryId = this.state.categoryId;
      record.name = this.state.name;
      record.price = this.state.price;
      record.currency = this.state.currency;
      record.displayCurrency = this.state.displayCurrency;

      this.productStore.updateItem(['categoryId', 'name', 'price', 'currency', 'displayCurrency'], record)
        .then(() => {
          this.uiStore.addNotifications({
            level: NotificationLevel.Notice,
            message: `Successfully updated product: ${record.name}`,
          });
        })
        .catch((error) => {
          this.uiStore.addNotifications(error.data.notification);
        });
    } else {
      const attrs = {
        categoryId: this.state.categoryId,
        name: this.state.name,
        price: this.state.price,
        currency: this.state.currency,
        displayCurrency: this.state.displayCurrency,
      };

      this.productStore.createItem(attrs)
        .then(() => {
          this.uiStore.addNotifications({
            level: NotificationLevel.Notice,
            message: `Successfully created product: ${attrs.name}`,
          });
        })
        .catch((error) => {
          this.uiStore.addNotifications(error.data.notification);
        });
    }
  };

}
