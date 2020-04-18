import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 获取所有权限分组 api
 */
export async function getAllAuthority(params) {
  return request(`/Api/Auth/GetAllAuthority?${stringify(params)}`);
}
/**
 * 检查当前登录用户对于指定的控制器和方法有无访问权限 api
 */
export async function checkAuthority(params) {
  return request('/Api/Auth/CheckAuthority', {
    method: 'POST',
    body: { ...params },
  });
}