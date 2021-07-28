import thunk from 'redux-thunk';
import axios from 'axios';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import searchProduct, { ACTION_TYPES, findProduct, reset } from './search-product.reducer';

describe('Creating search product tests', () => {
  const initialState = {
    loading: false,
    errorMessage: null,
    products: [],
    filter: { query: '', params: {} },
  };

  beforeAll(() => {});

  it('should return the initial state', () => {
    expect(searchProduct(undefined, {})).toEqual({
      ...initialState,
    });
  });

  it('should detect a request', () => {
    expect(searchProduct(undefined, { type: REQUEST(ACTION_TYPES.SEARCH_PRODUCT) })).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should handle RESET', () => {
    expect(
      searchProduct({ loading: true, products: [], filter: { query: '', params: {} }, errorMessage: '' }, { type: ACTION_TYPES.RESET })
    ).toEqual({
      ...initialState,
    });
  });

  it('should handle SEARCH_PRODUCT success', () => {
    expect(
      searchProduct(undefined, {
        type: SUCCESS(ACTION_TYPES.SEARCH_PRODUCT),
        payload: { data: 'fake payload' },
      })
    ).toEqual({
      ...initialState,
      products: 'fake payload',
    });
  });

  it('should handle SEARCH_PRODUCT failure', () => {
    const payload = { response: { data: { errorKey: 'fake error' } } };
    expect(
      searchProduct(undefined, {
        type: FAILURE(ACTION_TYPES.SEARCH_PRODUCT),
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

    it('dispatches SEARCH_PRODUCT_PENDING and SEARCH_PRODUCT_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.SEARCH_PRODUCT),
        },
        {
          type: SUCCESS(ACTION_TYPES.SEARCH_PRODUCT),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(findProduct({ query: 'test', params: {} })).then(() => expect(store.getActions()).toEqual(expectedActions));
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
