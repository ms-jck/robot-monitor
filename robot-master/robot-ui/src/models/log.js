import { routerRedux } from 'dva/router';
import { getLogs, deleteLog } from '../services/log';

export default {
  namespace: 'log',

  state: {
    index: 'logstash-2018.08.24',
    total: 0,
    dataSource: null,
  },

  // subscriptions: {
  //   /**
  //    * 监听浏览器地址，当跳转到 /user 时进入该方法
  //    * @param dispatch 触发器，用于触发 effects 中的 query 方法
  //    * @param history 浏览器历史记录，主要用到它的 location 属性以获取地址栏地址
  //    */
  //   setup({ dispatch, history }) {
  //     history.listen((location) => {
  //       console.log('location is: %o', location);
  //       console.log('重定向接收参数：%o', location.state);
  //       // 调用 effects 属性中的 query 方法，并将 location.state 作为参数传递
  //       // dispatch({
  //       //   type: 'query',
  //       //   payload: location.state,
  //       // })
  //     });
  //   },
  // },

  effects: {
    *getLogs({ url, params }, { call, put }) {
      const res = yield call(getLogs, url, params);
      yield put({
        type: 'save',
        payload: res,
      });
    },

    *deleteLog({ getUrl, deleteUrl, params }, { call, put }) {
      const res = yield call(deleteLog, deleteUrl);
      yield put({ type: 'getLogs', url: getUrl, params });
    },

  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        total: payload.hits.total,
        dataSource: payload.hits.hits,
      };
    },
    delete(state, { payload }) {
      return {
        ...state,
        result: payload.result,
      };
    },
  },
};
