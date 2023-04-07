import React, {useCallback, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PdfViewer from '../screens/PdfViewer';
import BottomTabNavigation from '@navigations/BottomTabNavigation';
import SignIn from '@screens/SignIn';
import Comments from '@screens/Comments';
import EditProfile from '@screens/Profile/EditProfile';
import {View} from 'react-native';
import {Button, makeStyles, Text} from '@rneui/themed';
import Upload from '@screens/Upload';
import ResetPassword from '@screens/ResetPassword';
import ResetPasswordConfirm from '@screens/ResetPassword/ResetPasswordConfirm';
import Settings from '@screens/Settings';
import Replies from '@screens/Replies';
import EditPost from '@screens/Upload/EditPost';
import ChangePassword from '@screens/ChangePassword';
import BlockList from '@screens/BlockList';
import Keychain from 'react-native-keychain';
import {apiInstance, getCsrfToken} from '@utils/Networking';
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
const RootStack = createStackNavigator<RootStackParamList>();

InterstitialAdsController.initialize();
const RootStackNavigator = () => {
  const styles = useStyles();
  const authState = useAppSelector(state => getAuthState(state));
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (authState !== EAuthState.INIT) {
      SplashScreen.hide();
    }
  }, [authState]);
  useEffect(() => {
    Keychain.getGenericPassword()
      .then(credentials => {
        if (credentials) {
          getCsrfToken.then(token => {
            console.log({
              _csrf: token,
              id: credentials.username,
              password: credentials.password,
            });
            apiInstance
              .post<response<ISession>>('/api/auth/signIn', {
                _csrf: token,
                id: credentials.username,
                password: credentials.password,
              })
              .then(response => {
                if (response.data.code !== 200) {
                  dispatch(initialized(null));
                } else {
                  dispatch(initialized(response.data.data));
                  apiInstance.post('/api/account/block/list').then(result => {
                    if (result.data.code === 200) {
                      if (result.data.data) {
                        dispatch(blockUserSetAll(result.data.data));
                      }
                    }
                  });
                }
              })
              .catch(error => console.log(token, error));
          });
        } else {
          dispatch(initialized(null));
        }
      })
      .finally(() => {});
  }, [dispatch]);
  return (
    <RootStack.Navigator
      screenOptions={{
        cardStyle: {backgroundColor: '#000', borderBottomWidth: 0},
      }}>
      <RootStack.Screen
        name="SignIn"
        component={SignIn}
        options={{headerShown: false}}
      />
      <RootStack.Group>
        <RootStack.Screen
          name="Viewer"
          component={PdfViewer}
          options={{
            headerShown: false,
            // header: ViewerHeader,
          }}
        />
        <RootStack.Screen
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
        <RootStack.Screen
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
      </RootStack.Group>
      <RootStack.Screen
        name={'Tabs'}
        component={BottomTabNavigation}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Group>
        <RootStack.Screen
          name="Upload"
          component={Upload}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="EditPost"
          component={EditPost}
          options={{
            headerShown: false,
          }}
        />
      </RootStack.Group>
      <RootStack.Group
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0,
            // borderBottomColor: '#333',
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            color: '#fff',
          },
          headerLeftLabelVisible: false,
        }}>
        <RootStack.Screen
          name="Settings"
          component={Settings}
          options={{
            title: '설정',
          }}
        />
        <RootStack.Screen
          name="CustomerService"
          component={CustomerService}
          options={{
            title: '1:1 문의',
          }}
        />
        <RootStack.Screen
          name="Information"
          component={Information}
          options={{
            title: '정보',
          }}
        />
        <RootStack.Screen
          name="BlockList"
          component={BlockList}
          options={{
            title: '차단관리',
          }}
        />
      </RootStack.Group>

      <RootStack.Group
        screenOptions={{headerShown: false, cardStyle: styles.primaryCard}}>
        <RootStack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{cardStyle: styles.defaultCard}}
        />
        <RootStack.Screen name="ResetPassword" component={ResetPassword} />
        <RootStack.Screen
          name="ResetPasswordConfirm"
          component={ResetPasswordConfirm}
        />
      </RootStack.Group>
    </RootStack.Navigator>
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
export default RootStackNavigator;
