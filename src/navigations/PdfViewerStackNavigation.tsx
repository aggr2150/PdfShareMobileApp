import React, {useCallback, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PdfViewer from '../screens/PdfViewer';
import BottomTabNavigation from '@navigations/BottomTabNavigation';
import SignIn from '@screens/SignIn';
import Comments from '@screens/Comments';
import EditProfile from '@screens/Profile/EditProfile';
import {Platform, View} from 'react-native';
import {Button, makeStyles, Text} from '@rneui/themed';
import Upload from '@screens/Upload';
import ResetPassword from '@screens/ResetPassword';
import ResetPasswordConfirm from '@screens/ResetPassword/ResetPasswordConfirm';
import Settings from '@screens/Settings';
import Replies from '../screens/Comments/Replies';
import EditPost from '@screens/Upload/EditPost';
import ChangePassword from '@screens/ChangePassword';
import BlockList from '@screens/BlockList';
import Keychain from 'react-native-keychain';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {PermissionsAndroid} from 'react-native';

import {
  EAuthState,
  getAuthState,
  initialized,
} from '@redux/reducer/authReducer';
import {blockUserSetAll} from '@redux/reducer/blocksReducer';
import {CommonActions} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import SplashScreen from 'react-native-splash-screen';
import Information from '@screens/Settings/Information';
import InterstitialAdsController from '@components/InterstitialAdsController';
import CustomerService from '@screens/Settings/CustomerService';
import messaging from '@react-native-firebase/messaging';

const PdfViewerStack = createStackNavigator<PdfViewerStackParams>();

const PdfViewerStackNavigation = () => {
  const styles = useStyles();
  return (
    <PdfViewerStack.Navigator
      initialRouteName={'Viewer'}
      screenOptions={{
        cardStyle: {backgroundColor: '#000', borderBottomWidth: 0},
      }}>
      <PdfViewerStack.Screen
        name="Viewer"
        component={PdfViewer}
        options={{
          headerShown: false,
          // header: ViewerHeader,
        }}
      />
      <PdfViewerStack.Screen
        name="Comments"
        component={Comments}
        options={{
          title: '댓글',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTitleStyle: {
            color: '#fff',
          },
          headerLeftLabelVisible: false,
          presentation: 'modal',
          headerMode: 'screen',
        }}
      />
      <PdfViewerStack.Screen
        name="Replies"
        component={Replies}
        options={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTitleStyle: {
            color: '#fff',
          },
          presentation: 'modal',
          headerLeftLabelVisible: false,
        }}
      />
    </PdfViewerStack.Navigator>
  );
};

const useStyles = makeStyles(theme => ({
  primaryCard: {
    backgroundColor: theme.colors.primary,
  },
  defaultCard: {
    backgroundColor: theme.colors.background,
  },
}));
export default PdfViewerStackNavigation;
