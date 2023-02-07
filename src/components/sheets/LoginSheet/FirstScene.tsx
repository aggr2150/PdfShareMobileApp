import {TextInput, TouchableOpacity, View} from 'react-native';
import {Button, Input, makeStyles, Text} from '@rneui/themed';
import Keychain from 'react-native-keychain';
import {apiInstance} from '@utils/Networking';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Input as BaseInput} from '@rneui/base/dist/Input/Input';
import {SheetManager} from 'react-native-actions-sheet';
import {useAppDispatch} from '@redux/store/RootStore';
import {signIn} from '@redux/reducer/authReducer';

const FirstScene = props => {
  const styles = useStyles(props);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const passwordRef = useRef<BaseInput & TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState<string>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    apiInstance.post<CsrfTokenResponse>('/api/csrfToken').then(response => {
      if (response.status === 200) {
        setCsrfToken(response.data.data._csrf);
        apiInstance.defaults.data = {
          _csrf: response.data.data._csrf,
        };
      }
    });
  }, []);
  const submit = useCallback(() => {
    // SheetManager.hide('loginSheet').then(() => {
    //   console.log('loginSheetHide');
    // });
    // navigation.reset({routes: [{name: 'Tabs'}]});
    apiInstance
      .post<response<ISession>>('/api/auth/signIn', {
        _csrf: csrfToken,
        id: email,
        password: password,
      })
      .then(response => {
        console.log(
          'response',
          csrfToken,
          response.data.code,
          response.data.status,
        );
        if (response.data.code === 200) {
          dispatch(signIn(response.data.data));
          Keychain.setGenericPassword(email, password).then(r =>
            console.log(r),
          );
          props.setClosable(true);
          SheetManager.hide('loginSheet').then(() => {
            navigation.dispatch(
              CommonActions.reset({
                // stale: true,
                // stale: false,
                // index: 0,
                routes: [{name: 'Tabs'}],
              }),
            );
            // navigation.reset({
            //   stale: false,
            //   index: 0,
            //   routes: [{name: 'Tabs'}],
            // });
          });
        }
      });
  }, [csrfToken, dispatch, email, navigation, password, props]);

  return (
    <View>
      <View>
        <Input
          onChangeText={setEmail}
          style={styles.textInput}
          placeholder={'이메일 주소'}
          placeholderTextColor={'#99c729'}
          inputContainerStyle={{borderBottomWidth: 0}}
          renderErrorMessage={false}
          containerStyle={{paddingHorizontal: 0}}
          inputStyle={{margin: 0}}
          keyboardType={'email-address'}
          autoCorrect={false}
          autoCapitalize={'none'}
          returnKeyType={'next'}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <Input
          onChangeText={setPassword}
          ref={passwordRef}
          style={styles.textInput}
          placeholder={'비밀번호'}
          placeholderTextColor={'#99c729'}
          inputContainerStyle={{borderBottomWidth: 0}}
          renderErrorMessage={false}
          containerStyle={{paddingHorizontal: 0, margin: 0}}
          inputStyle={{margin: 0}}
          secureTextEntry={true}
          autoCorrect={false}
          returnKeyType={'done'}
          onSubmitEditing={submit}
        />
      </View>
      <View>
        <Button containerStyle={styles.submitButton} onPress={submit}>
          aaa
        </Button>
      </View>
      <View
        style={{
          margin: 12,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            props.setClosable(true);
            navigation.navigate('ResetPassword');
          }}>
          <Text>비밀번호 찾기</Text>
        </TouchableOpacity>
        <Text> / </Text>
        <TouchableOpacity
          onPress={() => {
            props.setClosable(true);
            navigation.dispatch(
              CommonActions.reset({
                // stale: true,
                // stale: false,
                // index: 0,
                routes: [{name: 'Tabs'}],
              }),
            );
          }}>
          <Text>홈으로 가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const useStyles = makeStyles(theme => ({
  submitButton: {
    borderRadius: 20,
  },
  container: {
    backgroundColor: theme.colors.sheetsBackground,
    paddingHorizontal: 35,
    // justifyContent: 'center',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  header: {
    margin: 30,
    alignItems: 'center',
  },
  textInput: {
    marginBottom: 7,
    backgroundColor: theme.colors.black,
    color: theme.colors.white,
    // alignSelf: 'stretch',
    textAlign: 'left',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 20,
    fontSize: 14,
    // color: theme.colors.white,
  },
  headerText: {
    fontSize: 17,
    color: theme.colors.black,
  },
}));
export default FirstScene;
