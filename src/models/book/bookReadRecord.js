import { getPagedByLastReading, getPaged } from '@/services/book/bookReadRecord';

export default {
  namespace: 'bookReadRecord',

  state: {
  },

  effects: {
    // 获取最近的阅读
    *getPagedByLastReading({ payload }, { call, put }) {
      const response = yield call(getPagedByLastReading, payload);
      if (response.code >= 0) {
        const { data } = response
        // console.info('响应', response, data);
        yield put({
          type: 'getPagedByLastReadingReducer',
          payload: data,
        });
      }
    },
    // 获取分页数据
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
    getPagedByLastReadingReducer(state, action) {
      return {
        ...state,
        resByGetPagedByLastReading: action.payload || {},
      };
    },
    getPagedReducer(state, action) {
      return {
        ...state,
        resByGetPaged: action.payload || {},
      };
    },
  },
};
