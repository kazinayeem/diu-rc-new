import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import api from "./api/api";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      // RTK Query API reducer
      [api.reducerPath]: api.reducer,
    },
    // add the api middleware so caching, invalidation and polling works
    middleware: (gDM) => gDM().concat(api.middleware),
  });

  // enable optional listeners for refetchOnFocus/refetchOnReconnect behaviors
  setupListeners(store.dispatch);

  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
