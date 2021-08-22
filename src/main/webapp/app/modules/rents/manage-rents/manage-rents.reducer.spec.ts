import thunk from 'redux-thunk';
import axios from 'axios';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import manageRents, { ACTION_TYPES, getManageRents, updateStatus, reset } from './manage-rents.reducer';

describe('Creating list product tests', () => {
  const initialState = {
    loading: false,
    errorMessage: null,
    products: [],
  };

  beforeAll(() => {});

  it('should return the initial state', () => {
    expect(manageRents(undefined, {})).toEqual({
      ...initialState,
    });
  });

  it('should detect a GET_MANAGE_RENTS request', () => {
    expect(manageRents(undefined, { type: REQUEST(ACTION_TYPES.GET_MANAGE_RENTS) })).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should detect a UPDATE_STATUS request', () => {
    expect(manageRents(undefined, { type: REQUEST(ACTION_TYPES.UPDATE_STATUS) })).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should handle RESET', () => {
    expect(manageRents({ loading: true, products: [], errorMessage: '' }, { type: ACTION_TYPES.RESET })).toEqual({
      ...initialState,
    });
  });

  it('should handle GET_MANAGE_RENTS success', () => {
    expect(
      manageRents(undefined, {
        type: SUCCESS(ACTION_TYPES.GET_MANAGE_RENTS),
        payload: { data: 'fake payload' },
      })
    ).toEqual({
      ...initialState,
      products: 'fake payload',
    });
  });

  it('should handle GET_MANAGE_RENTS failure', () => {
    const payload = { response: { data: { errorKey: 'fake error' } } };
    expect(
      manageRents(undefined, {
        type: FAILURE(ACTION_TYPES.GET_MANAGE_RENTS),
        payload,
      })
    ).toEqual({
      ...initialState,
      errorMessage: payload.response.data.errorKey,
    });
  });

  it('should handle UPDATE_STATUS success', () => {
    expect(
      manageRents(undefined, {
        type: SUCCESS(ACTION_TYPES.UPDATE_STATUS),
        payload: { data: 'fake payload' },
      })
    ).toEqual({
      ...initialState,
    });
  });

  it('should handle UPDATE_STATUS failure', () => {
    const payload = { response: { data: { errorKey: 'fake error' } } };
    expect(
      manageRents(undefined, {
        type: FAILURE(ACTION_TYPES.UPDATE_STATUS),
        payload,
      })
    ).toEqual({
      ...initialState,
      errorMessage: payload.response.data.errorKey,
    });
  });

  describe('Actions', () => {
    let store;

    const resolvedObject = { value: 'whatever' };
    beforeEach(() => {
      const mockStore = configureStore([thunk, promiseMiddleware]);
      store = mockStore({});
      axios.post = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.get = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.put = sinon.stub().returns(Promise.resolve(resolvedObject));
    });

    it('dispatches GET_MANAGE_RENTS_PENDING and GET_MANAGE_RENTS_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.GET_MANAGE_RENTS),
        },
        {
          type: SUCCESS(ACTION_TYPES.GET_MANAGE_RENTS),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(getManageRents()).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches UPDATE_STATUS_PENDING and UPDATE_STATUS_FULFILLED actions', async () => {
      const meta = {
        successMessage: 'Status atualizado',
      };
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.UPDATE_STATUS),
          meta,
        },
        {
          type: SUCCESS(ACTION_TYPES.UPDATE_STATUS),
          meta,
          payload: resolvedObject,
        },
        { type: REQUEST(ACTION_TYPES.GET_MANAGE_RENTS) },
        { type: SUCCESS(ACTION_TYPES.GET_MANAGE_RENTS), payload: resolvedObject },
      ];
      await store.dispatch(updateStatus('rentId', 'status')).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.RESET actions', async () => {
      const expectedActions = [
        {
          type: ACTION_TYPES.RESET,
        },
      ];
      await store.dispatch(reset());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
