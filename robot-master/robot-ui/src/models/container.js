import { routerRedux } from 'dva/router';
import { getHost } from '../services/api';

export default {
  namespace: 'container',

  state: {
    host: null,
  },

  effects: {
    *getHost({ id }, { call, put }) {
      const res = yield call(getHost, id);
      yield put({
        type: 'save',
        payload: res,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        host: payload.data,
      };
    },
  },
};
