import React from 'react';
import {Platform, View} from 'react-native';
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
import Upload from '@screens/Upload';
import PlusIcon from '@assets/icon/plus1.svg';
import {StackScreenProps} from '@react-navigation/stack';
import Spinner from '@components/Spinner';
// import {BottomTab} from '@react-navigation/bottom-tabs';
// import BottomTabBarItem from '@react-navigation/bottom-tabs/lib/typescript/src/views/BottomTabItem';
// import {tab} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator<BottomTabParamList>();

type TabsProps = StackScreenProps<RootStackParamList, 'Tabs'>;
const Tabs: React.FC<TabsProps> = ({navigation}) => {
  const styles = useStyles();
  const authState = useAppSelector(state => getAuthState(state));
  return (
    <Tab.Navigator
      tabBar={props => (
        <View
          style={{
            // backgroundColor: 'red',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View style={{maxWidth: 600, flex: 1}}>
            <BottomTabBar {...props} />
          </View>
        </View>
      )}
      screenOptions={{
        tabBarStyle: styles.tabBarContainer,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: '#fff',
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
        name="Search"
        component={Search}
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
        name="UploadTab"
        component={Spinner}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({size, color}) => (
            <PlusIcon fill={color} width={size * 1.2} height={size * 1.2} />
          ),
        }}
        listeners={{
          tabPress: e => {
            if (authState !== EAuthState.AUTHORIZED) {
              SheetManager.show('loginSheet', {
                payload: {closable: true},
              }).then();
            } else {
              navigation.navigate('Upload');
            }
            e.preventDefault();
          },
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
    // alignSelf: 'center',
    // justifySelf: 'center',
    // justifyContent: 'center',
    // flexDirection: 'column',
    borderTopWidth: 0,
    backgroundColor: theme.colors.background,
  },
}));
export default Tabs;
