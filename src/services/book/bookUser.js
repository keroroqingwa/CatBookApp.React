import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询book用户列表 api
 */
export async function getPaged(params) {
  return request(`/Api/BookUser/GetPaged?${stringify(params)}`);
}
/**
 * 查询book用户详情 api
 */
export async function getByOpenid(params) {
  return request(`/Api/BookUser/GetByOpenid?${stringify(params)}`);
}
/**
 * 书本阅读记录汇总信息
 */
export async function getBookReadRecordSummary(params) {
  return request(`/Api/BookReadRecord/GetBookReadRecordSummary?${stringify(params)}`);
}