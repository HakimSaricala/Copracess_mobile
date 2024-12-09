/* eslint-disable prettier/prettier */
import axios from 'axios';
import ExpoJWT from 'expo-jwt';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';

interface UserData {
  id: string | null;
  email: string | null;
  name: string | null;
  image: string | null;
  role: string | null;
  organizationId: string | null;
  isActive: boolean;
  emailVerified: Date | null;
  position: string | null;
  isTwoFactorEnabled: boolean;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  authenticated: boolean | null;
  data: UserData;
}

interface AuthProps {
  authState?: AuthState;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

interface ApiError extends Error {
  response?: {
    status: number;
    data: any;
  };
}
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
const ACCESS_TOKEN_KEY = process.env.EXPO_PUBLIC_ACCESS_TOKEN_KEY || 'accessToken';
const REFRESH_TOKEN_KEY = process.env.EXPO_PUBLIC_REFRESH_TOKEN_KEY || 'refreshToken';
const USER_DATA_KEY = 'userData';
const JWT_SECRET =
  process.env.EXPO_PUBLIC_ENCRYPTION_KEY ||
  '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b';

const initialUserData: UserData = {
  id: null,
  email: null,
  name: null,
  image: null,
  role: null,
  organizationId: null,
  isActive: false,
  emailVerified: null,
  position: null,
  isTwoFactorEnabled: false,
};

const initialAuthState: AuthState = {
  accessToken: null,
  refreshToken: null,
  authenticated: null,
  data: initialUserData,
};

const AuthContext = createContext<AuthProps>({});

// Custom hook for using auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  axios.defaults.baseURL = 'https://www.copracess.live/api/mobile';
  // axios.defaults.baseURL = "http://192.168.55.101:3000/api/mobile";

  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const tokenExpiryBuffer = 60 * 1000; // 1 minute buffer

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = ExpoJWT.decode(token, JWT_SECRET);
      if (!decoded || typeof decoded !== 'object' || !('exp' in decoded)) {
        return true;
      }
      return (decoded.exp as number) * 1000 <= Date.now() + tokenExpiryBuffer;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        const storedUserData = await SecureStore.getItemAsync(USER_DATA_KEY);
        const userData = storedUserData ? JSON.parse(storedUserData) : initialUserData;

        console.log('Loading stored auth data:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          userData,
        });

        if (accessToken && refreshToken) {
          if (isTokenExpired(accessToken)) {
            console.log('Stored access token is expired, attempting refresh');
            await refreshAccessToken();
          } else {
            console.log('Setting stored access token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            setAuthState({
              accessToken,
              refreshToken,
              authenticated: true,
              data: userData,
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    initializeAuth();
  }, []);

  // Update login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`/auth`, { email, password });
      const { accessToken, refreshToken, user } = response.data;

      // Decode token to get user data as fallback
      const decodedToken = decodeToken(accessToken);

      const userData = {
        id: user?.id || decodedToken?.id,
        email: user?.email || decodedToken?.email,
        name: user?.name || decodedToken?.name,
        image: user?.image,
        role: user?.role || decodedToken?.role,
        organizationId: user?.organizationId || decodedToken?.organizationId,
        isActive: user?.isActive ?? true,
        emailVerified: user?.emailVerified,
        position: user?.position,
        isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
      };

      // Set auth state with complete user data
      setAuthState({
        accessToken,
        refreshToken,
        authenticated: true,
        data: userData,
      });

      // Store user data
      await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
        SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData)),
      ]);

      return { error: false, data: response.data };
    } catch (error) {
      console.error('Login error:', error);
      return { error: true, msg: (error as ApiError).response?.data?.message };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');

      await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_DATA_KEY),
      ]);

      delete axios.defaults.headers.common['Authorization'];
      setAuthState(initialAuthState);
      router.replace('/Siginin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const oldRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (!oldRefreshToken) throw new Error('No refresh token found');

      const response = await axios.post(
        `/auth/refresh`,
        { token: oldRefreshToken },
        { headers: { Authorization: undefined } }
      );

      const { accessToken, refreshToken } = response.data;
      const decodedToken = decodeToken(accessToken);

      // Update auth state with decoded token data
      setAuthState((prev) => ({
        ...prev,
        accessToken,
        refreshToken,
        authenticated: true,
        data: {
          ...prev.data,
          id: decodedToken?.id || prev.data?.id,
          email: decodedToken?.email || prev.data?.email,
          name: decodedToken?.name || prev.data?.name,
          role: decodedToken?.role || prev.data?.role,
          organizationId: decodedToken?.organizationId || prev.data?.organizationId,
        },
      }));

      await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
      ]);

      return accessToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      await logout();
      return null;
    }
  };
  useEffect(() => {
    let isRefreshing = false;
    let failedQueue: {
      resolve: (value?: unknown) => void;
      reject: (reason?: any) => void;
    }[] = [];

    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        if (config.url?.includes('/auth/refresh')) {
          return config;
        }

        config.headers = config.headers || {};

        const token = authState?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log('Request config:', {
          url: config.url,
          method: config.method,
          headers: {
            Authorization:
              typeof config.headers.Authorization === 'string'
                ? config.headers.Authorization.substring(0, 20) + '...'
                : config.headers.Authorization,
          },
        });

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        console.log('Response error:', {
          status: error.response?.status,
          url: originalRequest?.url,
          retry: originalRequest?._retry,
          headers: originalRequest?.headers,
        });

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newToken = await refreshAccessToken();
            if (!newToken) {
              throw new Error('Token refresh failed');
            }

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            failedQueue.forEach(({ resolve }) => resolve());

            return await axios(originalRequest);
          } catch (error) {
            failedQueue.forEach(({ reject }) => reject(error));
            throw error;
          } finally {
            isRefreshing = false;
            failedQueue = [];
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [authState?.accessToken]);

  const value = {
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
