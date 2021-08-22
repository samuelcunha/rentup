import thunk from 'redux-thunk';
import axios from 'axios';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import myRents, { ACTION_TYPES, getMyRents, reset } from './my-rents.reducer';

describe('Creating list product tests', () => {
  const initialState = {
    loading: false,
    errorMessage: null,
    products: [],
  };

  beforeAll(() => {});

  it('should return the initial state', () => {
    expect(myRents(undefined, {})).toEqual({
      ...initialState,
    });
  });

  it('should detect a request', () => {
    expect(myRents(undefined, { type: REQUEST(ACTION_TYPES.GET_MY_RENTS) })).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should handle RESET', () => {
    expect(myRents({ loading: true, products: [], errorMessage: '' }, { type: ACTION_TYPES.RESET })).toEqual({
      ...initialState,
    });
  });

  it('should handle GET_MY_RENTS success', () => {
    expect(
      myRents(undefined, {
        type: SUCCESS(ACTION_TYPES.GET_MY_RENTS),
        payload: { data: 'fake payload' },
      })
    ).toEqual({
      ...initialState,
      products: 'fake payload',
    });
  });

  it('should handle GET_MY_RENTS failure', () => {
    const payload = { response: { data: { errorKey: 'fake error' } } };
    expect(
      myRents(undefined, {
        type: FAILURE(ACTION_TYPES.GET_MY_RENTS),
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
    });

    it('dispatches GET_MY_RENTS_PENDING and GET_MY_RENTS_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.GET_MY_RENTS),
        },
        {
          type: SUCCESS(ACTION_TYPES.GET_MY_RENTS),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(getMyRents()).then(() => expect(store.getActions()).toEqual(expectedActions));
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
