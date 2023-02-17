import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Profile from '@screens/Profile';
import Revenue from '@screens/Profile/Revenue';

const ProfileStack = createStackNavigator<ProfileStackScreenParams>();

const ProfileStackNavigation = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{cardStyle: {backgroundColor: '#000'}}}>
      <ProfileStack.Screen
        name="My"
        component={Profile}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="Revenue"
        component={Revenue}
        options={{headerShown: false}}
      />
    </ProfileStack.Navigator>
  );
};
export default ProfileStackNavigation;
