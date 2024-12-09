/* eslint-disable prettier/prettier */
// services/auth/service.ts
import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';

// These are just storage keys, not secrets
const STORAGE_KEYS = {
  ACCESS_TOKEN: process.env.EXPO_PUBLIC_ACCESS_TOKEN_KEY || 'accessToken',
  REFRESH_TOKEN: process.env.EXPO_PUBLIC_REFRESH_TOKEN_KEY || 'refreshToken',
  USER_DATA: 'auth.user_data',
} as const;

class AuthService {
  private api: AxiosInstance;
  private isRefreshing: boolean = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  private initialized: boolean = false;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL_DEV || 'https://www.copracess.live',
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  async init() {
    if (this.initialized) return;

    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
      SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
    ]);

    if (!accessToken || !refreshToken) {
      await this.clearTokens();
      throw new Error('AUTH_EXPIRED');
    }

    this.initialized = true;
  }
  getApi() {
    return this.api;
  }
  private setupInterceptors() {
    this.api.interceptors.request.use(
      async (config) => {
        // We use the storage key to retrieve the token
        const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.refreshSubscribers.push((token: string) => {
                error.config.headers.Authorization = `Bearer ${token}`;
                resolve(this.api(error.config));
              });
            });
          }

          this.isRefreshing = true;
          error.config._retry = true;

          try {
            // Get the stored refresh token
            const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
            if (!refreshToken) throw new Error('No refresh token');

            // Send it to the server
            const response = await this.api.post('/api/mobile/auth/refresh', {
              token: refreshToken, // Send the actual token, not the storage key
            });

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

            // Store the new tokens
            await Promise.all([
              SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken),
              SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken),
            ]);

            // Retry failed requests
            this.refreshSubscribers.forEach((cb) => cb(newAccessToken));
            this.refreshSubscribers = [];

            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.api(error.config);
          } catch (refreshError) {
            // Clear tokens on refresh failure
            await this.clearTokens();
            throw new Error('AUTH_EXPIRED');
          } finally {
            this.isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string) {
    try {
      const response = await this.api.post('/api/mobile/auth', {
        email,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      // Store tokens using the storage keys
      await Promise.all([
        SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
      ]);

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async clearTokens() {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA),
      ]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }
}

export const authService = new AuthService();
