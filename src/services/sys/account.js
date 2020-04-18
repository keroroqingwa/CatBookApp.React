import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 分页查询用户数据 api
 */
export async function getListByPage(params) {
  return request(`/Api/Account/GetListByPage?${stringify(params)}`);
}
/**
 * 检查新增账户时的用户id是否已存在 api
 */
export async function checkUserIdRepeat(params) {
  return request(`/Api/Account/CheckUserIdRepeat?${stringify(params)}`);
}
/**
 * 新增 api
 */
export async function add(params) {
  return request('/Api/Account/Add', {
    method: 'POST',
    body: { ...params },
  });
}
/**
 * 编辑 api
 */
export async function update(params) {
  return request('/Api/Account/Update', {
    method: 'POST',
    body: { ...params },
  });
}
/**
 * 删除 api
 */
export async function del(params) {
  return request('/Api/Account/Delete', {
    method: 'POST',
    body: { ...params },
  });
}
/**
 * 重置密码 api
 */
export async function resetPwd(params) {
  return request('/Api/Account/ResetPwd', {
    method: 'POST',
    body: { ...params },
  });
}