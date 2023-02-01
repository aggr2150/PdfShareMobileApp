import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import authReducer from '@redux/reducer/authReducer';
import postsReducer from '@redux/reducer/postsReducer';
import UsersReducer from '@redux/reducer/usersReducer';
import likesReducer from '@redux/reducer/likesReducer';
import collectionsReducer from '@redux/reducer/collectionsReducer';

export const RootStore = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    users: UsersReducer,
    likes: likesReducer,
    collections: collectionsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof RootStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof RootStore.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
