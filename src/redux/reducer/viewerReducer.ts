// 재사용 가능한 유틸리티 함수

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ViewerState} from '../store/ViewerStore';

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

interface viewerState {
  UIVisible: boolean;
}

const initialState: viewerState = {
  UIVisible: true,
};

export const viewerSlice = createSlice({
  name: 'viewer',
  // The type of the state is inferred here
  initialState,
  reducers: {
    setUIVisible: state => {
      state.UIVisible = !state.UIVisible;
    },
  },
});
export const {setUIVisible} = viewerSlice.actions;
export const UIVisible = (state: ViewerState) => state.viewer.UIVisible;
export default viewerSlice.reducer;
