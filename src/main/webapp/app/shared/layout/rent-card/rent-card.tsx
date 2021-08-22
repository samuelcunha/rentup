import './rent-card.scss';

import React from 'react';

import { Card, CardContent, makeStyles, CardMedia, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { format } from 'date-fns';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    width: '100%',
  },
  details: {
    width: '80%',
  },
  content: {
    paddingBottom: 16,
  },
  image: {
    width: '20%',
    backgroundSize: 'contain',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  truncate: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  label: {
    fontWeight: 'bold',
  },
  price: {
    marginTop: '10px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 10,
    marginBottom: 10,
  },
}));

const statusMap = {
  REQUESTED: 'Aguardando aprovação',
  REFUSED: 'Aluguel recusado',
  CONFIRMED: 'Aluguel aceito',
  FINISHED: 'Aluguel finalizado',
};

const formatDate = date => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
};

const formatStatus = status => {
  return statusMap[status] || status;
};

const getProductImage = product => {
  if (product.productImageUrl && product.productImageUrl.match(/(www|http:|https:)+[^\s]+[\w]/)) {
    return product.productImageUrl;
  }
  return 'content/images/no-image.png';
};

const RentCard = props => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardMedia className={classes.image} image={getProductImage(props.product)} />
      <div className={classes.details}>
        <CardContent className={`${classes.content} `}>
          <div className={`${classes.title} `}>{props.product.productName}</div>
          <div>
            <span className={`${classes.label}`}>De: </span>
            <span className={`${classes.truncate}`}>{formatDate(props.product.initialDate)}</span>
          </div>
          <div>
            <span className={`${classes.label}`}>Até: </span>
            <span className={`${classes.truncate}`}>{formatDate(props.product.finalDate)}</span>
          </div>

          <div>
            <span className={`${classes.label}`}>Valor: </span>
            <span className={`${classes.price}`}>
              R${props.product.priceBase} / {props.product.priceTypeDescription}
            </span>
          </div>
          <div>
            <span className={`${classes.label}`}>Pagamento: </span>
            <span className={`${classes.truncate}`}>{props.product.paymentType}</span>
          </div>
          <div>
            <span className={`${classes.label}`}>Status: </span>
            <span className={`${classes.truncate}`}>{formatStatus(props.product.status)}</span>
          </div>
        </CardContent>
        {props.allowManage && props.product.status === 'REQUESTED' && (
          <div className={classes.actions}>
            <Button
              variant="contained"
              id="rejectButton"
              className={classes.button}
              style={{ backgroundColor: 'red' }}
              onClick={() => props.onReject(props.product)}
            >
              Recusar
            </Button>
            <Button
              variant="contained"
              className={classes.button}
              style={{ backgroundColor: 'green' }}
              onClick={() => props.onAccept(props.product)}
            >
              Aceitar
            </Button>
          </div>
        )}
        {props.allowManage && props.product.status === 'CONFIRMED' && (
          <div className={classes.actions}>
            <Button
              variant="contained"
              className={classes.button}
              style={{ backgroundColor: 'green' }}
              onClick={() => props.onFinish(props.product)}
            >
              Finalizar
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default connect(null)(RentCard);
