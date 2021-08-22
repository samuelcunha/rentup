import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  ADD_RENT_REQUEST: 'request-rent/ADD_RENT_REQUEST',
  RESET: 'request-rent/RESET',
};

const initialState = {
  loading: false,
  requestRentSuccess: false,
  requestRentFailure: false,
  errorMessage: null,
};

export type RequestRentState = Readonly<typeof initialState>;

// Reducer
export default (state: RequestRentState = initialState, action): RequestRentState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.ADD_RENT_REQUEST):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.ADD_RENT_REQUEST):
      return {
        ...initialState,
        requestRentFailure: true,
        errorMessage: action.payload.response.data.errorKey,
      };
    case SUCCESS(ACTION_TYPES.ADD_RENT_REQUEST):
      return {
        ...initialState,
        requestRentSuccess: true,
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
export const addRentRequest = values => ({
  type: ACTION_TYPES.ADD_RENT_REQUEST,
  payload: axios.post('api/admin/rents', values),
  meta: {
    successMessage: 'Solicitação enviada',
  },
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
