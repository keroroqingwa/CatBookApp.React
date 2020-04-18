import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 用户偏好分页数据 api
 */
export async function getPaged(params) {
  return request(`/Api/BookUserPreference/GetPaged?${stringify(params)}`);
}