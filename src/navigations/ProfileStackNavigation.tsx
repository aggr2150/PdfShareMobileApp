import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Profile from '@screens/Profile';

const ProfileStack = createStackNavigator<RootStackParamList>();

const ProfileStackNavigation = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{cardStyle: {backgroundColor: '#000'}}}>
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        // options={{headerShown: false}}
      />
    </ProfileStack.Navigator>
  );
};
export default ProfileStackNavigation;