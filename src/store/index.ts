import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import counterSlice from "./counterSlice";
import scaleCreateSlice from "./scaleCreateSlice";
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    user: userSlice,
    scaleCreate: scaleCreateSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([apiSlice.middleware]),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
