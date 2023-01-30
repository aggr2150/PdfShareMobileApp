import {NavigatorScreenParams} from '@react-navigation/native';

declare type BottomTabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
};
declare type RootStackParamList = {
  Tabs: NavigatorScreenParams<BottomTabParamList>;
  Viewer: undefined | IPost;
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
