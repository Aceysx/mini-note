import { Effect, Reducer, Subscription } from 'umi';

export interface GlobalModelState {
  name: string;
  menusData: [];
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    queryUserInfo: Effect;
  };
  reducers: {
    save: Reducer<GlobalModelState>;
    // 启用 immer 之后
    // save: ImmerReducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',
  state: {
    name: '',
    menusData: [],
  },
  effects: {
    *queryUserInfo({}, { call, put }) {
      // const userid = localStorage.getItem('userid');
      // queryUserInfo, { ...payload, userid }
      const response = yield call();
      if (response.status === 'ok') {
        yield put({
          type: 'save',
          payload: {
            userInfo: response.data,
          },
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    // 启用 immer 之后
    // save(state, action) {
    //   state.name = action.payload;
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const reg = /^\/login/g;
        if (!reg.test(pathname)) {
          dispatch({
            type: 'queryUserInfo',
            payload: {},
          });
        }
      });
    },
  },
};

export default GlobalModel;
