import api from './api';
import cookieService from './cookieService';
import { store } from '../store';
import { setUser, setToken, logout, setGuestMode } from '../store/slices/authSlice';

export interface LoginData {
  username: string; // Peut être email ou nom d'utilisateur
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  full_name: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: any;
}

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      // Utiliser URLSearchParams pour le format application/x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append('username', data.username);
      formData.append('password', data.password);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if (response.data.access_token) {
        // Stocker dans les cookies
        cookieService.setToken(response.data.access_token);
        
        if (response.data.user) {
          // Initialize completedProjects if not present
          const userData = {
            ...response.data.user,
            completedProjects: response.data.user.completedProjects || []
          };
          cookieService.setUser(userData);
          
          // Mettre à jour le store Redux
          store.dispatch(setToken(response.data.access_token));
          store.dispatch(setUser(userData));
        }
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Identifiants invalides');
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  }

  async register(data: RegisterData): Promise<any> {
    try {
      const response = await api.post('/auth/register', {
        username: data.username,
        email: data.email,
        full_name: data.full_name,
        password: data.password,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.response?.status === 422) {
        const details = error.response.data.detail;
        if (Array.isArray(details)) {
          throw new Error(details.map((err: any) => err.msg).join(', '));
        }
        throw new Error(details);
      }
      throw error;
    }
  }

  async guestLogin(): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/guest');
      if (response.data.access_token) {
        // Stocker dans les cookies
        cookieService.setToken(response.data.access_token);
        
        // Mettre à jour le store Redux
        store.dispatch(setToken(response.data.access_token));
        store.dispatch(setGuestMode(true));
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Erreur lors de l\'accès en mode invité');
    }
  }

  logout(): void {
    try {
      // Supprimer des cookies
      cookieService.clearAll();
      
      // Mettre à jour le store Redux
      store.dispatch(logout());
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  getToken(): string | null {
    try {
      // Priorité au store Redux, puis aux cookies
      const storeState = store.getState();
      return storeState.auth.token || cookieService.getToken();
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  getUser(): any {
    try {
      const storeState = store.getState();
      if (storeState.auth.user) {
        return {
          ...storeState.auth.user,
          completedProjects: storeState.auth.user.completedProjects || []
        };
      }
      
      const userData = cookieService.getUser();
      return userData ? {
        ...userData,
        completedProjects: userData.completedProjects || []
      } : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  isGuest(): boolean {
    try {
      const storeState = store.getState();
      return storeState.auth.isGuest;
    } catch (error) {
      console.error('Erreur lors de la vérification du mode invité:', error);
      return false;
    }
  }

  isLoggedIn(): boolean {
    try {
      return !!this.getToken();
    } catch (error) {
      console.error('Erreur lors de la vérification de la connexion:', error);
      return false;
    }
  }
  
  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
  
  getCurrentUser(): any {
    return this.getUser();
  }
}

export default new AuthService();