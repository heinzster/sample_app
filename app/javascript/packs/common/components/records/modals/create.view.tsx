import * as React from 'react';
import { Modal } from 'semantic-ui-react';

interface Properties {
  bodyRenderer?: (parentSubmitRef: (ref: React.Component) => void) => JSX.Element;
  parentSubmitRef: (ref: React.Component) => void;
}

class RecordCreateView extends React.Component<Properties> {

  public render() {
    const { bodyRenderer, parentSubmitRef: ref } = this.props;

    return (
      <>
        <Modal.Header>Create Record</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {bodyRenderer && bodyRenderer(ref)}
          </Modal.Description>
        </Modal.Content>
      </>
    );
  }

}

export default RecordCreateView;
