import { queryInterface, removeInterface, addInterface, updateInterface, testing } from '@/services/project';

export default {
  namespace: 'interfaces',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryInterface, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addInterface, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call }) {
      yield call(removeInterface, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateInterface, payload);
      if (callback) callback(response);
    },
    *testing({ payload, callback }, { call }) {
      const response = yield call(testing, payload);
      if (callback) callback(response);
    }
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
