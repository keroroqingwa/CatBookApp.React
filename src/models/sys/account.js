import { getListByPage, checkUserIdRepeat, add, update, del, resetPwd } from '@/services/sys/account';

export default {
  namespace: 'sys',

  state: {
  },

  effects: {
    // 分页查询用户数据
    *getListByPage({ payload }, { call, put }) {
      const response = yield call(getListByPage, payload);
      if (response.code >= 0) {
        const { Data } = response
        // console.info('响应', response, Data);
        yield put({
          type: 'getListByPageReducer',
          payload: Data,
        });
      }
    },
    // 检查新增账户时的用户id是否已存在
    *checkUserIdRepeat({ payload }, { call, put }) {
      const response = yield call(checkUserIdRepeat, payload);
      if (response.code >= 0) {
        const { Data } = response
        yield put({
          type: 'checkUserIdRepeatReducer',
          payload: Data,
        });
      }
    },
    // 新增
    *add({ payload }, { call, put }) {
      const response = yield call(add, payload);
      if (response.code >= 0) {
        const { Data } = response
        yield put({
          type: 'addReducer',
          payload: Data,
        });
      }
    },
    // 编辑
    *update({ payload }, { call, put }) {
      const response = yield call(update, payload);
      if (response.code >= 0) {
        const { Data } = response
        yield put({
          type: 'updateReducer',
          payload: Data,
        });
      }
    },
    // 删除
    *del({ payload }, { call, put }) {
      const response = yield call(del, payload);
      if (response.code >= 0) {
        const { Data } = response
        yield put({
          type: 'delReducer',
          payload: Data,
        });
      }
    },
    // 重置密码
    *resetPwd({ payload }, { call, put }) {
      const response = yield call(resetPwd, payload);
      if (response.code >= 0) {
        const { Data } = response
        yield put({
          type: 'resetPwdReducer',
          payload: Data,
        });
      }
    },
  },

  reducers: {
    getListByPageReducer(state, action) {
      return {
        ...state,
        resByGetListByPage: action.payload || {},
      };
    },
    checkUserIdRepeatReducer(state, action) {
      return {
        ...state,
        resByCheckUserIdRepeat: action.payload || null,
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
        resByDel: action.payload || null,
      };
    },
    resetPwdReducer(state, action) {
      return {
        ...state,
        resByResetPwd: action.payload || null,
      };
    },
  },
};
