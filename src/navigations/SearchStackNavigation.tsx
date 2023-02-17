import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Collection from '@screens/History/CollectionList';
import Search from '@screens/Search';
import SearchResult from '@screens/Search/SearchResult';

const SearchStack = createStackNavigator<SearchStackScreenParams>();

const SearchStackNavigation = () => {
  return (
    <SearchStack.Navigator
      screenOptions={{cardStyle: {backgroundColor: '#000'}}}>
      <SearchStack.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />
      <SearchStack.Screen
        name="SearchResult"
        component={SearchResult}
        options={{
          headerShown: false,
        }}
      />
    </SearchStack.Navigator>
  );
};
export default SearchStackNavigation;
