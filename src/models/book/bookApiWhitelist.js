import { getPaged, add, update, del } from '@/services/book/bookApiWhitelist';

export default {
  namespace: 'bookApiWhitelist',

  state: {
  },

  effects: {
    // 分页查询数据
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
    // 新增
    *add({ payload }, { call, put }) {
      const response = yield call(add, payload);
      if (response.code >= 0) {
        const { data } = response
        yield put({
          type: 'addReducer',
          payload: data,
        });
      }
    },
    // 编辑
    *update({ payload }, { call, put }) {
      const response = yield call(update, payload);
      if (response.code >= 0) {
        const { data } = response
        yield put({
          type: 'updateReducer',
          payload: data,
        });
      }
    },
    // 删除
    *del({ payload }, { call, put }) {
      const response = yield call(del, payload);
      if (response.code >= 0) {
        const { data } = response
        yield put({
          type: 'delReducer',
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
    addReducer(state, action) {
      return {
        ...state,
        resByAdd: action.payload || null,
      };
    },
    updateReducer(state, action) {
      return {
        ...state,
        resByUpdate: action.payload || null,
      };
    },
    delReducer(state, action) {
      return {
        ...state,
        resByDel: action.payload || 'is ok',
      };
    },
  },
};
