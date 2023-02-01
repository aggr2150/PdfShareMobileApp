declare type BottomTabParamList = {
  HomeTab: undefined;
  ProfileTab: import('@react-navigation/native').NavigatorScreenParams<ProfileStackScreenParams>;
};
declare type ProfileStackScreenParams = {
  Profile: IUser | {id: string};
};

declare type RootStackParamList = {
  Tabs: import('@react-navigation/native').NavigatorScreenParams<BottomTabParamList>;
  Viewer: IPost;
  SignIn: undefined;
  Comments: undefined;
  History: undefined;
  EditProfile: {
    id: string;
    nickname: string;
    description?: string;
  };
  My: undefined;
  Profile: IUser | {id: string};
  Settings: undefined;
  CollectionList: undefined;
  Upload: undefined;

  Home: undefined;
};
