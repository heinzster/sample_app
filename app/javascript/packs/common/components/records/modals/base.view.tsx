import * as React from 'react';
import { Modal } from 'semantic-ui-react';

import Record from '../../../../models/record.model';

interface Properties {
  record: Record;
  title: string;
}

/*
 * Provides a generic base container widget for within modal views: create, show, update and destroy.
 * Action buttons are defined here: RecordListViewModal component.
 */
class BaseShowView extends React.Component<Properties> {

  public render() {
    const { title } = this.props;

    return (
      <>
        <Modal.Header>{title}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {this.props.children}
          </Modal.Description>
        </Modal.Content>
      </>
    );
  }

}

export default BaseShowView;
