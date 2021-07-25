import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  CREATE_PRODUCT: 'create-product/CREATE_PRODUCT',
  RESET: 'create-product/RESET',
};

const initialState = {
  loading: false,
  createProductSuccess: false,
  createProductFailure: false,
  errorMessage: null,
};

export type CreateProductState = Readonly<typeof initialState>;

// Reducer
export default (state: CreateProductState = initialState, action): CreateProductState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.CREATE_PRODUCT):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.CREATE_PRODUCT):
      return {
        ...initialState,
        createProductFailure: true,
        errorMessage: action.payload.response.data.errorKey,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PRODUCT):
      return {
        ...initialState,
        createProductSuccess: true,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

// Actions
export const handleCreateProduct = values => ({
  type: ACTION_TYPES.CREATE_PRODUCT,
  payload: axios.post('api/admin/products', values),
  meta: {
    successMessage: 'Produto adicionado',
  },
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
