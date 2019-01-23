import Store from 'store';
import request from '../utils/request';

// 用户登录
export async function signIn(params) {
  return request('/api/user/login', {
    method: 'POST',
    body: params,
  });
}

// 用户退出了
export async function signOut() {
  // 清除TOKEN，模拟退出
  Store.clearAll();
  return true;
}

// 获取主机信息
export async function getHosts() {
  // return request(`/logapi/_cat/indices?pretty${stringify(params)}`);
  return request(`/api/host?username=${Store.get('USER_NAME')}`);
}

// 获取单个主机信息
export async function getHost(id) {
  // return request(`/logapi/_cat/indices?pretty${stringify(params)}`);
  return request(`/api/host/${id}`);
}

// 编辑主机信息
export async function editHost(params) {
  // return request(`/logapi/_cat/indices?pretty${stringify(params)}`);
  return request('/api/host', {
    method: 'PUT',
    body: params,
  });
}

// 删除主机信息
export async function deleteHost(id) {
  // return request(`/logapi/_cat/indices?pretty${stringify(params)}`);
  return request(`/api/host/${id}`, {
    method: 'DELETE',
  });
}

// 加入监视
export async function addMonitor(params) {
  // return request(`/logapi/_cat/indices?pretty${stringify(params)}`);
  return request('/api/monitor_host', {
    method: 'POST',
    body: {
      username: Store.get('USER_NAME'),
      ...params,
    },
  });
}

// 获取监视主机
export async function getMonitor() {
  // return request(`/logapi/_cat/indices?pretty${stringify(params)}`);
  return request(`/api/monitor_host?username=${Store.get('USER_NAME')}`);
}

// 取消监视
export async function deleteMonitor(params) {
  // return request(`/logapi/_cat/indices?pretty${stringify(params)}`);
  return request('/api/monitor_host', {
    method: 'DELETE',
    body: {
      username: Store.get('USER_NAME'),
      ...params,
    },
  });
}

// 提交分割错误的图片
export async function submitErrorPic(params) {
  return request('/api/submitErrorPic', {
    method: 'POST',
    body: params,
  });
}

// 启动机器
export async function startRobot(params) {
  return request('/api/startRobot', {
    method: 'POST',
    body: params,
  });
}

// 停止机器
export async function stopRobot(params) {
  return request('/api/stopRobot', {
    method: 'POST',
    body: params,
  });
}

// 重启机器
export async function restartRobot(params) {
  return request('/api/restartRobot', {
    method: 'POST',
    body: params,
  });
}
