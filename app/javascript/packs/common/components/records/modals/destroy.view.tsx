import * as React from 'react';
import { Header } from 'semantic-ui-react';

import Record from '../../../../models/record.model';

import { default as ShowView } from './base.view';

interface Properties {
  record: Record;

  bodyRenderer?: (record: Record) => JSX.Element;
}

class RecordDestroyView extends React.Component<Properties> {

  public render() {
    const { record, bodyRenderer } = this.props;

    return (
      <>
        <ShowView record={record} title="Destroy Record">
          <Header>{record.displayName}</Header>

          {bodyRenderer && bodyRenderer(record)}
          {!bodyRenderer && (<p><i>Do you really want to remove this record?</i></p>)}
        </ShowView>
      </>
    );
  }

}

export default RecordDestroyView;
