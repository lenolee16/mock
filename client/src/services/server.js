import request from '@/utils/request';

export async function Register(params) {
  return request('/api2/register', {
    method: 'POST',
    body: params,
  });
}

export async function Login(params) {
  return request('/api2/login', {
    method: 'POST',
    body: params,
  });
}
