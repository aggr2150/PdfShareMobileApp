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

export const collectionAdapter = createEntityAdapter<ICollection>({
  selectId: collection => collection._id,
});
export const {selectIds, selectById, selectEntities, selectTotal, selectAll} =
  collectionAdapter.getSelectors();

const collectionsSlice = createSlice({
  name: 'collections',
  // The type of the state is inferred here
  initialState: collectionAdapter.getInitialState(),
  reducers: {
    collectionAdded: collectionAdapter.addOne,
    collectionAddedMany: collectionAdapter.addMany,
    setOneCollection: (state, action) => {
      collectionAdapter.setOne(state, action.payload.collections);
    },
    setAll: collectionAdapter.setAll,
    updateCollection: collectionAdapter.updateOne,
  },
});

export default collectionsSlice.reducer;
export const {
  setOneCollection,
  collectionAddedMany,
  collectionAdded,
  setAll,
  updateCollection,
} = collectionsSlice.actions;

export const postSelectors = collectionAdapter.getSelectors<RootState>(
  state => state.collections,
);
