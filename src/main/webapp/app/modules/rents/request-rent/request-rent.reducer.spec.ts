import thunk from 'redux-thunk';
import axios from 'axios';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import { TranslatorContext } from 'react-jhipster';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import requestRent, { ACTION_TYPES, addRentRequest, reset } from './request-rent.reducer';

describe('Creating account tests', () => {
  const initialState = {
    loading: false,
    requestRentSuccess: false,
    requestRentFailure: false,
    errorMessage: null,
  };

  beforeAll(() => {
    TranslatorContext.registerTranslations('pt-br', {});
  });

  it('should return the initial state', () => {
    expect(requestRent(undefined, {})).toEqual({
      ...initialState,
    });
  });

  it('should detect a request', () => {
    expect(requestRent(undefined, { type: REQUEST(ACTION_TYPES.ADD_RENT_REQUEST) })).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should handle RESET', () => {
    expect(
      requestRent({ loading: true, requestRentSuccess: true, requestRentFailure: true, errorMessage: '' }, { type: ACTION_TYPES.RESET })
    ).toEqual({
      ...initialState,
    });
  });

  it('should handle ADD_RENT_REQUEST success', () => {
    expect(
      requestRent(undefined, {
        type: SUCCESS(ACTION_TYPES.ADD_RENT_REQUEST),
        payload: 'fake payload',
      })
    ).toEqual({
      ...initialState,
      requestRentSuccess: true,
    });
  });

  it('should handle ADD_RENT_REQUEST failure', () => {
    const payload = { response: { data: { errorKey: 'fake error' } } };
    expect(
      requestRent(undefined, {
        type: FAILURE(ACTION_TYPES.ADD_RENT_REQUEST),
        payload,
      })
    ).toEqual({
      ...initialState,
      requestRentFailure: true,
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

    it('dispatches ADD_RENT_REQUEST_PENDING and ADD_RENT_REQUEST_FULFILLED actions', async () => {
      const meta = {
        successMessage: 'Solicitação enviada',
      };

      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.ADD_RENT_REQUEST),
          meta,
        },
        {
          type: SUCCESS(ACTION_TYPES.ADD_RENT_REQUEST),
          payload: resolvedObject,
          meta,
        },
      ];
      await store.dispatch(addRentRequest({})).then(() => expect(store.getActions()).toEqual(expectedActions));
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
