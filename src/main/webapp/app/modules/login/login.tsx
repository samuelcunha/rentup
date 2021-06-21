import React from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { IRootState } from 'app/shared/reducers';
import { login } from 'app/shared/reducers/authentication';
import { Link } from 'react-router-dom';
import { Button, Checkbox, Container, FormControlLabel, Grid, makeStyles, TextField } from '@material-ui/core';
import { Translate } from 'react-jhipster';
import Header from '../../shared/layout/header/header';
import { Alert } from 'reactstrap';
import { Controller, useForm } from 'react-hook-form';

export interface ILoginProps extends StateProps, DispatchProps, RouteComponentProps<any> {}

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: '100px',
    minHeight: '100vh',
    display: 'flex',
  },
  logo: {
    width: '200px',
  },
  actions: {
    display: 'flex',
    marginTop: theme.spacing(5),
  },
  options: {
    display: 'flex',
    margin: theme.spacing(1),
  },
}));

export const Login = props => {
  const classes = useStyles();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();
  const onSubmit = ({ username, password, rememberMe }) => {
    props.login(username, password, rememberMe);
  };

  const { location, isAuthenticated } = props;
  const { from } = location.state || { from: { pathname: '/', search: location.search } };
  if (isAuthenticated) {
    return <Redirect to={from} />;
  }
  return (
    <Container disableGutters maxWidth={false}>
      <Header title="Autenticação"></Header>

      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={0} direction="column" alignItems="center" className={classes.container}>
          <Grid container item xs={12} justify="center">
            <img src="content/images/logo.png" alt="Logo" className={classes.logo} />
          </Grid>
          <Grid container direction="row" justify="center" alignItems="center" spacing={0}>
            <Grid item container spacing={1} xs={12} md={6} lg={3} justify="center">
              <Grid item xs={11} lg={12}>
                <TextField
                  {...register('username', { required: true, maxLength: 50 })}
                  error={!!errors.username}
                  helperText={errors.username?.type === 'required' && 'Usuário é obrigatório'}
                  label="Usuário"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={11} lg={12}>
                <TextField
                  {...register('password', { required: true, maxLength: 15 })}
                  error={!!errors.password}
                  helperText={errors.password?.type === 'required' && 'Senha é obrigatória'}
                  required
                  label="Senha"
                  type="password"
                  fullWidth
                />
              </Grid>
              <Grid item container xs={12} lg={12} justify="space-between" className={classes.options}>
                <Controller
                  control={control}
                  name="rememberMe"
                  defaultValue={false}
                  render={({ field }) => <FormControlLabel control={<Checkbox size="small" {...field} />} label="Manter conectado" />}
                />

                <Link to="/account/reset/request">
                  <Button color="secondary" type="button" size="small">
                    Esqueceu a senha?
                  </Button>
                </Link>
              </Grid>
              {props.loginError ? (
                <Alert color="danger" data-cy="loginError">
                  <Translate contentKey="login.messages.error.authentication">
                    <strong>Failed to sign in!</strong> Please check your credentials and try again.
                  </Translate>
                </Alert>
              ) : null}
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={11}
            md={6}
            lg={3}
            spacing={0}
            justify="space-between"
            className={!props.loginError ? classes.actions : null}
          >
            <Link to="/account/register">
              <Button color="secondary" type="button">
                Criar conta
              </Button>
            </Link>
            <Button variant="contained" color="primary" type="submit">
              Entrar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  isAuthenticated: authentication.isAuthenticated,
  loginError: authentication.loginError,
  showModal: authentication.showModalLogin,
});

const mapDispatchToProps = { login };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Login);
