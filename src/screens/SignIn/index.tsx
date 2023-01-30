import React, {useCallback, useEffect} from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {makeStyles} from '@rneui/themed';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {SheetManager} from 'react-native-actions-sheet';
import AppLogo from '@assets/logo/appLogoWithText.svg';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {initialized} from '@redux/reducer/authReducer';
import Keychain from 'react-native-keychain';
import {useAppDispatch} from '@redux/store/RootStore';

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
    console.log('showsheet');
    await SheetManager.show('loginSheet', {payload: {closable: false}});
  }, []);
  useEffect(() => {
    // apiInstance.interceptors.request.use(config => {
    //   console.log(config);
    //   return config;
    // });
    // apiInstance.interceptors.response.use(config => {
    //   console.log(config);
    //   return config;
    // });
    // Retrieve the credentials
    console.log('eff');
    Keychain.getGenericPassword()
      .then(credentials => {
        if (credentials) {
          console.log('cred', credentials.username);
          getCsrfToken.then(token => {
            console.log('111', token);
            apiInstance
              .post<response<ISession>>('/api/auth/signIn', {
                _csrf: token,
                id: credentials.username,
                password: credentials.password,
              })
              .then(response => {
                console.log(response, token);
                if (response.data.code !== 200) {
                  dispatch(initialized(null));
                  showSheet().then(r => console.log(r));
                } else {
                  console.log(response.data.data);
                  dispatch(initialized(response.data.data));
                  navigation.dispatch(
                    CommonActions.reset({
                      // stale: false,
                      // stale: false,
                      routes: [{name: 'Tabs'}],
                    }),
                  );
                  // navigation.reset({stale: false, routes: [{name: 'Tabs'}]});
                }
                // aa().then(() => {});
              })
              .catch(error => console.log(error));
          });
        } else {
          dispatch(initialized(null));
          showSheet().then(r => console.log(r));
        }
      })
      .finally(() => {
        console.log('fine');
      });
  }, [dispatch, navigation, showSheet]);

  const styles = useStyles();
  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Pressable
        style={styles.container} //onLayout={showSheet}
        onPress={showSheet}>
        <View style={{marginBottom: 300}}>
          <AppLogo width={300} height={300} />
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
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
