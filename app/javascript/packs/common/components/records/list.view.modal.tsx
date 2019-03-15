import * as React from 'react';
import { Button, ButtonProps, Modal } from 'semantic-ui-react'

import Record from '../../../models/record.model';

interface RecordListViewModalProps {
  open: boolean;
  record?: Record;

  closeModal: () => void;
  confirmCreateModal?: (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => void
  confirmUpdateModal?: (record: Record) => (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => void
  confirmDestroyModal?: (record: Record) => (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => void
}

export class RecordListViewModal extends React.Component<RecordListViewModalProps> {

  public render() {
    const { open, closeModal, confirmCreateModal, confirmUpdateModal, confirmDestroyModal, record } = this.props;

    return (
      <>
        <Modal dimmer={'blurring'} open={open} onClose={closeModal} centered={false}>
          {this.props.children}

          <Modal.Actions>
            {confirmCreateModal &&
              <Button
                color='green'
                icon='checkmark'
                labelPosition='right'
                content='Create'
                onClick={confirmCreateModal}
              />
            }
            {confirmUpdateModal && record &&
              <Button
                color='green'
                icon='checkmark'
                labelPosition='right'
                content='Update'
                onClick={confirmUpdateModal(record)}
              />
            }
            {confirmDestroyModal && record &&
              <Button
                color='red'
                icon='checkmark'
                labelPosition='right'
                content='Delete'
                onClick={confirmDestroyModal(record)}
              />
            }
            <Button
              color='blue'
              icon='close'
              labelPosition='right'
              content='Close'
              onClick={closeModal}
            />
          </Modal.Actions>
        </Modal>
      </>
    );
  }

}
