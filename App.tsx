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
import {useColorScheme} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
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

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <Provider store={RootStore}>
            <NavigationContainer>
              <SheetProvider>
                <RootNavigation />
              </SheetProvider>
            </NavigationContainer>
          </Provider>
        </SafeAreaProvider>
      </ThemeProvider>
      <Toast />
    </>
  );
};

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
})(App);
