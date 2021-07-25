import thunk from 'redux-thunk';
import axios from 'axios';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import createProduct, { ACTION_TYPES, handleCreateProduct, reset } from './create-product.reducer';

describe('Creating account tests', () => {
  const initialState = {
    loading: false,
    createProductSuccess: false,
    createProductFailure: false,
    errorMessage: null,
  };

  beforeAll(() => {});

  it('should return the initial state', () => {
    expect(createProduct(undefined, {})).toEqual({
      ...initialState,
    });
  });

  it('should detect a request', () => {
    expect(createProduct(undefined, { type: REQUEST(ACTION_TYPES.CREATE_PRODUCT) })).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should handle RESET', () => {
    expect(
      createProduct(
        { loading: true, createProductSuccess: true, createProductFailure: true, errorMessage: '' },
        { type: ACTION_TYPES.RESET }
      )
    ).toEqual({
      ...initialState,
    });
  });

  it('should handle CREATE_PRODUCT success', () => {
    expect(
      createProduct(undefined, {
        type: SUCCESS(ACTION_TYPES.CREATE_PRODUCT),
        payload: 'fake payload',
      })
    ).toEqual({
      ...initialState,
      createProductSuccess: true,
    });
  });

  it('should handle CREATE_PRODUCT failure', () => {
    const payload = { response: { data: { errorKey: 'fake error' } } };
    expect(
      createProduct(undefined, {
        type: FAILURE(ACTION_TYPES.CREATE_PRODUCT),
        payload,
      })
    ).toEqual({
      ...initialState,
      createProductFailure: true,
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
    });

    it('dispatches CREATE_PRODUCT_PENDING and CREATE_PRODUCT_FULFILLED actions', async () => {
      const meta = {
        successMessage: 'Produto adicionado',
      };

      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.CREATE_PRODUCT),
          meta,
        },
        {
          type: SUCCESS(ACTION_TYPES.CREATE_PRODUCT),
          payload: resolvedObject,
          meta,
        },
      ];
      await store.dispatch(handleCreateProduct({})).then(() => expect(store.getActions()).toEqual(expectedActions));
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
