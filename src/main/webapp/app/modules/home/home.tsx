import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import SearchIcon from '@material-ui/icons/Search';
import { Button, Container, Grid, InputBase, makeStyles, IconButton, Paper } from '@material-ui/core';
import Header from 'app/shared/layout/header/header';

export type IHomeProp = StateProps;

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(10),
  },
  logo: {
    display: 'flex',
    margin: 'auto',
    maxWidth: '350px',
    width: '100%',
    marginBottom: theme.spacing(10),
  },
  logoAuthenticated: {
    display: 'flex',
    margin: 'auto',
    maxWidth: '200px',
    width: '100%',
    marginBottom: theme.spacing(10),
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
  },
  button: {
    minWidth: '200px',
    margin: 'auto',
    marginBottom: theme.spacing(1),
  },
  search: {
    paddingLeft: 15,
  },
  iconButton: {
    padding: 10,
  },
}));

export const Home = props => {
  const classes = useStyles();
  return (
    <Container disableGutters maxWidth={false} className={classes.container}>
      {!props.isAuthenticated ? (
        <Grid container justify="center">
          <Grid item xs={12}>
            <img src="content/images/logo.png" alt="Logo" className={classes.logo} />
          </Grid>

          <Grid item xs={12} className={classes.actions}>
            <Button variant="contained" color="primary" disableElevation component={Link} to="/login" className={classes.button}>
              Login
            </Button>
            <Button variant="contained" color="primary" disableElevation component={Link} to="/account/register" className={classes.button}>
              Registrar
            </Button>
          </Grid>
        </Grid>
      ) : (
        <>
          <Header title="Início"></Header>
          <Container maxWidth={false}>
            <Grid container justify="center" spacing={3} direction="column" alignItems="center">
              <Grid item xs={12}>
                <img src="content/images/logo.png" alt="Logo" className={classes.logoAuthenticated} />
              </Grid>
              <Grid item lg={6}>
                <Paper component="form" className={classes.search}>
                  <InputBase placeholder="Encontre um produto..." />
                  <IconButton type="submit" className={classes.iconButton} aria-label="search">
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Grid>
              <Grid item spacing={5}>
                <Button
                  variant="contained"
                  color="secondary"
                  disableElevation
                  component={Link}
                  to="/account/register"
                  className={classes.button}
                >
                  Anuncie um produto
                </Button>
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </Container>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
