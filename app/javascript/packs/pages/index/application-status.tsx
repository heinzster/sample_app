import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Message, SemanticCOLORS } from 'semantic-ui-react';

import UiStore, { NotificationLevel } from '../../stores/ui.store';

interface Properties {
  defaultTimeout: number;
}

interface InjectedProps extends Properties {
  uiStore: UiStore
}

@inject('uiStore')
@observer
class ApplicationStatus extends React.Component<Properties> {

  private timer = null;

  get injected() {
    return this.props as InjectedProps;
  }

  get uiStore() {
    return this.injected.uiStore;
  }

  public componentWillUnmount() {
    // reset timer on component destroy
    clearTimeout(this.timer);
  }

  /*
   * Renders one notification message and implements a LIFO pipeline. Allows configuration of timeout for each notification and
   * instant replacement of messages if a new one pops up. Removes the notification being shown automatically from queue after
   * timeout milliseconds.
   */
  public render() {
    let notification = this.uiStore.nextNotification;

    if (notification) {
      const { level, message, instant } = notification;
      const timeout = notification.timeout ? notification.timeout : this.props.defaultTimeout;

      if (this.timer) {
        // reset running timer
        clearTimeout(this.timer);
        this.timer = null;

        if (instant && this.uiStore.notifications.length > 1) {
          // remove active status message and show next one
          this.uiStore.dequeueNotification();
          notification = this.uiStore.nextNotification;
        }
      }

      this.timer = setTimeout(() => {
        // hide notification automatically
        this.uiStore.dequeueNotification();
      }, timeout);


      return (
        <>
          <Container text>
            <Message color={this.messageColor(level)}>
              <Message.Header>{this.messageHeader(level)}</Message.Header>
              <Message.Content>{message}</Message.Content>
            </Message>
          </Container>
        </>
      );
    }

    return null;
  }

  /*
   * Map notification level to SemanticUI color.
   */
  private messageColor = (level: string): SemanticCOLORS => {
    let color: SemanticCOLORS;

    switch (level) {
      case NotificationLevel.Error:
        color = 'red';
        break;
      case NotificationLevel.Alert:
        color = 'yellow';
        break;
      case NotificationLevel.Notice:
        color = 'green';
        break;
      default:
        color = 'blue';
    }

    return color;
  };

  /*
   * Format notification header.
   */
  private messageHeader = (header: string): string => {
    return header.charAt(0).toUpperCase() + header.slice(1);
  };

}

export default ApplicationStatus;
