import axios from 'axios';
import { auth } from '../utils/firebase';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000, 
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; 

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

API.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error getting Firebase token:', error);
      }
    }
    
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      for (let i = 0; i < MAX_RETRIES; i++) {
        console.log(`🔄 Retrying request (${i + 1}/${MAX_RETRIES}) after 429 error`);
        await sleep(RETRY_DELAY * (i + 1)); 
        
        try {
          return await API(originalRequest);
        } catch (retryError) {
          if (i === MAX_RETRIES - 1) {
            console.error('❌ All retries failed after 429 error');
            break;
          }
        }
      }
    }
    
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });
    
    return Promise.reject(error);
  }
);

export default API;