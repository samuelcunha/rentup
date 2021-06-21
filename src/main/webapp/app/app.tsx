import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'app/config/dayjs.ts';

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { hot } from 'react-hot-loader';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import ErrorBoundary from 'app/shared/error/error-boundary';
import AppRoutes from 'app/routes';
import { Container, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import theme from './config/theme';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export const App = props => {
  useEffect(() => {
    props.getSession();
    props.getProfile();
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename={baseHref}>
        <div className="app-container">
          <ToastContainer position={toast.POSITION.TOP_LEFT} className="toastify-container" toastClassName="toastify-toast" />
          <Container disableGutters maxWidth={false}>
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </Container>
        </div>
      </Router>
    </MuiThemeProvider>
  );
};

const mapStateToProps = ({ authentication, locale }: IRootState) => ({
  currentLocale: locale.currentLocale,
  isAuthenticated: authentication.isAuthenticated,
});

const mapDispatchToProps = { setLocale, getSession, getProfile };

export default connect(mapStateToProps, mapDispatchToProps)(hot(module)(App));
