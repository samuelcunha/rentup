import './product-card.scss';

import React from 'react';

import { Card, CardContent, CardMedia, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    width: '100%',
  },
  details: {
    width: '80%',
  },
  image: {
    width: '20%',
    backgroundSize: 'contain',
  },
  content: {
    paddingBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  truncate: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  price: {
    marginTop: '10px',
  },
}));

const getProductImage = product => {
  if (product.imageUrl && product.imageUrl.match(/(www|http:|https:)+[^\s]+[\w]/)) {
    return product.imageUrl;
  }
  return 'content/images/no-image.png';
};

const ProductCard = props => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardMedia className={classes.image} image={getProductImage(props.product)} />
      <div className={classes.details}>
        <CardContent className={`${classes.content} `}>
          <div className={`${classes.title} `}>{props.product.name}</div>
          <div className={`${classes.truncate}`}>{props.product.description}</div>
          <div className={`${classes.price}`}>
            R${props.product.priceBase} / {props.product.priceType}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default connect(null)(ProductCard);
