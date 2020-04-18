import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  // return request('/api/login/account', {
  return request('/api/account/login', {
    method: 'POST',
    body: params,
  });
}