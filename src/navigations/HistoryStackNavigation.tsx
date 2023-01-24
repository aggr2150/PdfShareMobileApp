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
import History from '@screens/History';
import CollectionList from '@screens/History/CollectionList';
const HistoryStack = createStackNavigator<RootStackParamList>();

const HistoryStackNavigator = () => {
  return (
    <HistoryStack.Navigator
      screenOptions={{cardStyle: {backgroundColor: '#000'}}}>
      <HistoryStack.Screen
        name="History"
        component={History}
        options={{headerShown: false}}
      />
      <HistoryStack.Screen
        name="CollectionList"
        component={CollectionList}
        options={{
          headerShown: false,
          // header: ViewerHeader,
          header: ViewerHeader,
        }}
      />
    </HistoryStack.Navigator>
  );
};
export default HistoryStackNavigator;
