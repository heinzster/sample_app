import { observer } from 'mobx-react';
import * as React from 'react';
import { Header } from 'semantic-ui-react';

import Record from '../../../../models/record.model';

import { default as ShowView } from './base.view';

interface Properties {
  record: Record;

  bodyRenderer?: (record: Record) => JSX.Element;
}

@observer
class RecordShowView extends React.Component<Properties> {

  public render() {
    const { record, bodyRenderer } = this.props;

    return (
      <>
        <ShowView record={record} title="Show Record">
          <Header>{record.displayName}</Header>

          {bodyRenderer && bodyRenderer(record)}
        </ShowView>
      </>
    );
  }

}

export default RecordShowView;
