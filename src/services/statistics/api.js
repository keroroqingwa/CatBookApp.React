import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * book用户增长统计 api
 */
export async function bookUserRiseStatistic(params) {
  return request(`/Api/BookStatistic/GetBookUserRiseStatistic?${stringify(params)}`);
}
/**
 * 时间段（每小时）新增用户统计 api
 */
export async function bookUserTimeSlotStatistic(params) {
  return request(`/Api/BookStatistic/GetBookUserTimeSlotStatistic?${stringify(params)}`);
}
/**
 * 阅读了指定章节数的用户数量统计 api
 */
export async function readChaptersStatistic(params) {
  return request(`/Api/BookStatistic/GetBookUserReadChaptersStatistic?${stringify(params)}`);
}
/**
 * 时间段（每小时）阅读小说数、时间段（每小时）阅读小说章节数 统计
 */
export async function bookReadTimeSlotStatistics(params) {
  return request(`/Api/BookStatistic/GetBookReadTimeSlotStatistics?${stringify(params)}`);
}
/**
 * 最受欢迎小说排行
 */
export async function getMostPopularBook(params) {
  return request(`/Api/BookStatistic/GetMostPopularBook?${stringify(params)}`);
}
/**
 * 阅读排行榜
 */
export async function getReadRanking(params) {
  return request(`/Api/BookStatistic/GetReadRanking?${stringify(params)}`);
}