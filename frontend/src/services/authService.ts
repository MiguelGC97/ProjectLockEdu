﻿import instance, { baseUrl } from './api';

export const login = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  try {
    const response = await instance.post(`${baseUrl}/users/signin`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // ensuring the request is encoded
      },
    });
    return response.data; // it returns the user and access_token
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
