// Redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import storage from "redux-persist/lib/storage";
import authReducer from "./Reducer/authReducer";


const persistConfig = {
  key: "root",
  storage,
  transforms: [
    encryptTransform({
      secretKey: "hidezign-secret-key-anubhav-kashyap",
      onError: function (error: Error) {
        // handle the error more gracefully in production
        // eslint-disable-next-line no-console
        console.error("Encryption error", error);
      },
    }),
  ],
};

// create a persisted reducer for the auth slice
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // recommended to ignore these redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// persistor for redux-persist
export const persistor = persistStore(store);

/**
 * Type helpers for using throughout your app
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
