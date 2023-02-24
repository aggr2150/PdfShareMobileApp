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

export const commentAdapter = createEntityAdapter<IComment>({
  selectId: collection => collection._id,
});
export const {selectIds, selectById, selectEntities, selectTotal, selectAll} =
  commentAdapter.getSelectors();

const commentsSlice = createSlice({
  name: 'comments',
  // The type of the state is inferred here
  initialState: commentAdapter.getInitialState(),
  reducers: {
    commentAdded: commentAdapter.addOne,
    commentAddedMany: commentAdapter.addMany,
    setOneComment: (state, action) => {
      commentAdapter.setOne(state, action.payload.collections);
    },
    setAll: commentAdapter.setAll,
    commentSetMany: commentAdapter.setMany,
    updateComment: commentAdapter.updateOne,
    removeComment: commentAdapter.removeOne,
  },
});

export default commentsSlice.reducer;
export const {
  setOneComment,
  commentAddedMany,
  commentAdded,
  commentSetMany,
  setAll,
  updateComment,
  removeComment,
} = commentsSlice.actions;

export const commentsSelectors = commentAdapter.getSelectors<RootState>(
  state => state.comments,
);
