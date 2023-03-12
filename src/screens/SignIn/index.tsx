import React, {useCallback, useEffect} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {makeStyles} from '@rneui/themed';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {SheetManager} from 'react-native-actions-sheet';
import AppLogo from '@assets/logo/AppLogo.svg';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {
  EAuthState,
  getAuthState,
  initialized,
} from '@redux/reducer/authReducer';
import Keychain from 'react-native-keychain';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {blockUserSetAll} from '@redux/reducer/blocksReducer';

const SignIn: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const {height, width} = useWindowDimensions();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const showSheet = useCallback(async () => {
    await SheetManager.show('loginSheet', {payload: {closable: false}});
  }, []);
  const authState = useAppSelector(state => getAuthState(state));
  useEffect(() => {
    if (authState === EAuthState.NONE) {
      showSheet().then();
    } else if (authState === EAuthState.AUTHORIZED) {
      navigation.dispatch(
        CommonActions.reset({
          // stale: false,
          // stale: false,
          routes: [{name: 'Tabs'}],
        }),
      );
    }
  }, [authState, navigation, showSheet]);
  useFocusEffect(() => {
    if (authState === EAuthState.NONE) {
      showSheet().then(r => console.log(r));
    } else if (authState === EAuthState.AUTHORIZED) {
      navigation.dispatch(
        CommonActions.reset({
          // stale: false,
          // stale: false,
          routes: [{name: 'Tabs'}],
        }),
      );
    }
  });

  // const initializeCallback = useCallback(() => {
  //   Keychain.getGenericPassword()
  //     .then(credentials => {
  //       if (credentials) {
  //         getCsrfToken.then(token => {
  //           apiInstance
  //             .post<response<ISession>>('/api/auth/signIn', {
  //               _csrf: token,
  //               id: credentials.username,
  //               password: credentials.password,
  //             })
  //             .then(response => {
  //               if (response.data.code !== 200) {
  //                 dispatch(initialized(null));
  //                 showSheet().then(r => console.log(r));
  //               } else {
  //                 dispatch(initialized(response.data.data));
  //                 apiInstance.post('/api/account/block/list').then(result => {
  //                   if (result.data.code === 200) {
  //                     if (result.data.data) {
  //                       console.log('block', result.data.data);
  //                       dispatch(blockUserSetAll(result.data.data));
  //                     }
  //                   }
  //                 });
  //                 navigation.dispatch(
  //                   CommonActions.reset({
  //                     // stale: false,
  //                     // stale: false,
  //                     routes: [{name: 'Tabs'}],
  //                   }),
  //                 );
  //                 // navigation.reset({stale: false, routes: [{name: 'Tabs'}]});
  //               }
  //               // aa().then(() => {});
  //             })
  //             .catch(error => console.log(error));
  //         });
  //       } else {
  //         dispatch(initialized(null));
  //         showSheet().then(r => console.log(r));
  //       }
  //     })
  //     .finally(() => {
  //       console.log('fine');
  //     });
  // }, [dispatch, navigation, showSheet]);
  // React.useEffect(() => {
  //   // Return the function to unsubscribe from the event so it gets removed on unmount
  //   return navigation.addListener('focus', () => {
  //     initializeCallback();
  //   });
  // }, [initializeCallback, navigation]);
  const dimensions = useWindowDimensions();
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={styles.statusBar.backgroundColor}
      />
      <View
        // onPress={showSheet}
        style={[
          styles.container,
          {
            justifyContent:
              dimensions.height >= 240 * 2 ? 'flex-end' : 'center',
          },
        ]} //onLayout={showSheet}
      >
        {/*<View style={{marginBottom: '50%'}}>*/}
        <AppLogo width={240} height={240} />
        {/*<Image*/}
        {/*  source={require('@assets/logo/logo240.png')}*/}
        {/*  style={{width: 210, height: 210}}*/}
        {/*/>*/}
        {/*</View>*/}
      </View>
      {dimensions.height >= 240 * 2 && <View style={{flex: 1}}></View>}
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  statusBar: {
    backgroundColor: theme.colors.background,
  },
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // marginTop: 25,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
}));

export default SignIn;
