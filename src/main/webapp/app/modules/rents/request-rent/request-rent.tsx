import React, { useEffect } from 'react';

import { IRootState } from 'app/shared/reducers';
import Header from '../../../shared/layout/header/header';
import { Button, Container, Grid, makeStyles, InputLabel, Select, FormControl, FormHelperText, MenuItem } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { reset } from '../../administration/user-management/user-management.reducer';
import { connect } from 'react-redux';
import { formatISO } from 'date-fns';
import { Redirect } from 'react-router-dom';
import { addRentRequest } from './request-rent.reducer';

const useStyles = makeStyles(() => ({
  container: {
    marginTop: '65px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 10px',
  },
  media: {
    height: 200,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
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
  label: {
    fontWeight: 'bold',
  },
  price: {
    marginTop: '10px',
  },
  form: {
    marginTop: 10,
  },
  footerButton: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    height: '50px',
    width: '100%',
  },
}));

export const RequestRent = props => {
  useEffect(() => {
    props.reset();
    props.requestRent.requestRentSuccess = false;
    return () => {
      props.reset();
    };
  }, []);
  const classes = useStyles();
  const {
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm();
  const product = props.location.state.product;

  const onSubmit = values => {
    props.addRentRequest({
      productId: product.id,
      initialDate: formatISO(new Date(values.startDate)),
      finalDate: formatISO(new Date(values.endDate)),
      status: 'REQUESTED',
      paymentType: values.paymentType,
    });
  };

  const getProductImage = item => {
    if (item.imageUrl && item.imageUrl.match(/(www|http:|https:)+[^\s]+[\w]/)) {
      return item.imageUrl;
    }
    return 'content/images/no-image.png';
  };

  if (props.requestRent.requestRentSuccess) {
    return <Redirect to="/rents/my-rents" />;
  }

  return (
    <Container disableGutters maxWidth={false}>
      <Header showBack title="Alugar Produto"></Header>
      <Container className={classes.container} maxWidth={false}>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={12}>
            <div className={classes.media} style={{ backgroundImage: `url(${getProductImage(product)})` }} title={product.title} />
          </Grid>
          <Grid item xs={12} lg={12}>
            <div className={`${classes.title} `}>{product.name}</div>
          </Grid>
          <Grid item xs={12} lg={12}>
            <div className={`${classes.truncate}`}>{product.description}</div>
          </Grid>
          <Grid item xs={12} lg={12}>
            <div>
              <span className={`${classes.label}`}>Valor: </span>
              <span className={`${classes.price}`}>
                R${product.priceBase} / {product.priceTypeDescription}
              </span>
            </div>
          </Grid>

          <Grid item xs={12} lg={12}>
            <form className={`${classes.form}`} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <Grid container item spacing={1}>
                <Grid item xs={12} lg={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Controller
                      name="startDate"
                      control={control}
                      defaultValue={null}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DateTimePicker
                          fullWidth={true}
                          id="startDate"
                          label="Data inicial"
                          format="dd/MM/yyyy HH:mm"
                          required
                          ampm={false}
                          disablePast
                          error={!!errors.startDate}
                          helperText={errors?.startDate?.type === 'required' && 'Data inicial é obrigatório'}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Controller
                      name="endDate"
                      control={control}
                      defaultValue={null}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DateTimePicker
                          fullWidth={true}
                          id="endDate"
                          label="Data final"
                          format="dd/MM/yyyy HH:mm"
                          required
                          ampm={false}
                          disablePast
                          error={!!errors.endDate}
                          helperText={errors?.endDate?.type === 'required' && 'Data final é obrigatório'}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <FormControl fullWidth error={!!errors.paymentType}>
                    <Controller
                      control={control}
                      rules={{ required: true }}
                      render={() => (
                        <div>
                          <InputLabel id="paymentType-label">Forma de Pagamento</InputLabel>
                          <Select
                            id="paymentType"
                            fullWidth
                            required
                            displayEmpty
                            defaultValue=""
                            onChange={e => setValue('paymentType', e.target.value)}
                          >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="Dinheiro">Dinheiro</MenuItem>
                            <MenuItem value="Pix">Pix</MenuItem>
                            <MenuItem value="Cartão de Crédito">Cartão de Crédito</MenuItem>
                            <MenuItem value="Cartão de Débito">Cartão de Débito</MenuItem>
                            <MenuItem value="Cheque">Cheque</MenuItem>
                          </Select>
                          {!!errors.paymentType && <FormHelperText>Forma de Pagamento é obrigatório</FormHelperText>}
                        </div>
                      )}
                      name="paymentType"
                    />
                  </FormControl>
                </Grid>
                <Button className={classes.footerButton} variant="contained" color="primary" type="submit">
                  Alugar Produto
                </Button>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};

const mapStateToProps = ({ requestRent }: IRootState) => ({
  requestRent,
});

const mapDispatchToProps = { addRentRequest, reset };

export default connect(mapStateToProps, mapDispatchToProps)(RequestRent);
