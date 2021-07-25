import React, { useEffect } from 'react';

import { IRootState } from 'app/shared/reducers';
import Header from '../../../shared/layout/header/header';
import { Container, Grid, makeStyles } from '@material-ui/core';
import { reset } from '../../administration/user-management/user-management.reducer';
import { connect } from 'react-redux';
import { getProducts } from './list-products.reducer';
import ProductCard from 'app/shared/layout/product-card/product-card';

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

export const ListProducts = props => {
  useEffect(() => {
    props.reset();
    props.getProducts();
    props.listProducts.listProductsSuccess = false;
    return () => {
      props.reset();
    };
  }, []);
  const classes = useStyles();

  return (
    <Container disableGutters maxWidth={false}>
      <Header title="Meus Anúncios"></Header>
      <Container className={classes.container} maxWidth={false}>
        <Grid container spacing={1}>
          {props.listProducts.products.map((product, i) => {
            return (
              <Grid item key={i} xs={12} lg={12}>
                <ProductCard product={product} />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Container>
  );
};

const mapStateToProps = ({ locale, listProducts }: IRootState) => ({
  currentLocale: locale.currentLocale,
  listProducts,
});

const mapDispatchToProps = { getProducts, reset };

export default connect(mapStateToProps, mapDispatchToProps)(ListProducts);
