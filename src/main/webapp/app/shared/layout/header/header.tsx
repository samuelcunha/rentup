import './header.scss';

import React, { useState } from 'react';

import LoadingBar from 'react-redux-loading-bar';
import StorefrontIcon from '@material-ui/icons/Storefront';
import HomeIcon from '@material-ui/icons/Home';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AppsIcon from '@material-ui/icons/Apps';

import {
  AppBar,
  Avatar,
  Card,
  CardHeader,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import { useHistory } from 'react-router';

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
  drawer: {
    minWidth: 250,
  },
}));

const Header = props => {
  const classes = useStyles();
  const history = useHistory();
  const [menuOpen, setMenuOpen] = useState(false);

  const renderDrawer = () => (
    <div className={classes.drawer} onClick={() => setMenuOpen(!menuOpen)} onKeyDown={() => setMenuOpen(!menuOpen)}>
      <Link to="/account/settings" style={{ textDecoration: 'none' }}>
        <Card variant="outlined">
          <CardHeader avatar={<Avatar></Avatar>} title={props.account.firstName} subheader={props.account.email} />
        </Card>
      </Link>
      <List>
        <Link to="/">
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItem>
        </Link>
        <Link to="/products/user">
          <ListItem button>
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary="Meus Produtos" />
          </ListItem>
        </Link>
        <Link to="/rents/my-rents">
          <ListItem button>
            <ListItemIcon>
              <StorefrontIcon />
            </ListItemIcon>
            <ListItemText primary="Meus Aluguéis" />
          </ListItem>
        </Link>
        <Link to="/rents/manage-rents">
          <ListItem button>
            <ListItemIcon>
              <ThumbsUpDownIcon />
            </ListItemIcon>
            <ListItemText primary="Solicitações" />
          </ListItem>
        </Link>
        <Link to="/logout">
          <ListItem button>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItem>
        </Link>
      </List>
    </div>
  );

  return (
    <div className={classes.root} data-cy="header">
      <AppBar position="static">
        <LoadingBar className="loading-bar" />
        <Toolbar>
          {props.showBack && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                history.goBack();
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          {props.isAuthenticated && !props.showBack && (
            <IconButton edge="start" className={classes.menuButton} color="inherit" onClick={() => setMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" className={classes.title}>
            {props.title}
          </Typography>
        </Toolbar>
        <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
          {renderDrawer()}
        </Drawer>
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
