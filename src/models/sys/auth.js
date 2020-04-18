import { getAllAuthority, checkAuthority } from '@/services/sys/auth';

export default {
  namespace: 'auth',

  state: {
  },

  effects: {
    // 获取所有权限分组
    *getAllAuthority({ payload }, { call, put }) {
      const response = yield call(getAllAuthority, payload);
      if (response.code >= 0) {
        const { Data } = response
        yield put({
          type: 'getAllAuthorityReducer',
          payload: Data,
        });
      }
    },
    // 检查当前登录用户对于指定的控制器和方法有无访问权限
    *checkAuthority({ payload }, { call, put }) {
      const response = yield call(checkAuthority, payload);
      if (response.code >= 0) {
        const { Data } = response
        yield put({
          type: 'checkAuthorityReducer',
          payload: Data,
        });
      }
    },
  },

  reducers: {
    getAllAuthorityReducer(state, action) {
      return {
        ...state,
        resByAllAuthority: action.payload || null,
      };
    },
    checkAuthorityReducer(state, action) {
      return {
        ...state,
        resByCheckAuthority: action.payload || null,
      };
    },
  },
};
