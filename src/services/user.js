import request from '@/utils/request';
// import { Promise } from 'rsvp';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/Api/Account/GetCurrentUser');

  // const p = new Promise((resolve, reject) => {
  //   const user = {
  //     "name": "Serati Ma..",
  //     "avatar": "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
  //     "userid": "00000001",
  //     "email": "antdesign@alipay.com",
  //     "signature": "海纳百川，有容乃大",
  //   };
  //   if (user) {
  //     resolve(user)
  //   } else {
  //     reject(user)
  //   }
  // })
  // return p;
}
