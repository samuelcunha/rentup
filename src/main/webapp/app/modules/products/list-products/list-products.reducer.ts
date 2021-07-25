import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  GET_PRODUCTS: 'create-product/GET_PRODUCTS',
  RESET: 'create-product/RESET',
};

const initialState = {
  loading: false,
  products: [],
  errorMessage: null,
};

export type ListProductsState = Readonly<typeof initialState>;

// Reducer
export default (state: ListProductsState = initialState, action): ListProductsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_PRODUCTS):
      return {
        ...state,
        products: [],
        loading: true,
      };
    case FAILURE(ACTION_TYPES.GET_PRODUCTS):
      return {
        ...initialState,
        errorMessage: action.payload.response.data.errorKey,
      };
    case SUCCESS(ACTION_TYPES.GET_PRODUCTS):
      return {
        ...initialState,
        products: action.payload.data,
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
export const getProducts: () => void = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_PRODUCTS,
    payload: axios.get('api/admin/products'),
  });
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
