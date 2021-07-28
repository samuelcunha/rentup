import React, { useEffect } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IRootState } from 'app/shared/reducers';
import { AppBar, Container, Grid, IconButton, InputBase, makeStyles, Toolbar } from '@material-ui/core';
import { reset } from '../../administration/user-management/user-management.reducer';
import { connect } from 'react-redux';
import { findProduct } from './search-product.reducer';
import ProductCard from 'app/shared/layout/product-card/product-card';
import { useHistory } from 'react-router';

const useStyles = makeStyles(() => ({
  container: {
    marginTop: '65px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 10px',
  },
  searchBox: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  searchInput: {
    color: '#FFFFFF',
  },
  filterAction: {
    marginRight: -12,
  },
}));

export const SearchProduct = props => {
  const history = useHistory();
  useEffect(() => {
    props.findProduct(props.searchProduct.filter);
    props.reset();
    return () => {
      props.reset();
    };
  }, []);
  const classes = useStyles();

  let searchTimeout;

  const onChangeFilterQuery = evt => {
    props.searchProduct.filter = { ...props.searchProduct.filter, query: evt.target.value };
    if (!searchTimeout) {
      searchTimeout = setTimeout(() => {
        props.findProduct(props.searchProduct.filter);
      }, 1500);
    }
  };

  return (
    <Container disableGutters maxWidth={false}>
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                history.goBack();
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <div className={classes.searchBox}>
              <InputBase placeholder="Encontre um produto..." className={classes.searchInput} autoFocus onChange={onChangeFilterQuery} />
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <Container className={classes.container} maxWidth={false}>
        <Grid container spacing={1}>
          {props.searchProduct.products.map((product, i) => {
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

const mapStateToProps = ({ locale, searchProduct }: IRootState) => ({
  currentLocale: locale.currentLocale,
  searchProduct,
});

const mapDispatchToProps = { findProduct, reset };

export default connect(mapStateToProps, mapDispatchToProps)(SearchProduct);
