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

export const likeAdapter = createEntityAdapter<ILike>({
  selectId: like => like._id,
  sortComparer: (a, b) => b.likeAt.localeCompare(a.likeAt),
});
export const {selectIds, selectById, selectEntities, selectTotal, selectAll} =
  likeAdapter.getSelectors();

const likesSlice = createSlice({
  name: 'likes',
  // The type of the state is inferred here
  initialState: likeAdapter.getInitialState(),
  reducers: {
    likeAdded: likeAdapter.addOne,
    likeAddedMany: likeAdapter.addMany,
    setOneLike: (state, action) => {
      likeAdapter.setOne(state, action.payload.likes);
    },
    setAllLike: likeAdapter.setAll,
    likeSetMany: likeAdapter.setMany,
    updateLike: likeAdapter.updateOne,
    likeRemoved: likeAdapter.removeOne,
  },
});

export default likesSlice.reducer;
export const {
  likeAddedMany,
  updateLike,
  setOneLike,
  likeSetMany,
  setAllLike,
  likeAdded,
  likeRemoved,
} = likesSlice.actions;

export const likeSelectors = likeAdapter.getSelectors<RootState>(
  state => state.likes,
);
