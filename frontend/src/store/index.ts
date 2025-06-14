import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session'; // Utilise sessionStorage
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  // Ajoutez d'autres reducers ici au besoin
});

// Configuration de redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Seuls les reducers listés ici seront persistés
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure le store avec le reducer persisté
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Types pour TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
