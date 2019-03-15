import * as React from 'react';
import { Message } from 'semantic-ui-react'

const ErrorMessage = () => (
  <Message negative>
    <Message.Header>WE'RE SORRY!</Message.Header>
    <p>Something went wrong :(</p>
  </Message>
);

class Error extends React.PureComponent {

  public render() {
    return <ErrorMessage />;
  }

}

export default Error;
