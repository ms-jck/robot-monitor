import Store from 'store';
import { stringify } from 'qs';
import request from '../utils/request';

const baseUrl = '/logapi';

// 获取索引
export async function getIndices(params) {
  // return request(`/logapi/_cat/indices?pretty${stringify(params)}`);
  return request('/logapi/_cat/indices?pretty');
}

// 删除索引
export async function deleteIndice(index) {
  // return request(`/logapi/_cat/indices?pretty${stringify(params)}`);
  return request(`/logapi/${index}`, {
    method: 'DELETE',
  });
}

// 获取日志
export async function getLogs(url, params) {
  return request(`${baseUrl}/${url}`, {
    method: 'POST',
    body: params,
  });
}

// 删除日志
export async function deleteLog(url) {
  return request(`${baseUrl}/${url}`, {
    method: 'DELETE',
  });
}
