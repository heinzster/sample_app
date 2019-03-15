import * as React from 'react';
import { Header } from 'semantic-ui-react';

import Record from '../../../../models/record.model';

import { default as Container } from './base.view';

interface Properties {
  record: Record;

  bodyRenderer?: (record: Record, parentSubmitRef: (ref: React.Component) => void) => JSX.Element;
  parentSubmitRef: (ref: React.Component) => void;
}

class RecordUpdateView extends React.Component<Properties> {

  public render() {
    const { record, bodyRenderer, parentSubmitRef: ref } = this.props;

    return (
      <>
        <Container record={record} title="Update Record">
          <Header>{record.displayName}</Header>

          {bodyRenderer && bodyRenderer(record, ref)}
        </Container>
      </>
    );
  }

}

export default RecordUpdateView;
