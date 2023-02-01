import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ViewerHeader from '@components/ViewerHeader';
import History from '@screens/History';
import Collection from '@screens/History/CollectionList';

const HistoryStack = createStackNavigator<HistoryStackScreenParams>();

const HistoryStackNavigation = () => {
  return (
    <HistoryStack.Navigator
      screenOptions={{cardStyle: {backgroundColor: '#000'}}}>
      <HistoryStack.Screen
        name="History"
        component={History}
        options={{headerShown: false}}
      />
      <HistoryStack.Screen
        name="Collection"
        component={Collection}
        options={{
          headerShown: false,
          // header: ViewerHeader,
          header: ViewerHeader,
        }}
      />
    </HistoryStack.Navigator>
  );
};
export default HistoryStackNavigation;
