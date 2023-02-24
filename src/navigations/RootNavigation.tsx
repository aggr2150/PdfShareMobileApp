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
      <RootStack.Screen
        name="Viewer"
        component={PdfViewer}
        options={{
          headerShown: false,
          // header: ViewerHeader,
        }}
      />
      <RootStack.Group>
        <RootStack.Screen
          name="Comments"
          component={Comments}
          options={{
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            presentation: 'modal',
            // headerShown: false,
            // header: ViewerHeader,
            // header: ViewerHeader,
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
            // headerShown: false,
            // header: ViewerHeader,
            // header: ViewerHeader,
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
      <RootStack.Screen
        name="Upload"
        component={Upload}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="Settings"
        component={Settings}
        options={{
          title: '설정',
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
          // headerShown: false,
        }}
      />
      <RootStack.Group
        screenOptions={{headerShown: false, cardStyle: styles.primaryCard}}>
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
}));
export default RootStackNavigator;
