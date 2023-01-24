import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PdfViewer from '../screens/PdfViewer';
import BottomTabNavigation from '@navigations/BottomTabNavigation';
import SignIn from '@screens/SignIn';
import ViewerHeader from '@components/ViewerHeader';
import {Provider} from 'react-redux';
import {ViewerStore} from '@redux/store/ViewerStore';
import Comments from '@screens/Comments';
import EditProfile from '@screens/Profile/EditProfile';
import {View} from 'react-native';
import {Button, Text} from '@rneui/themed';
import {SheetManager} from 'react-native-actions-sheet';
import SearchIcon from '@assets/icon/search.svg';
import Upload from '@screens/Upload';
const RootStack = createStackNavigator<RootStackParamList>();

function SettingsScreen({navigation}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
      <Button
        color={'primary'}
        title={'navigate'}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const RootStackNavigator = () => {
  return (
    <Provider store={ViewerStore}>
      <RootStack.Navigator
        screenOptions={{cardStyle: {backgroundColor: '#000'}}}>
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
            header: ViewerHeader,
          }}
        />
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
            // headerShown: false,
            // header: ViewerHeader,
            // header: ViewerHeader,
          }}
        />
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
          component={SettingsScreen}
          options={{
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            // headerShown: false,
          }}
        />
      </RootStack.Navigator>
    </Provider>
  );
};
export default RootStackNavigator;
