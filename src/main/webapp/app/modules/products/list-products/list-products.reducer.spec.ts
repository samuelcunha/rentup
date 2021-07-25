import thunk from 'redux-thunk';
import axios from 'axios';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import listProducts, { ACTION_TYPES, getProducts, reset } from './list-products.reducer';

describe('Creating account tests', () => {
  const initialState = {
    loading: false,
    errorMessage: null,
    products: [],
  };

  beforeAll(() => {});

  it('should return the initial state', () => {
    expect(listProducts(undefined, {})).toEqual({
      ...initialState,
    });
  });

  it('should detect a request', () => {
    expect(listProducts(undefined, { type: REQUEST(ACTION_TYPES.GET_PRODUCTS) })).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should handle RESET', () => {
    expect(listProducts({ loading: true, products: [], errorMessage: '' }, { type: ACTION_TYPES.RESET })).toEqual({
      ...initialState,
    });
  });

  it('should handle GET_PRODUCTS success', () => {
    expect(
      listProducts(undefined, {
        type: SUCCESS(ACTION_TYPES.GET_PRODUCTS),
        payload: { data: 'fake payload' },
      })
    ).toEqual({
      ...initialState,
      products: 'fake payload',
    });
  });

  it('should handle GET_PRODUCTS failure', () => {
    const payload = { response: { data: { errorKey: 'fake error' } } };
    expect(
      listProducts(undefined, {
        type: FAILURE(ACTION_TYPES.GET_PRODUCTS),
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

    it('dispatches GET_PRODUCTS_PENDING and GET_PRODUCTS_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.GET_PRODUCTS),
        },
        {
          type: SUCCESS(ACTION_TYPES.GET_PRODUCTS),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(getProducts()).then(() => expect(store.getActions()).toEqual(expectedActions));
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
