import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import Profile from '@screens/Profile';
import Revenue from '@screens/Profile/Revenue';
import ProfileHeaderRight from '@screens/Profile/ProfileHeaderRight';
import {makeStyles} from '@rneui/themed';
import {useAppSelector} from '@redux/store/RootStore';
import {getSession} from '@redux/reducer/authReducer';
import Information from '@screens/Profile/Information';

const ProfileStack = createStackNavigator<ProfileStackScreenParams>();

const ProfileStackNavigation = () => {
  const styles = useStyles();
  const session = useAppSelector(state => getSession(state));
  return (
    <ProfileStack.Navigator
      screenOptions={({navigation, route}) => ({
        cardStyle: styles.card,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTitle: route.params?.id || session?.id || '',
        headerTintColor: 'white',
        headerPressColor: 'white',
      })}>
      <ProfileStack.Group
        screenOptions={{
          headerRight: ProfileHeaderRight,
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
        <ProfileStack.Screen
          name="Information"
          component={Information}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          }}
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
