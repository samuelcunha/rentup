import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Container, Grid, makeStyles } from '@material-ui/core';

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
}));

export const Home = () => {
  const classes = useStyles();
  return (
    <Container disableGutters maxWidth={false} className={classes.container}>
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
    </Container>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
