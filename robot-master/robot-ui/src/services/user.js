import { stringify } from 'qs';
import request from '../utils/request';

export async function queryCurrent(params) {
  return request(`/api/user/getUser?${stringify(params)}`);
}
