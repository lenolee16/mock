import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryRule(params) {
  return request(`/api2/project?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api2/project', {
    method: 'DELETE',
    body: {
      ...params
    },
  });
}

export async function addRule(params) {
  return request('/api2/project', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function updateRule(params) {
  return request('/api2/project', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function queryInterface(params) {
  return request(`/api2/interface?${stringify(params)}`);
}

export async function removeInterface(params) {
  return request('/api2/interface', {
    method: 'DELETE',
    body: {
      ...params
    },
  });
}

export async function addInterface(params) {
  return request('/api2/interface', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function updateInterface(params) {
  return request('/api2/interface', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function testing(params) {
  return request(`/api2/api${params.path}`, {
    method: params.method,
  });
}