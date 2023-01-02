import {configureStore} from '@reduxjs/toolkit';
import viewerReducer from '@redux/reducer/viewerReducer';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

export const ViewerStore = configureStore({
  reducer: {
    viewer: viewerReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type ViewerState = ReturnType<typeof ViewerStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof ViewerStore.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<ViewerState> = useSelector;
