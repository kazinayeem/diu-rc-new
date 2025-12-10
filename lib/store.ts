import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import api from "./api/api";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      
      [api.reducerPath]: api.reducer,
    },
    
    middleware: (gDM) => gDM().concat(api.middleware),
  });

  
  setupListeners(store.dispatch);

  return store;
};


export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
