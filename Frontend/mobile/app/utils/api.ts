// app/utils/api.ts



// Without the access token:
// The server doesn’t know who you are.
// So, for every API request (e.g., view profile, create post, fetch data),
//  the server would have to ask you to login again. That’s annoying.



// AsyncStorage is a simple, persistent key-value storage system in React Native,
//  like a mini local database on your phone.
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const api = axios.create({
  baseURL: 'http://192.168.1.13:8000/api/',
});





// Every time you call api.get() or api.post(), before the request is sent, this
//  interceptor runs.
// It checks if there’s an access token saved in the app (using AsyncStorage).
// If it exists, it adds a header like this:
// Authorization: Bearer <access_token>
// This tells your backend: ✅ “I’m a logged-in user!”
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});





//REQUESTING NEW TOKEN
// This watches every response.
// If it's successful, it lets it pass (res => res),
// But if there's an error (like token expired 401 Unauthorized), it does something smart.

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;



    //If you haven’t already retried the request (_retry), it tries to use the refresh_token
    //  to get a new access_token.
    //If there's no refresh token, it gives up (you’re basically logged out).
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = await AsyncStorage.getItem('refresh_token');
      if (!refresh) return Promise.reject(err);



      try {
        const response = await axios.post('http://192.168.100.117:8000/api/authenticator/token/refresh/', {
          refresh,
        });



//  If the token refresh worked:
// It saves the new tokens.
// Updates the original request with the new access token.
// Tries the request again automatically — user won’t even notice

        const { access, refresh: newRefresh } = response.data;
        await AsyncStorage.setItem('access_token', access);
        await AsyncStorage.setItem('refresh_token', newRefresh);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest); // retry original request






        //If the refresh also fails (e.g., expired refresh token),
        //  it rejects the request — this means you’ll probably log the user out.
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
