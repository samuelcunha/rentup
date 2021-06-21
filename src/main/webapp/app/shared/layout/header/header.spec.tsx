import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import initStore from 'app/config/store';
import Header from './header';
import { ACTION_TYPES } from 'app/shared/reducers/authentication';
import { SUCCESS } from '../../reducers/action-type.util';

describe('Header', () => {
  let mountedWrapper;

  const headerProps = {
    title: 'Custom Title',
    authenticated: false,
  };

  const headerPropsAuthenticated = {
    title: 'Custom Title',
    authenticated: true,
  };

  const wrapper = (props = headerProps) => {
    if (!mountedWrapper) {
      const store = initStore();
      if (props.authenticated) {
        const payload = { data: { activated: true } };
        store.dispatch({ type: SUCCESS(ACTION_TYPES.GET_SESSION), payload });
      }
      const history = createMemoryHistory();
      const { container } = render(
        <Provider store={store}>
          <Router history={history}>
            <Header {...props} />
          </Router>
        </Provider>
      );
      mountedWrapper = container.innerHTML;
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('Renders a Header component', () => {
    const html = wrapper();
    expect(html).toContain('header');
  });

  it('Set header title property', () => {
    const html = wrapper();
    expect(html).toContain('Custom Title');
  });

  it('Show menu if authenticated', () => {
    const html = wrapper(headerPropsAuthenticated);
    expect(html).toContain('menu');
  });
});
