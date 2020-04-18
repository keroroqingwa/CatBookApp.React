import {
  bookUserRiseStatistic, bookUserTimeSlotStatistic, readChaptersStatistic,
  bookUserReadStatistics, bookReadTimeSlotStatistics, getMostPopularBook, getReadRanking,
} from '@/services/statistics/api';

export default {
  namespace: 'statistics',

  state: {
  },

  effects: {
    // book用户增长统计
    *getBookUserRiseStatistic({ payload }, { call, put }) {
      const response = yield call(bookUserRiseStatistic, payload);
      if (response.code >= 0) {
        const { data } = response
        // console.info('响应', response, data);
        yield put({
          type: 'getBookUserRiseStatisticReducer',
          payload: data,
        });
      }
    },
    // 时间段（每小时）新增用户统计
    *getBookUserTimeSlotStatistic({ payload }, { call, put }) {
      const response = yield call(bookUserTimeSlotStatistic, payload);
      if (response.code >= 0) {
        const { data } = response
        // console.info('响应', response, data);
        yield put({
          type: 'getBookUserTimeSlotStatisticReducer',
          payload: data,
        });
      }
    },
    // 阅读了指定章节数的用户数量统计
    *getByReadChaptersStatistic({ payload }, { call, put }) {
      const response = yield call(readChaptersStatistic, payload);
      if (response.code >= 0) {
        const { data } = response
        // console.info('响应', response, data);
        yield put({
          type: 'getByReadChaptersStatisticReducer',
          payload: data,
        });
      }
    },
    // 用户阅读统计（参与阅读用户数、阅读章节数）
    *getByBookUserReadStatistics({ payload }, { call, put }) {
      const response = yield call(bookUserReadStatistics, payload);
      if (response.code >= 0) {
        const { data } = response
        // console.info('响应', response, data);
        yield put({
          type: 'getByBookUserReadStatisticsReducer',
          payload: data,
        });
      }
    },
    // 时间段（每小时）阅读小说数、时间段（每小时）阅读小说章节数 统计
    *getByBookReadTimeSlotStatistics({ payload }, { call, put }) {
      const response = yield call(bookReadTimeSlotStatistics, payload);
      if (response.code >= 0) {
        const { data } = response
        // console.info('响应', response, data);
        yield put({
          type: 'getByBookReadTimeSlotStatisticsReducer',
          payload: data,
        });
      }
    },
    // 最受欢迎小说排行
    *getByMostPopularBook({ payload }, { call, put }) {
      const response = yield call(getMostPopularBook, payload);
      if (response.code >= 0) {
        const { data } = response
        // console.info('响应', response, data);
        yield put({
          type: 'getByMostPopularBookReducer',
          payload: data,
        });
      }
    },
    // 阅读排行榜
    *getByReadRanking({ payload }, { call, put }) {
      const response = yield call(getReadRanking, payload);
      if (response.code >= 0) {
        const { data } = response
        // console.info('响应', response, data);
        yield put({
          type: 'getByReadRankingReducer',
          payload: data,
        });
      }
    },
  },

  reducers: {
    getBookUserRiseStatisticReducer(state, action) {
      return {
        ...state,
        resByBookUserRiseStatistic: action.payload || null,
      };
    },
    getBookUserTimeSlotStatisticReducer(state, action) {
      return {
        ...state,
        resByBookUserTimeSlotStatistic: action.payload || null,
      };
    },
    getByReadChaptersStatisticReducer(state, action) {
      return {
        ...state,
        resByReadChaptersStatistic: action.payload || null,
      };
    },
    getByBookReadTimeSlotStatisticsReducer(state, action) {
      return {
        ...state,
        resByBookReadTimeSlotStatistics: action.payload || null,
      };
    },
    getByMostPopularBookReducer(state, action) {
      return {
        ...state,
        resByMostPopularBook: action.payload || null,
      };
    },
    getByReadRankingReducer(state, action) {
      return {
        ...state,
        resByReadRanking: action.payload || null,
      };
    },
  },
};
