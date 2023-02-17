import React from 'react';
import {View} from 'react-native';
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
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
import Search from '@screens/Search';
import {useAppSelector} from '@redux/store/RootStore';
import {EAuthState, getAuthState, getSession} from '@redux/reducer/authReducer';
import SearchStackNavigation from '@navigations/SearchStackNavigation';
// import {BottomTab} from '@react-navigation/bottom-tabs';
// import BottomTabBarItem from '@react-navigation/bottom-tabs/lib/typescript/src/views/BottomTabItem';
// import {tab} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default ({navigation}) => {
  const styles = useStyles();
  const authState = useAppSelector(state => getAuthState(state));
  return (
    <Tab.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{
        tabBarStyle: styles.tabBarContainer,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: '#99c729',
        // tabBarButton: props => <Tab. {...props} />,
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
        name="SearchTab"
        component={SearchStackNavigation}
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
          // tabBarButton: props =>  <BottomTabBar {props} />,
        }}
        listeners={{
          tabPress: e => {
            if (authState !== EAuthState.AUTHORIZED) {
              SheetManager.show('loginSheet', {
                payload: {closable: true},
              }).then();
              e.preventDefault();
            }
          },
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
