/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';

import {
  getPathFromState,
  getStateFromPath,
  LinkingOptions,
  NavigationContainer,
} from '@react-navigation/native';
import RootNavigation from './src/navigations/RootNavigation';
import {ThemeProvider} from '@rneui/themed';
import theme from './src/components/theme';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SheetProvider} from 'react-native-actions-sheet';
import '@src/components/sheets/register.ts';
import codePush from 'react-native-code-push';
import Toast from 'react-native-toast-message';
import {RootStore} from '@redux/store/RootStore';
import {Provider} from 'react-redux';
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
const linking = {
  prefixes: ['everyPdf://', 'https://everypdf.cc'],
  config: {
    initialRouteName: 'Tabs',
    screens: {
      Tabs: {
        screens: {
          ProfileTab: {
            initialRouteName: 'My',
            screens: {
              Profile: {
                path: '/u/:id',
                exact: true,
              },
            },
          },
        },
      },
      Pdf: {
        screens: {
          Viewer: {
            path: 'post/:_id',
            // params: {_id: 'jane'},
            // initialRouteName: 'index',
          },
          Comments: {
            path: 'post/:postId/:commentId',
          },
          Replies: {
            path: 'post/:postId/:parentCommentId/commentId',

            // exact: true,
          },
        },
      },
      // Profile: 'user',
    },
    /* configuration for matching screens with paths */
  },
  getStateFromPath: (path, config) => {
    // config.
    const result: any = getStateFromPath(path, config);
    console.log(result, path);
    if (
      result.routes[1].state?.routes[0] &&
      (result?.routes[1].state?.routes[0].name === 'Comments' ||
        result?.routes[1].state?.routes[0].name === 'Replies') &&
      result.routes[1].state?.routes[0].params
    ) {
      const routes = [result?.routes[0]];
      routes.push(
        {
          name: 'Viewer',
          params: {
            _id: result.routes[1].state?.routes[0].params.postId,
          },
        },
        {
          name: 'Comments',
          params: {
            postId: result.routes[1].state?.routes[0].params.postId,
            commentId:
              result.routes[1].state?.routes[0].params.parentCommentId ??
              result.routes[1].state?.routes[0].params.commentId,
          },
        },
      );
      if (result?.routes[1].state?.routes[0]?.name === 'Replies') {
        routes.push({
          name: 'Replies',
          params: {
            postId: result.routes[1].state?.routes[0].params.postId,
            parentCommentId:
              result.routes[1].state?.routes[0].params.parentCommentId,
            commentId: result.routes[1].state?.routes[0].params.commentId,
          },
        });
      }
      result.routes[1].state.routes = routes;
      return result;
    }
    return result;
  },
};
const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <PaperProvider
          theme={{
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              onSurfaceVariant: '#60B630',
            },
          }}>
          <SafeAreaProvider>
            <Provider store={RootStore}>
              <NavigationContainer linking={linking}>
                <SheetProvider>
                  <RootNavigation />
                </SheetProvider>
              </NavigationContainer>
            </Provider>
          </SafeAreaProvider>
        </PaperProvider>
      </ThemeProvider>
      <Toast />
    </>
  );
};

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
  rollbackRetryOptions: {
    delayInHours: 0,
    maxRetryAttempts: 5,
  },
  // mandatoryInstallMode:
})(App);
// export default App
