import instance, { baseUrl } from './api';

export const login = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  try {
    // Make the POST request to login, but the session ID will be automatically handled by the browser
    const response = await instance.post(`${baseUrl}/users/signin`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      withCredentials: true, // Make sure cookies are sent with the request
    });

    // The backend should send a session cookie (connect.sid), which will be handled by the browser
    // The response does not need to send the session id explicitly, it is managed via the cookie

    return response.data; // You can choose to return user data here if needed
  } catch (error: any) {
    throw new Error(error.response.data.message || 'La autenticación ha fallado.');
  }
};
