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

export const userAdapter = createEntityAdapter<IUser>({
  selectId: user => user.id,
});
export const {selectIds, selectById, selectEntities, selectTotal, selectAll} =
  userAdapter.getSelectors();

const usersSlice = createSlice({
  name: 'users',
  // The type of the state is inferred here
  initialState: userAdapter.getInitialState(),
  reducers: {
    userAdded: userAdapter.addOne,
    userAddedMany: userAdapter.addMany,
    // setOneUser: (state, action) => {
    //   userAdapter.setOne(state, action.payload.user);
    // },
    userSetMany: userAdapter.setMany,
    userRemoveOne: userAdapter.removeOne,
    setOneUser: userAdapter.setOne,
    setAll: userAdapter.setAll,
    updateUser: userAdapter.updateOne,
    updateManyUser: userAdapter.updateMany,
  },
});

export default usersSlice.reducer;
export const {
  setOneUser,
  userSetMany,
  userAddedMany,
  userAdded,
  setAll,
  updateUser,
  updateManyUser,
  userRemoveOne,
} = usersSlice.actions;

export const userSelectors = userAdapter.getSelectors<RootState>(
  state => state.users,
);
