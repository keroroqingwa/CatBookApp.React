import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 分页查询数据 api
 */
export async function getPaged(params) {
  return request(`/Api/BookApiWhitelist/GetPaged?${stringify(params)}`);
}
/**
 * 新增 api
 */
export async function add(params) {
  return request('/Api/BookApiWhitelist/Create', {
    method: 'POST',
    body: { ...params },
  });
}
/**
 * 编辑 api
 */
export async function update(params) {
  return request('/Api/BookApiWhitelist/Update', {
    method: 'POST',
    body: { ...params },
  });
}
/**
 * 删除 api
 */
export async function del(params) {
  return request('/Api/BookApiWhitelist/Delete', {
    method: 'POST',
    body: { ...params },
  });
}