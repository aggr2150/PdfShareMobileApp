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
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['everyPdf://', 'https://everypdf.cc'],
  config: {
    initialRouteName: 'Tabs',
    screens: {
      Viewer: {
        path: 'post/:_id',
        // parse: {
        //   _id: value => value,
        // },
        // params: {id: 'jane'},
        // screens: {
        //   Comments: {
        //     path: ':postId/comment',
        //   },
        // },
      },
      Tabs: {
        screens: {
          ProfileTab: {
            initialRouteName: 'My',
            screens: {
              Profile: {
                path: 'u/:id',
                exact: true,
              },
            },
          },
        },
      },
      // Profile: 'user',
    },
    /* configuration for matching screens with paths */
  },
  // getStateFromPath: (path, options) => {
  //   const state = getStateFromPath(path, options);
  //   const newState = {
  //     ...state,
  //     routes: state.routes.map(route => {
  //       if (route.name === 'Chat') {
  //         // modify your params however you like here!
  //         return {
  //           ...route,
  //           params: {userObject: route.params},
  //         };
  //       } else {
  //         return route;
  //       }
  //     }),
  //   };
  //   return newState;
  // },
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
              onSurfaceVariant: '#99c729',
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
