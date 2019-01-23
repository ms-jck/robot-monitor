import { routerRedux } from 'dva/router';
import { getIndices, deleteIndice } from '../services/log';

export default {
  namespace: 'indice',

  state: {
    data: null,
  },

  effects: {
    *getIndices({ payload }, { call, put }) {
      const res = yield call(getIndices, payload);
      yield put({
        type: 'save',
        payload: res,
      });
    },

    *deleteIndice({ index }, { call, put }) {
      const res = yield call(deleteIndice, index);
      yield put({
        type: 'getIndices',
        payload: {},
      });
    },

    // *redirectToLogs({ payload }, { put }) {
    //   yield put(routerRedux.push({ '/dashboard/monitor', { name: 'dkvirus' } ));
    // },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },
};
