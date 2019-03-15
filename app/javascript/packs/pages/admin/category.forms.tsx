import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Form, Select } from 'semantic-ui-react'

import { Option } from '../../stores/simple.store';
import UiStore, { NotificationLevel } from '../../stores/ui.store';

import CategoryStore from '../../stores/category.store';
import Category from '../../models/category.model';

interface Properties {
  category?: Category;
  parentCategoryOptions: Option[];

  parentSubmitRef: (ref: React.Component) => void;
}

interface InjectedProps extends Properties {
  uiStore: UiStore;
  categoryStore: CategoryStore;
}

@inject('uiStore', 'categoryStore')
@observer
export class CategoryForm extends React.Component<Properties> {

  state = {
    parentId: undefined,
    name: '',
  };

  get injected() {
    return this.props as InjectedProps;
  }

  get uiStore() {
    return this.injected.uiStore;
  }

  get categoryStore() {
    return this.injected.categoryStore;
  }

  public componentDidMount() {
    const { category, parentSubmitRef } = this.props;

    if (category) {
      this.setState({
        parentId: category.parentId,
        name: category.name,
      });
    }

    parentSubmitRef(this);
  }

  public render() {
    const { category, parentCategoryOptions } = this.props;
    const { parentId, name } = this.state;

    const options = category ? parentCategoryOptions.filter(i => i.value !== category.id) : parentCategoryOptions;

    return (
      <>
        <Form>
          <Form.Field required>
            <Form.Input
              label='Name'
              placeholder='Name'
              value={name}
              name='name'
              onChange={this.handleChange}
            />
          </Form.Field>

          <Form.Field
            control={Select}
            options={options}
            label={{ children: 'Category', htmlFor: 'form-select-control-category' }}
            placeholder='Category'
            search
            searchInput={{ id: 'form-select-control-category' }}
            name='parentId'
            value={parentId}
            onChange={this.handleChange}
          />
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
    if (this.props.category) {
      let record = this.props.category;

      record.parentId = this.state.parentId;
      record.name = this.state.name;

      this.categoryStore.updateItem(['parentId', 'name'], record)
        .then(() => {
          this.uiStore.addNotifications({
            level: NotificationLevel.Notice,
            message: `Successfully updated category: ${record.name}`,
          });
        })
        .catch((error) => {
          this.uiStore.addNotifications(error.data.notification);
        });
    } else {
      const attrs = {
        parentId: this.state.parentId,
        name: this.state.name,
      };

      this.categoryStore.createItem(attrs)
        .then(() => {
          this.uiStore.addNotifications({
            level: NotificationLevel.Notice,
            message: `Successfully created category: ${attrs.name}`,
          });
        })
        .catch((error) => {
          this.uiStore.addNotifications(error.data.notification);
        });
    }
  };

}
