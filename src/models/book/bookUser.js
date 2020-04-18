import { getPaged, getByOpenid, getBookReadRecordSummary } from '@/services/book/bookUser';

export default {
  namespace: 'bookUser',

  state: {
  },

  effects: {
    // book用户列表数据
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
    // 指定openid的book用户数据
    *getByOpenid({ payload }, { call, put }) {
      const response = yield call(getByOpenid, payload);
      if (response.code >= 0) {
        const { data } = response
        yield put({
          type: 'getByOpenidReducer',
          payload: data,
        });
      }
    },
    // 书本阅读记录汇总信息
    *getBookReadRecordSummary({ payload }, { call, put }) {
      const response = yield call(getBookReadRecordSummary, payload);
      if (response.code >= 0) {
        const { data } = response
        yield put({
          type: 'getBookReadRecordSummaryReducer',
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
    getByOpenidReducer(state, action) {
      return {
        ...state,
        resByGetByOpenid: action.payload || {},
      };
    },
    getBookReadRecordSummaryReducer(state, action) {
      return {
        ...state,
        resByGetBookReadRecordSummary: action.payload || {},
      };
    },
  },
};
