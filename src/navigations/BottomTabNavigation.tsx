import React from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Button, makeStyles, Text} from '@rneui/themed';
import Home from '@screens/Home';
import {SheetManager} from 'react-native-actions-sheet';
import Profile from '@screens/Profile';
import History from '@screens/History';
import HomeIcon from '@assets/icon/home.svg';
import SearchIcon from '@assets/icon/search.svg';
import HistoryIcon from '@assets/icon/history.svg';
import ProfileIcon from '@assets/icon/person.svg';
import HistoryStackNavigation from '@navigations/HistoryStackNavigation';
import ProfileStackNavigation from '@navigations/ProfileStackNavigation';
import HomeStackNavigation from '@navigations/tabs/HomeStackNavigation';

function SettingsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
      <Button
        color={'primary'}
        title={'navigate'}
        onPress={() => SheetManager.show('loginSheet')}
      />
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default () => {
  const styles = useStyles();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBarContainer,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: '#99c729',
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigation}
        options={{
          tabBarIcon: ({size, color}) => (
            <HomeIcon
              style={{width: size, height: size}}
              width={size}
              height={size}
              fill={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={HomeStackNavigation}
        options={{
          tabBarIcon: ({size, color}) => (
            <SearchIcon
              style={{width: size, height: size}}
              width={size}
              height={size}
              fill={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryStackNavigation}
        options={{
          tabBarIcon: ({size, color}) => (
            <HistoryIcon
              style={{width: size, height: size}}
              width={size}
              height={size}
              fill={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigation}
        options={{
          tabBarIcon: ({size, color}) => (
            <ProfileIcon
              style={{width: size, height: size}}
              width={size}
              height={size}
              fill={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const useStyles = makeStyles(theme => ({
  tabBarContainer: {
    borderTopWidth: 0,
    backgroundColor: theme.colors.background,
  },
}));
