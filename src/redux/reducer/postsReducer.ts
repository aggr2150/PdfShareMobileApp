// 재사용 가능한 유틸리티 함수

import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store/RootStore';

// 여러 reducer를 사용하는 경우 reducer를 하나로 묶어주는 메소드입니다.
// store에 저장되는 리듀서는 오직 1개입니다.
// export default function homeReducer(state = 0, action) {
//   switch (action.type) {
//     // omit other cases
//     case 'home/onPageSelected': {
//       return state;
//     }
//     default:
//       return state;
//   }
// }

export const postAdapter = createEntityAdapter<IPost>({
  selectId: post => post._id,
});
export const {selectIds, selectById, selectEntities, selectTotal, selectAll} =
  postAdapter.getSelectors();

const postsSlice = createSlice({
  name: 'posts',
  // The type of the state is inferred here
  initialState: postAdapter.getInitialState(),
  reducers: {
    postAdded: postAdapter.addOne,
    postAddedMany: postAdapter.addMany,
    // postSetOne: (state, action) => {
    //   postAdapter.setOne(state, action.payload.posts);
    // },
    postSetOne: postAdapter.setOne,
    setAll: postAdapter.setAll,
    postSetMany: postAdapter.setMany,
    updatePost: postAdapter.updateOne,
    postRemoveOne: postAdapter.removeOne,
  },
});

export default postsSlice.reducer;
export const {
  postSetOne,
  postAddedMany,
  postAdded,
  setAll,
  updatePost,
  postSetMany,
  postRemoveOne,
} = postsSlice.actions;

export const postSelectors = postAdapter.getSelectors<RootState>(
  state => state.posts,
);
