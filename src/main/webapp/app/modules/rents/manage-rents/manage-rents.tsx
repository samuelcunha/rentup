import React, { useEffect } from 'react';

import { IRootState } from 'app/shared/reducers';
import Header from '../../../shared/layout/header/header';
import { Container, Grid, makeStyles } from '@material-ui/core';
import { reset } from '../../administration/user-management/user-management.reducer';
import { connect } from 'react-redux';
import { getManageRents, updateStatus } from './manage-rents.reducer';
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

export const ManageRents = props => {
  useEffect(() => {
    props.reset();
    props.getManageRents();
    props.manageRents.manageRentsSuccess = false;
    return () => {
      props.reset();
    };
  }, []);
  const classes = useStyles();

  if (props.manageRents.refresh) {
    props.getManageRents();
  }

  const onAccept = product => {
    props.updateStatus(product.id, 'CONFIRMED');
  };

  const onFinish = product => {
    props.updateStatus(product.id, 'FINISHED');
  };

  const onReject = product => {
    props.updateStatus(product.id, 'REFUSED');
  };

  return (
    <Container disableGutters maxWidth={false}>
      <Header title="Solicitações de Aluguel"></Header>
      <Container className={classes.container} maxWidth={false}>
        <Grid container spacing={1}>
          {props.manageRents.products.map((product, i) => {
            return (
              <Grid item key={i} xs={12} lg={12}>
                <RentCard allowManage product={product} onAccept={onAccept} onFinish={onFinish} onReject={onReject} />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Container>
  );
};

const mapStateToProps = ({ locale, manageRents }: IRootState) => ({
  currentLocale: locale.currentLocale,
  manageRents,
});

const mapDispatchToProps = { getManageRents, updateStatus, reset };

export default connect(mapStateToProps, mapDispatchToProps)(ManageRents);
