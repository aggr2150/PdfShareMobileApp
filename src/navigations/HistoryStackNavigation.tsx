import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import History from '@screens/History';
import Collection from '@screens/History/CollectionList';
import {makeStyles} from '@rneui/themed';

const HistoryStack = createStackNavigator<HistoryStackScreenParams>();

const HistoryStackNavigation = () => {
  const styles = useStyles();
  return (
    <HistoryStack.Navigator
      screenOptions={{cardStyle: {backgroundColor: '#000'}}}>
      <HistoryStack.Screen
        name="History"
        component={History}
        options={{headerShown: false}}
      />
      <HistoryStack.Screen
        name="Collection"
        component={Collection}
        options={({navigation, route}) => ({
          // cardStyle: styles.card,
          // headerStyle: styles.header,
          // headerTitleStyle: styles.headerTitle,
          // headerTitle: '',
          // headerTintColor: 'white',
          // headerPressColor: 'white',
          // headerLeftLabelVisible: false,
          // headerTitleAlign: 'left',
          headerShown: false,
        })}
      />
    </HistoryStack.Navigator>
  );
};
const useStyles = makeStyles(theme => ({
  headerTitle: {
    color: theme.colors.black,
    fontFamily: theme.fontFamily,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  card: {backgroundColor: theme.colors.background},
}));
export default HistoryStackNavigation;
