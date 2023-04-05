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

export const blockUserAdapter = createEntityAdapter<IBlockUser>({
  selectId: user => user._id,
});
export const {selectIds, selectById, selectEntities, selectTotal, selectAll} =
  blockUserAdapter.getSelectors();

const blocksSlice = createSlice({
  name: 'blocks',
  // The type of the state is inferred here
  initialState: blockUserAdapter.getInitialState(),
  reducers: {
    blockUserAdded: blockUserAdapter.addOne,
    blockUserAddedMany: blockUserAdapter.addMany,
    blockUserSetMany: blockUserAdapter.setMany,
    blockUserSetOne: blockUserAdapter.setOne,
    blockUserSetAll: blockUserAdapter.setAll,
    blockUserUpdate: blockUserAdapter.updateOne,
    blockUserUpdateMany: blockUserAdapter.updateMany,
    blockUserRemoveOne: blockUserAdapter.removeOne,
    blockUserRemoveAll: blockUserAdapter.removeAll,
  },
});

export default blocksSlice.reducer;
export const {
  blockUserSetOne,
  blockUserSetMany,
  blockUserAddedMany,
  blockUserAdded,
  blockUserSetAll,
  blockUserUpdate,
  blockUserUpdateMany,
  blockUserRemoveOne,
  blockUserRemoveAll,
} = blocksSlice.actions;

export const blockUserSelectors = blockUserAdapter.getSelectors<RootState>(
  state => state.blocks,
);
