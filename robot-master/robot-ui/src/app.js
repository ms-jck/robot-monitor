import '@babel/polyfill';
import dva from 'dva';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import browserHistory from 'history/createBrowserHistory';
// import { createLogger } from 'redux-logger';
import { message } from 'antd';
import './rollbar';
import './index.less';
import router from './router';

// 1. 创建应用，返回 dva 实例
const app = dva({
  history: browserHistory(),
  onError(e) {
    message.error(e.message, /* duration */3);
  },
  // onAction: createLogger({}),
});

// 2. 配置 hooks 或者注册插件
// app.use({});
app.use(createLoading());

// 3. 注册 model
app.model(require('./models/global').default);
app.model(require('./models/picture1').default);
app.model(require('./models/picture2').default);
app.model(require('./models/picture3').default);
app.model(require('./models/picture4').default);
app.model(require('./models/picture5').default);
app.model(require('./models/picture6').default);
app.model(require('./models/indice').default);
app.model(require('./models/log').default);
app.model(require('./models/monitor').default);
app.model(require('./models/container').default);

// 4. 注册路由表
app.router(router);

// 5. 启动应用
app.start('#root');
