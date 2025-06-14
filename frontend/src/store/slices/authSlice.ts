import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

// Interface pour l'état d'authentification
interface AuthState {
  user: User | null;
  token: string | null;
  isGuest: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// État initial
const initialState: AuthState = {
  user: null,
  token: null,
  isGuest: false,
  isLoading: true,
  isAuthenticated: false,
};

// Création du slice Redux pour l'authentification
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action pour définir l'utilisateur connecté
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isGuest = false;
      state.isLoading = false;
    },
    // Action pour définir le token
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    // Action pour définir le mode invité
    setGuestMode: (state, action: PayloadAction<boolean>) => {
      state.isGuest = action.payload;
      state.isAuthenticated = action.payload; // Un invité est aussi considéré comme authentifié
      state.isLoading = false;
    },
    // Action pour la déconnexion
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isGuest = false;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    // Action pour définir l'état de chargement
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

// Export des actions
export const { setUser, setToken, setGuestMode, logout, setLoading } = authSlice.actions;

// Export du reducer
export default authSlice.reducer;
