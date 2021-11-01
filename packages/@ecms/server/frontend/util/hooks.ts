import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../reducers";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// From https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;