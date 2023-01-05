import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PdfViewer from '../screens/PdfViewer';
import BottomTabNavigation from '@navigations/BottomTabNavigation';
import SignIn from '@screens/SignIn';
import ViewerHeader from '@components/ViewerHeader';
import {Provider} from 'react-redux';
import {ViewerStore} from '@redux/store/ViewerStore';
const RootStack = createStackNavigator<RootStackParamList>();
const RootStackNavigator = () => {
  return (
    <Provider store={ViewerStore}>
      <RootStack.Navigator screenOptions={{cardStyle: {backgroundColor:'#000'}}}>
        <RootStack.Screen
          name="SignIn"
          component={SignIn}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Viewer"
          component={PdfViewer}
          options={{
            // header: ViewerHeader,
            header: ViewerHeader,
          }}
        />
        <RootStack.Screen
          name={'Home'}
          component={BottomTabNavigation}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </Provider>
  );
};
export default RootStackNavigator;
