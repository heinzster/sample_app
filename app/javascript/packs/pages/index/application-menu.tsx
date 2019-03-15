import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Visibility, Menu, Image, Container } from 'semantic-ui-react';

import UiStore, { Module } from '../../stores/ui.store';

const menuStyle = {
  border: 'none',
  borderRadius: 0,
  boxShadow: 'none',
  marginBottom: '1em',
  marginTop: '1em',
  transition: 'box-shadow 0.5s ease, padding 0.5s ease',
};

const fixedMenuStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
};

interface Properties {
}

interface InjectedProps extends Properties {
  uiStore: UiStore
}

@inject('uiStore')
@observer
class ApplicationMenu extends React.Component<Properties> {

  get injected() {
    return this.props as InjectedProps;
  }

  get ui() {
    return this.injected.uiStore;
  }

  public render() {
    return (
      <>
        <Visibility
          onBottomPassed={this.stickTopMenu}
          onBottomVisible={this.unStickTopMenu}
          once={false}
        >
          <Menu
            borderless
            fixed={this.ui.menuFixed && 'top' || null}
            style={this.ui.menuFixed ? fixedMenuStyle : menuStyle}
          >
            <Container text>
              <Menu.Item>
                <Image size='mini' src='https://react.semantic-ui.com/logo.png'/>
              </Menu.Item>

              <Menu.Item header>
                Shoppu
              </Menu.Item>

              <Menu.Item
                as='a'
                active={this.ui.selectedModule === Module.Category}
                onClick={this.switchModule(Module.Category)}
              >
                Categories
              </Menu.Item>

              <Menu.Item
                as='a'
                active={this.ui.selectedModule === Module.Product}
                onClick={this.switchModule(Module.Product)}
              >
                Products
              </Menu.Item>
            </Container>
          </Menu>
        </Visibility>
      </>
    );
  }

  /*
   * Hold menu sticky on top of page if viewport scrolls.
   */
  private stickTopMenu = () => this.ui.setMenuFixed(true);

  private unStickTopMenu = () => this.ui.setMenuFixed(false);

  /*
   * Basic navigation switches between models.
   */
  private switchModule = (module: Module) => () => {
    this.ui.selectModule(module);
  };

}

export default ApplicationMenu;
