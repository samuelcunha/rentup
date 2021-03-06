import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale, { LocaleState } from './locale';
import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import createProduct, { CreateProductState } from 'app/modules/products/create-product/create-product.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
import listProducts, { ListProductsState } from 'app/modules/products/list-products/list-products.reducer';
import searchProduct, { SearchProductState } from 'app/modules/products/search-product/search-product.reducer';
import manageRents, { ManageRentsState } from 'app/modules/rents/manage-rents/manage-rents.reducer';
import myRents, { MyRentsState } from 'app/modules/rents/my-rents/my-rents.reducer';
import requestRent, { RequestRentState } from 'app/modules/rents/request-rent/request-rent.reducer';

/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
  readonly createProduct: CreateProductState;
  readonly listProducts: ListProductsState;
  readonly searchProduct: SearchProductState;
  readonly manageRents: ManageRentsState;
  readonly myRents: MyRentsState;
  readonly requestRent: RequestRentState;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  locale,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
  createProduct,
  listProducts,
  searchProduct,
  manageRents,
  myRents,
  requestRent,
});

export default rootReducer;
