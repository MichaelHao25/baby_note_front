import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./counterSlice";
import { apiSlice } from "./apiSlice";
import userSlice from "./userSlice";
import scaleCreateSlice from "./scaleCreateSlice";
import { eexcelApiSlice } from "./eexcelApiSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    user: userSlice,
    scaleCreate: scaleCreateSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [eexcelApiSlice.reducerPath]: eexcelApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      apiSlice.middleware,
      eexcelApiSlice.middleware,
    ]),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
