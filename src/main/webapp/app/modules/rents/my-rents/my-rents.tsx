import React, { useEffect } from 'react';

import { IRootState } from 'app/shared/reducers';
import Header from '../../../shared/layout/header/header';
import { Container, Grid, makeStyles } from '@material-ui/core';
import { reset } from '../../administration/user-management/user-management.reducer';
import { connect } from 'react-redux';
import { getMyRents } from './my-rents.reducer';
import RentCard from 'app/shared/layout/rent-card/rent-card';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: '65px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 10px',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
  },
  actions: {
    display: 'flex',
    marginTop: theme.spacing(5),
  },
  options: {
    display: 'flex',
    margin: theme.spacing(1),
  },
  footerButton: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    height: '50px',
    width: '100%',
  },
  priceSeparator: {
    display: 'flex',
    fontSize: 25,
    color: '#929292',
    textAlign: 'center',
  },
}));

export const MyRents = props => {
  useEffect(() => {
    props.reset();
    props.getMyRents();
    props.myRents.myRentsSuccess = false;
    return () => {
      props.reset();
    };
  }, []);
  const classes = useStyles();

  return (
    <Container disableGutters maxWidth={false}>
      <Header title="Meus Aluguéis"></Header>
      <Container className={classes.container} maxWidth={false}>
        <Grid container spacing={1}>
          {props.myRents.products.map((product, i) => {
            return (
              <Grid item key={i} xs={12} lg={12}>
                <RentCard product={product} onConfirm={a => console.log(a)} />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Container>
  );
};

const mapStateToProps = ({ locale, myRents }: IRootState) => ({
  currentLocale: locale.currentLocale,
  myRents,
});

const mapDispatchToProps = { getMyRents, reset };

export default connect(mapStateToProps, mapDispatchToProps)(MyRents);
