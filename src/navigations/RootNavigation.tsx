import React from 'react';
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

const RootStack = createStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
  const styles = useStyles();
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
