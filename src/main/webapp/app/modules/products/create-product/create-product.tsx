import React, { useEffect } from 'react';

import { IRootState } from 'app/shared/reducers';
import Header from '../../../shared/layout/header/header';
import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { reset } from '../../administration/user-management/user-management.reducer';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { handleCreateProduct } from './create-product.reducer';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: '35px',
    display: 'flex',
  },
  form: {
    margin: 'auto',
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

export const CreateProduct = props => {
  useEffect(() => {
    props.reset();
    props.createProduct.createProductSuccess = false;
    return () => {
      props.reset();
    };
  }, []);
  const classes = useStyles();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm();

  const onSubmit = values => {
    const payload = { ...values, priceCurrency: 'BRL' };
    props.handleCreateProduct(payload);
  };

  if (props.createProduct.createProductSuccess) {
    return <Redirect to="/products/user" />;
  }

  return (
    <Container disableGutters maxWidth={false}>
      <Header title="Anunciar Produto"></Header>
      <Container className={classes.container} maxWidth={false}>
        <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <Grid container spacing={0} direction="column" alignItems="center" className={classes.container}>
            <Grid container direction="row" justify="center" alignItems="center" spacing={0}>
              <Grid item container spacing={1} xs={12} justify="center">
                <Grid item xs={12} lg={12}>
                  <TextField
                    {...register('name', { required: true, maxLength: 100 })}
                    error={!!errors.name}
                    helperText={errors?.name?.type === 'required' && 'Nome é obrigatório'}
                    label="Nome"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <FormControl fullWidth error={!!errors.category}>
                    <Controller
                      control={control}
                      rules={{ required: true }}
                      render={() => (
                        <div>
                          <InputLabel id="category-label">Categoria</InputLabel>
                          <Select
                            labelId="category-label"
                            id="category"
                            fullWidth
                            required
                            displayEmpty
                            defaultValue=""
                            onChange={e => setValue('category', e.target.value)}
                          >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="Eletrodoméstico">Eletrodoméstico</MenuItem>
                            <MenuItem value="Ferramenta">Ferramenta</MenuItem>
                            <MenuItem value="Imóvel">Imóvel</MenuItem>
                            <MenuItem value="Instrumento Musical">Instrumento Musical</MenuItem>
                            <MenuItem value="Veículo">Veículo</MenuItem>
                            <MenuItem value="Videogame">Videogame</MenuItem>
                            <MenuItem value="Outro">Outro</MenuItem>
                          </Select>
                          {!!errors.category && <FormHelperText>Categoria é obrigatório</FormHelperText>}
                        </div>
                      )}
                      name="category"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={5} lg={5}>
                  <TextField
                    {...register('priceBase', {
                      required: true,
                    })}
                    type="number"
                    error={!!errors.priceBase}
                    helperText={errors?.priceBase?.type === 'required' && 'Preço é obrigatório'}
                    required
                    label="Preço"
                    fullWidth
                  />
                </Grid>
                <Grid container item xs={1} lg={1} justify="flex-end" direction="column" className={classes.priceSeparator}>
                  <span>/</span>
                </Grid>

                <Grid item xs={6} lg={6}>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      defaultValue="DAY"
                      render={() => (
                        <div>
                          <InputLabel id="priceType-label"></InputLabel>
                          <Select
                            labelId="priceType-label"
                            id="priceType"
                            fullWidth
                            displayEmpty
                            defaultValue="DAY"
                            onChange={e => setValue('priceType', e.target.value)}
                          >
                            <MenuItem value="HOUR">Hora</MenuItem>
                            <MenuItem value="DAY">Dia</MenuItem>
                            <MenuItem value="WEEK">Semana</MenuItem>
                            <MenuItem value="MONTH">Mês</MenuItem>
                          </Select>
                        </div>
                      )}
                      name="priceType"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    {...register('imageUrl', { pattern: /(www|http:|https:)+[^\s]+[\w]/ })}
                    error={!!errors.imageUrl}
                    helperText={errors.imageUrl?.type === 'pattern' && 'Link inválido'}
                    label="Link Imagem"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    {...register('description', { required: true, maxLength: 100 })}
                    error={!!errors.description}
                    helperText={errors.description?.type === 'required' && 'Descrição é obrigatória'}
                    required
                    multiline
                    rows={2}
                    rowsMax={4}
                    label="Descrição"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Button className={classes.footerButton} variant="contained" color="primary" type="submit">
            Anunciar Produto
          </Button>
        </form>
      </Container>
    </Container>
  );
};

const mapStateToProps = ({ locale, createProduct }: IRootState) => ({
  currentLocale: locale.currentLocale,
  createProduct,
});

const mapDispatchToProps = { handleCreateProduct, reset };

export default connect(mapStateToProps, mapDispatchToProps)(CreateProduct);
