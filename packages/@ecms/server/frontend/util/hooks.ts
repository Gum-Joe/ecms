import { Dispatch } from "react";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { ThunkActionDispatch, ThunkDispatch } from "redux-thunk";
import { SetupActions } from "../actions/setup";
import { AppDispatch, RootState } from "../reducers";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// From https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
export const useAppDispatch = () => useDispatch<ThunkDispatch<RootState, void, SetupActions>>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;