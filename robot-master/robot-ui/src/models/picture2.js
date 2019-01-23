import { submitErrorPic, startRobot, stopRobot, restartRobot } from '../services/api';

export default {
  namespace: 'picture2',

  state: {
    data: null,
    running: false,
  },

  effects: {
    *submitErrorPic({ payload }, { call, put }) {
      const res = yield call(submitErrorPic, payload);
      yield put({
        type: 'save',
        payload: res,
      });
    },

    *startRobot({ payload }, { call, put }) {
      const res = yield call(startRobot, payload);
      if (res.status === 200) {
        yield put({
          type: 'saveRunning',
          payload: true,
        });
      }
    },

    *stopRobot({ payload }, { call, put }) {
      const res = yield call(stopRobot, payload);
      if (res.status === 200) {
        yield put({
          type: 'saveRunning',
          payload: false,
        });
      }
    },

    *restartRobot({ payload }, { call, put }) {
      const res = yield call(restartRobot, payload);
      if (res.status === 200) {
        yield put({
          type: 'saveRunning',
          payload: true,
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
    saveRunning(state, { payload }) {
      return {
        ...state,
        running: payload,
      };
    },
  },
};
