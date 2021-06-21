import './header.scss';

import React from 'react';

import LoadingBar from 'react-redux-loading-bar';

import { AppBar, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 999,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Header = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <LoadingBar className="loading-bar" />
        <Toolbar>
          {props.isAuthenticated && (
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" className={classes.title}>
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export const mapStateToProps = ({ authentication }) => {
  return {
    account: authentication.account,
    isAuthenticated: authentication.isAuthenticated,
  };
};

export default connect(mapStateToProps)(Header);
