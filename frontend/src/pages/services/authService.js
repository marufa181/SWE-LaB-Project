import API from './api';

export const loginWithToken = async (token) => {
  const response = await API.post('/auth/login', { token });
  return response;
};

export const registerWithToken = async (token) => {
  const response = await API.post('/auth/register', { token });
  return response;
};

export const verifyToken = async (token) => {
  const response = await API.post('/auth/verify', { token });
  return response;
};