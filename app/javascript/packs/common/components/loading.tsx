import * as React from 'react';
import { Loader } from 'semantic-ui-react';

const LoadingSpinner = () => (
  <Loader active inline='centered' size='medium'>
    Loading
  </Loader>
);

class Loading extends React.PureComponent {

  public render() {
    return <LoadingSpinner/>;
  }

}

export default Loading;
