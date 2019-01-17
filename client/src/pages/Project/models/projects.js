import { queryRule, removeRule, addRule, updateRule } from '@/services/project';

export default {
  namespace: 'projects',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call }) {
      yield call(addRule, payload);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      yield call(removeRule, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call }) {
      yield call(updateRule, payload);
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
