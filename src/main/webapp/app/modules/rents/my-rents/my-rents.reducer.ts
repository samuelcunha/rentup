import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  GET_MY_RENTS: 'my-rents/GET_MY_RENTS',
  RESET: 'my-rents/RESET',
};

const initialState = {
  loading: false,
  products: [],
  errorMessage: null,
};

export type MyRentsState = Readonly<typeof initialState>;

// Reducer
export default (state: MyRentsState = initialState, action): MyRentsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_MY_RENTS):
      return {
        ...state,
        products: [],
        loading: true,
      };
    case FAILURE(ACTION_TYPES.GET_MY_RENTS):
      return {
        ...initialState,
        errorMessage: action.payload.response.data.errorKey,
      };
    case SUCCESS(ACTION_TYPES.GET_MY_RENTS):
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
export const getMyRents: () => void = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_MY_RENTS,
    payload: axios.get('api/admin/rents/user'),
  });
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
