import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Profile from '@screens/Profile';
import Revenue from '@screens/Profile/Revenue';
import Spinner from '@components/Spinner';
import HeaderRight from '@screens/Profile/HeaderRight';
import {makeStyles} from '@rneui/themed';

const ProfileStack = createStackNavigator<ProfileStackScreenParams>();

const ProfileStackNavigation = () => {
  const styles = useStyles();
  return (
    <ProfileStack.Navigator
      screenOptions={({navigation, route}) => ({
        cardStyle: styles.card,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTitle: route.params?.id || '',
        headerTintColor: 'white',
        headerPressColor: 'white',
      })}>
      <ProfileStack.Group
        screenOptions={{
          headerRight: () => <HeaderRight />,
        }}>
        <ProfileStack.Screen
          name="My"
          component={Profile}
          // options={{headerRight: props => {props.}}}
          // options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="Profile"
          component={Profile}
          // options={{headerShown: false}}
        />
      </ProfileStack.Group>
      <ProfileStack.Screen
        name="Revenue"
        component={Revenue}
        options={{headerTitle: '광고 수익'}}
      />
    </ProfileStack.Navigator>
  );
};

const useStyles = makeStyles(theme => ({
  headerTitle: {
    color: theme.colors.black,
    fontFamily: theme.fontFamily,
    fontWeight: 'bold',
  },
  header: {backgroundColor: theme.colors.background},
  card: {backgroundColor: theme.colors.background},
}));
export default ProfileStackNavigation;
