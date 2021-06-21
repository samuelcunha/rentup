import React from 'react';

import { IRootState } from 'app/shared/reducers';
import Header from '../../../shared/layout/header/header';
import { Container, Grid, TextField, makeStyles, Button } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { handleRegister } from './register.reducer';
import { reset } from '../../administration/user-management/user-management.reducer';
import { connect } from 'react-redux';
import { format } from 'date-fns';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: '35px',
    minHeight: '100vh',
    display: 'flex',
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
}));

export const RegisterPage = props => {
  const classes = useStyles();
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    control,
  } = useForm();

  const onSubmit = values => {
    const payload = { ...values };
    payload.birthDate = formatDate(payload.birthDate);
    props.handleRegister(payload);
  };

  const formatDate = (date: Date) => {
    return format(date, 'yyyy-dd-MM');
  };

  const getMaxDate = () => {
    const currentYear = new Date().getFullYear();
    return new Date().setFullYear(currentYear - 18);
  };

  const getPasswordHelperText = errorType => {
    let helperText = null;
    if (errorType === 'required') {
      helperText = 'Campo obrigatório';
    } else if (errorType === 'validate') {
      helperText = 'Senha e confirmação de senha devem ser iguais';
    }
    return helperText;
  };

  return (
    <Container disableGutters maxWidth={false}>
      <Header title="Registrar"></Header>
      <Container className={classes.container} maxWidth={false}>
        <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={0} direction="column" alignItems="center" className={classes.container}>
            <Grid container direction="row" justify="center" alignItems="center" spacing={0}>
              <Grid item container spacing={1} xs={12} md={6} lg={3} justify="center">
                <Grid item xs={12} lg={12}>
                  <TextField
                    {...register('username', { required: true, maxLength: 50 })}
                    error={!!errors.username}
                    helperText={errors?.username?.type === 'required' && 'Usuário é obrigatório'}
                    label="Usuário"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    {...register('email', { required: true, maxLength: 60, pattern: /^\S+@\S+$/i })}
                    error={!!errors.email}
                    helperText={errors?.email?.type === 'required' && 'E-mail é obrigatório'}
                    label="E-mail"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    {...register('firstPassword', {
                      required: true,
                      maxLength: 15,
                      validate: () => getValues('firstPassword') === getValues('secondPassword'),
                    })}
                    error={!!errors.firstPassword}
                    helperText={getPasswordHelperText(errors?.firstPassword?.type)}
                    required
                    label="Senha"
                    type="password"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    {...register('secondPassword', {
                      required: true,
                      maxLength: 15,
                      validate: () => getValues('firstPassword') === getValues('secondPassword'),
                    })}
                    error={!!errors.secondPassword}
                    helperText={getPasswordHelperText(errors?.firstPassword?.type)}
                    required
                    label="Confirmação da senha"
                    type="password"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Controller
                      name="birthDate"
                      control={control}
                      defaultValue={null}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <KeyboardDatePicker
                          fullWidth={true}
                          id="birthDate"
                          label="Data de nascimento"
                          format="dd/MM/yyyy"
                          required
                          maxDate={getMaxDate()}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                          error={!!errors.birthDate}
                          helperText={errors?.birthDate?.type === 'required' && 'Data de nascimento é obrigatória'}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    {...register('address.street', { required: true, maxLength: 100 })}
                    error={!!errors.address && !!errors.address.street}
                    helperText={errors.address && errors.address.street?.type === 'required' && 'Rua é obrigatória'}
                    required
                    label="Rua"
                    fullWidth
                  />
                </Grid>
                <Grid item container justify="space-between" spacing={1}>
                  <Grid item xs={6} lg={6}>
                    <TextField
                      {...register('address.number', { required: true })}
                      error={!!errors.address && !!errors.address.number}
                      helperText={errors.address && errors.address.number?.type === 'required' && 'Número é obrigatório'}
                      required
                      label="Número"
                      type="tel"
                    />
                  </Grid>
                  <Grid item xs={6} lg={6}>
                    <TextField
                      {...register('address.complement', { maxLength: 50 })}
                      error={!!errors.address && !!errors.address.complement}
                      label="Complemento"
                    />
                  </Grid>
                </Grid>
                <Grid item container justify="space-between" spacing={1}>
                  <Grid item xs={6} lg={6}>
                    <TextField
                      {...register('address.city', { required: true })}
                      error={!!errors.address && !!errors.address.city}
                      helperText={errors.address && errors.address.city?.type === 'required' && 'Cidade é obrigatório'}
                      required
                      label="Cidade"
                    />
                  </Grid>
                  <Grid item xs={6} lg={6}>
                    <TextField
                      {...register('address.state', { required: true })}
                      error={!!errors.address && !!errors.address.state}
                      helperText={errors.address && errors.address.state?.type === 'required' && 'Estado é obrigatório'}
                      required
                      label="Estado"
                    />
                  </Grid>
                </Grid>
                <Grid item container justify="space-between" spacing={1}>
                  <Grid item xs={6} lg={6}>
                    <TextField
                      {...register('address.zipCode', { required: true })}
                      error={!!errors.address && !!errors.address.zipCode}
                      helperText={errors.address && errors.address.zipCode?.type === 'required' && 'CEP'}
                      required
                      label="CEP"
                    />
                  </Grid>
                  <Grid item xs={6} lg={6}>
                    <TextField
                      {...register('address.country', { required: true })}
                      error={!!errors.address && !!errors.address.country}
                      helperText={errors.address && errors.address.country?.type === 'required' && 'País é obrigatório'}
                      required
                      label="País"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Button className={classes.footerButton} variant="contained" color="primary" type="submit">
            Criar conta
          </Button>
        </form>
      </Container>
    </Container>
  );
};

const mapStateToProps = ({ locale }: IRootState) => ({
  currentLocale: locale.currentLocale,
});

const mapDispatchToProps = { handleRegister, reset };
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
