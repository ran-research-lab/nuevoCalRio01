import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE, } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import counterReducer from './slices/counterSlice';

const rootReducer = combineReducers({
   counter: counterReducer,
});

const persistConfig = {
   key: 'root',
   version: 1,
   storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
   reducer: persistedReducer,
   middleware: getDefaultMiddleware({
      serializableCheck: {
         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
   }),
});

export const persistor = persistStore(store);
export default store;