import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@src/redux/store/RootStore';

interface authState {
  authState: EAuthState;
  session: ISession;
}
enum EAuthState {
  INIT = 'INIT',
  NONE = 'NONE',
  AUTHORIZED = 'AUTHORIZED',
}

const initialState: authState = {
  authState: EAuthState.INIT,
  session: {},
};

export const authSlice = createSlice({
  name: 'auth',
  // The type of the state is inferred here
  initialState,
  reducers: {
    initialized: (state, action: PayloadAction<Nullable<ISession>>) => {
      if (action.payload) {
        state.authState = EAuthState.AUTHORIZED;
        state.session = action.payload;
      } else {
        state.authState = EAuthState.NONE;
      }
    },
    signOut: state => {
      state.authState = EAuthState.NONE;
      state.session = {};
    },
    signIn: (state, action: PayloadAction<ISession>) => {
      state.authState = EAuthState.AUTHORIZED;
      state.session = action.payload;
    },
  },
});
export const {signOut, signIn, initialized} = authSlice.actions;
export const authState = (state: RootState) => state.auth.authState;
export const session = (state: RootState) => state.auth.session;
export default authSlice.reducer;
