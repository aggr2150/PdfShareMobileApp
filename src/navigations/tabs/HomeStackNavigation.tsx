import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Profile from '@screens/Profile';
import Home from '@screens/Home';

const HomeStack = createStackNavigator<RootStackParamList>();

const HomeStackNavigation = () => {
  return (
    <HomeStack.Navigator screenOptions={{cardStyle: {backgroundColor: '#000'}}}>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      {/*<HomeStack.Screen*/}
      {/*  name="Profile"*/}
      {/*  component={Profile}*/}
      {/*  options={{headerShown: false}}*/}
      {/*/>*/}
    </HomeStack.Navigator>
  );
};
export default HomeStackNavigation;
