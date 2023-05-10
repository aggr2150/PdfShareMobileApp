import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {makeStyles} from '@rneui/themed';
import Settings from '@screens/Settings';
import BlockList from '@screens/BlockList';
import Information from '@screens/Settings/Information';
import CustomerService from '@screens/Settings/CustomerService';
import Notification from '@screens/Settings/Notification';

const SettingStack = createStackNavigator<SettingStackParams>();

const SettingStackNavigation = () => {
  const styles = useStyles();
  return (
    <SettingStack.Navigator
      initialRouteName={'index'}
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#000',
          borderBottomWidth: 0,
          // borderBottomColor: '#333',
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: '#fff',
        },
        headerLeftLabelVisible: false,
        cardStyle: {backgroundColor: '#000', borderBottomWidth: 0},
      }}>
      <SettingStack.Screen
        name="index"
        component={Settings}
        options={{
          title: '설정',
        }}
      />
      <SettingStack.Screen
        name="Notification"
        component={Notification}
        options={{
          title: '알림 설정',
        }}
      />
      <SettingStack.Screen
        name="CustomerService"
        component={CustomerService}
        options={{
          title: '1:1 문의',
        }}
      />
      <SettingStack.Screen
        name="Information"
        component={Information}
        options={{
          title: '정보',
        }}
      />
      <SettingStack.Screen
        name="BlockList"
        component={BlockList}
        options={{
          title: '차단관리',
        }}
      />
    </SettingStack.Navigator>
  );
};

const useStyles = makeStyles(theme => ({
  primaryCard: {
    backgroundColor: theme.colors.primary,
  },
  defaultCard: {
    backgroundColor: theme.colors.background,
  },
}));
export default SettingStackNavigation;
