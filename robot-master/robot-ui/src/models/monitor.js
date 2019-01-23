import { routerRedux } from 'dva/router';
import { editHost, getHosts, deleteHost, addMonitor, getMonitor, deleteMonitor } from '../services/api';

export default {
  namespace: 'monitor',

  state: {
    hosts: {},
    monitors: {},
  },

  effects: {
    *getHosts(_, { call, put }) {
      const res = yield call(getHosts);
      yield put({
        type: 'save',
        payload: res,
      });
    },

    *editHost({ params }, { call, put }) {
      const res = yield call(editHost, params);
      yield put({
        type: 'getHosts',
      });
    },

    *deleteHost({ id }, { call, put }) {
      const res = yield call(deleteHost, id);
      yield put({
        type: 'getHosts',
      });
    },

    *addMonitor({ params }, { call, put }) {
      const res = yield call(addMonitor, params);
      yield put({
        type: 'getHosts',
      });
    },

    *getMonitor(_, { call, put }) {
      const res = yield call(getMonitor);
      yield put({
        type: 'saveMonitor',
        payload: res,
      });
    },

    *deleteMonitor({ params }, { call, put }) {
      const res = yield call(deleteMonitor, params);
      yield put({
        type: 'getHosts',
      });
      yield put({
        type: 'getMonitor',
      });
    },

  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        hosts: payload.data,
      };
    },
    saveMonitor(state, { payload }) {
      return {
        ...state,
        monitors: payload.data,
      };
    },
  },
};
