import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PdfViewer from '../screens/PdfViewer';
import Comments from '@screens/Comments';
import {makeStyles} from '@rneui/themed';
import Replies from '../screens/Comments/Replies';

const PdfViewerStack = createStackNavigator<PdfViewerStackParams>();

const PdfViewerStackNavigation = () => {
  const styles = useStyles();
  return (
    <PdfViewerStack.Navigator
      initialRouteName={'Viewer'}
      screenOptions={{
        cardStyle: {backgroundColor: '#000', borderBottomWidth: 0},
      }}>
      <PdfViewerStack.Screen
        name="Viewer"
        component={PdfViewer}
        options={{
          headerShown: false,
          // header: ViewerHeader,
        }}
      />
      <PdfViewerStack.Screen
        name="Comments"
        component={Comments}
        options={{
          title: '댓글',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTitleStyle: {
            color: '#fff',
          },
          headerLeftLabelVisible: false,
          presentation: 'modal',
          headerMode: 'screen',
        }}
      />
      <PdfViewerStack.Screen
        name="Replies"
        component={Replies}
        options={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTitleStyle: {
            color: '#fff',
          },
          presentation: 'modal',
          headerLeftLabelVisible: false,
        }}
      />
    </PdfViewerStack.Navigator>
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
export default PdfViewerStackNavigation;
