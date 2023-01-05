import React from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Button, makeStyles, Text} from '@rneui/themed';
import Home from '@screens/Home';
import {SheetManager} from 'react-native-actions-sheet';

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
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={SettingsScreen} />
      <Tab.Screen name="Profile" component={SettingsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const useStyles = makeStyles(theme => ({
  tabBarContainer: {
    backgroundColor: theme.colors.background,
  },
}));
