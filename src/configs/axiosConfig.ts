import axios from 'axios';

// import { auth } from './firebaseConfig';

// Function to get the Firebase access token
// const getFirebaseAccessToken = async () => {
//   try {
//     // Get the current user
//     const user = auth.currentUser;

//     // If user exists, get the access token
//     if (user) {
//       const accessToken = await user.getIdToken();
//       return accessToken;
//     } else {
//       throw new Error('User not found');
//     }
//   } catch (error) {
//     console.error('Error getting Firebase access token:', error);
//     throw error;
//   }
// };

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT || '',
  timeout: 80000,
});

// // Interceptor to add Authorization header with Firebase access token to all requests
// apiClient.interceptors.request.use(async (config) => {
//   try {
//     const accessToken = await getFirebaseAccessToken();
//     config.headers.Authorization = `Bearer ${accessToken}`;
//     return config;
//   } catch (error) {
//     return Promise.reject(error);
//   }
// });
