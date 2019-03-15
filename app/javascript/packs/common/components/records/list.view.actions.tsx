import * as React from 'react';
import { Icon, Button, ButtonProps } from 'semantic-ui-react'

import Record from '../../../models/record.model';

interface ActionProps {
  subject: Record;

  handler: (record: Record) => (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => void
}

/*
 * Icon and renderer for record actions on index page: show details.
 */
const ShowActionIcon = () => <Icon name='eye' size='large'/>;

export const ShowAction = (props: ActionProps): JSX.Element => {
  return (
    <Button className="ui button" onClick={props.handler(props.subject)}>
      <ShowActionIcon/>
    </Button>
  );
};

/*
 * Icon and renderer for record actions on index page: edit and save changes.
 */
const UpdateActionIcon = () => <Icon name='edit' size='large'/>;

export const UpdateAction = (props: ActionProps): JSX.Element => {
  return (
    <Button className="ui button" onClick={props.handler(props.subject)}>
      <UpdateActionIcon/>
    </Button>
  );
};

/*
 * Icon and renderer for record actions on index page: destroy record with confirmation.
 */
const DestroyActionIcon = () => <Icon name='remove circle' size='large'/>;

export const DestroyAction = (props: ActionProps): JSX.Element => {
  return (
    <Button className="ui button" onClick={props.handler(props.subject)}>
      <DestroyActionIcon/>
    </Button>
  );
};
