import { getPaged } from '@/services/book/bookUserPreference';

export default {
  namespace: 'bookUserPreference',

  state: {
  },

  effects: {
    // 用户阅读偏好
    *getPaged({ payload }, { call, put }) {
      const response = yield call(getPaged, payload);
      if (response.code >= 0) {
        const { data } = response
        // console.info('响应', response, data);
        yield put({
          type: 'getPagedReducer',
          payload: data,
        });
      }
    },
  },

  reducers: {
    getPagedReducer(state, action) {
      return {
        ...state,
        resByGetPaged: action.payload || {},
      };
    },
  },
};
