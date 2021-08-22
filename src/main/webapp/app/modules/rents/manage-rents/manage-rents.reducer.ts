import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  GET_MANAGE_RENTS: 'manage-rents/GET_MANAGE_RENTS',
  UPDATE_STATUS: 'manage-rents/UPDATE_STATUS',
  RESET: 'manage-rents/RESET',
};

const initialState = {
  loading: false,
  products: [],
  errorMessage: null,
};

export type ManageRentsState = Readonly<typeof initialState>;

// Reducer
export default (state: ManageRentsState = initialState, action): ManageRentsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_MANAGE_RENTS):
      return {
        ...state,
        products: [],
        loading: true,
      };
    case FAILURE(ACTION_TYPES.GET_MANAGE_RENTS):
    case FAILURE(ACTION_TYPES.UPDATE_STATUS):
      return {
        ...initialState,
        errorMessage: action.payload.response.data.errorKey,
      };
    case SUCCESS(ACTION_TYPES.GET_MANAGE_RENTS):
      return {
        ...initialState,
        products: action.payload.data,
      };
    case REQUEST(ACTION_TYPES.UPDATE_STATUS):
      return {
        ...state,
        loading: true,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_STATUS):
      return {
        ...initialState,
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
export const getManageRents: () => void = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_MANAGE_RENTS,
    payload: axios.get('api/admin/rents/owner'),
  });
};

export const updateStatus: (id: string, status: string) => void = (id: string, status: string) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_STATUS,
    payload: axios.put(`api/admin/rents/${id}`, { status }),
    meta: {
      successMessage: 'Status atualizado',
    },
  });

  await dispatch(getManageRents());
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
