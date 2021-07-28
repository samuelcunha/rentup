import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  SEARCH_PRODUCT: 'search-product/SEARCH_PRODUCT',
  RESET: 'search-product/RESET',
};

const initialState = {
  loading: false,
  filter: { query: '', params: {} },
  products: [],
  errorMessage: null,
};

export type SearchProductState = Readonly<typeof initialState>;

// Reducer
export default (state: SearchProductState = initialState, action): SearchProductState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_PRODUCT):
      return {
        ...state,
        products: [],
        loading: true,
      };
    case FAILURE(ACTION_TYPES.SEARCH_PRODUCT):
      return {
        ...initialState,
        errorMessage: action.payload.response.data.errorKey,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_PRODUCT):
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

export const findProduct = filter => {
  return {
    type: ACTION_TYPES.SEARCH_PRODUCT,
    payload: axios.get(`api/admin/products/search?filter=${filter.query}`),
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
