import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 获取最近的阅读 api
 */
export async function getPagedByLastReading(params) {
  return request(`/Api/BookReadRecord/GetPagedByLastReading?${stringify(params)}`);
}
/**
 * 获取分页数据 api
 */
export async function getPaged(params) {
  return request(`/Api/BookReadRecord/GetPaged?${stringify(params)}`);
}