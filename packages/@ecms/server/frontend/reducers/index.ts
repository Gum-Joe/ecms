import { configureStore } from "@reduxjs/toolkit";
import { setupReducer } from "./setup";
import thunkMiddleware from "redux-thunk";

export const store = configureStore({
	reducer: {
		/// @ts-expect-error: Redux stuff
		setup: setupReducer,
	},
	middleware: [thunkMiddleware]
});

// From: https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch