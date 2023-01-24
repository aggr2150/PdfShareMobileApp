import {TouchableOpacity, View} from 'react-native';
import {Button, makeStyles, Text} from '@rneui/themed';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {TextInput} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {Input as BaseInput} from '@rneui/base/dist/Input/Input';
import {signIn} from '@redux/reducer/authReducer';
import Toast from 'react-native-toast-message';
import {useAppDispatch} from '@redux/store/RootStore';
import {SheetManager} from 'react-native-actions-sheet';
import Keychain from 'react-native-keychain';

const SecondScene = props => {
  const styles = useStyles(props);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const passwordRef = useRef<BaseInput & TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [csrfToken, setCsrfToken] = useState<string>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
  }, []);
  const sendVerificationCode = useCallback(() => {
    apiInstance
      .post('/api/auth/signUp/sendVerificationCode', {
        _csrf: csrfToken,
        email: email,
      })
      .then(result => {
        console.log(result);
        Keychain.setGenericPassword(email, password).then(r => console.log(r));
      })
      .catch(error => console.log(error));
  }, [csrfToken, email]);
  const submit = useCallback(() => {
    // Toast.show({
    //   type: 'success',
    //   text1: 'Hello',
    //   // text2: 'This is some something 👋',
    //   position: 'bottom',
    // });
    apiInstance
      .post<response<ISession> & {errors: {param: string}}>(
        '/api/auth/signUp/submitVerificationCode',
        {
          _csrf: csrfToken,
          email: email,
          password: password,
          passwordConfirm: passwordConfirm,
          verificationCode: verificationCode,
        },
      )
      .then(response => {
        console.log(response);
        switch (response.data.code) {
          case 200:
            dispatch(signIn(response.data.data));
            props.setClosable(true);
            SheetManager.hide('loginSheet').then(() => {
              console.log('loginSheetHide');
              navigation.reset({routes: [{name: 'Tabs'}]});
            });
            break;
          case 410:
            /* TODO
            expired
            */
            Toast.show({
              type: 'error',
              text1: '만료된 인증번호 입니다.',
              position: 'bottom',
            });
            break;
          case 422:
            /* TODO
          param
          */
            console.log(
              response.data,
              response.data.errors[0],
              verificationCode,
            );
            switch (response.data.errors[0].param) {
              case 'passwordConfirm':
                Toast.show({
                  type: 'error',
                  text1: '비밀번호가 다릅니다.',
                  position: 'bottom',
                });
                break;
              case 'password':
                Toast.show({
                  type: 'error',
                  text1:
                    '숫자, 대소문자 및 특수문자가 포함된 8 ~ 20자 비밀번호가 필요합니다',
                  position: 'bottom',
                });
                break;
              case 'verificationCode':
                Toast.show({
                  type: 'error',
                  text1: '잘못된 인증번호입니다.',
                  position: 'bottom',
                });
                break;
              case 'email':
                Toast.show({
                  type: 'error',
                  text1: '잘못된 이메일 형식입니다.',
                  position: 'bottom',
                });
                break;
            }
            break;
          case 429:
            /* TODO
          too many requests
          */
            break;
        }
      })
      .catch(error => console.log(error));
  }, [csrfToken, email, password, passwordConfirm, verificationCode]);
  return (
    <View>
      <View style={styles.inputContainer}>
        <View style={styles.inputField}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={setEmail}
                label="이메일 주소"
                dense={true}
                style={styles.textInput}
                contentStyle={styles.textInputContent}
                activeUnderlineColor={'#99c729'}
                autoCorrect={false}
                autoCapitalize={'none'}
                underlineColor={'#99c729'}
              />
            </View>
            <TouchableOpacity
              style={{justifyContent: 'center'}}
              onPress={sendVerificationCode}>
              <Text style={{color: 'red'}}>전송</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            onChangeText={setVerificationCode}
            label="인증번호"
            dense={true}
            style={styles.textInput}
            contentStyle={styles.textInputContent}
            activeUnderlineColor={'#99c729'}
            keyboardType={'numeric'}
            autoCorrect={false}
            returnKeyType={'next'}
            underlineColor={'#99c729'}
          />
          <TextInput
            onChangeText={setPassword}
            label="비밀번호"
            dense={true}
            style={styles.textInput}
            contentStyle={styles.textInputContent}
            activeUnderlineColor={'#99c729'}
            textColor={'#fff'}
            underlineColor={'#99c729'}
            secureTextEntry={true}
            autoCorrect={false}
          />
          <TextInput
            onChangeText={setPasswordConfirm}
            label="비밀번호 확인"
            dense={true}
            style={styles.textInput}
            contentStyle={styles.textInputContent}
            activeUnderlineColor={'#99c729'}
            keyboardType={'url'}
            textColor={'#fff'}
            underlineColor={'#60b630'}
            secureTextEntry={true}
            autoCorrect={false}
          />
        </View>
      </View>
      <View>
        <Button
          containerStyle={styles.submitButton}
          onPress={submit}
          // onPress={async () => {
          //   const credentials = await Keychain.getGenericPassword();
          //   console.log(credentials);
          //   if (credentials) {
          //     console.log(
          //       'Credentials successfully loaded for user ' + credentials,
          //     );
          //     apiInstance.defaults.auth = {
          //       username: credentials.username,
          //       password: credentials.password,
          //     };
          //     apiInstance
          //       .post<{
          //         code: number;
          //         status: string;
          //         data: {
          //           deviceToken: string;
          //         };
          //       }>(
          //         'https://everypdf.cc/api/signIn',
          //         {},
          //         {
          //           xsrfCookieName: '',
          //           auth: {
          //             username: credentials.username,
          //             password: credentials.password,
          //           },
          //         },
          //       )
          //       .then(result => {
          //         console.log('result', result.data);
          //       });
          //   } else {
          //     Keychain.setGenericPassword('aaa', 'aa').then(r =>
          //       console.log(r),
          //     );
          //   }
          // }}
        >
          aaa
        </Button>
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
  headerText: {
    fontSize: 17,
    color: theme.colors.black,
  },

  inputField: {
    // flex: 1,
    width: '100%',
    paddingTop: 3,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.black,
    borderRadius: 20,
  },
  textInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    fontSize: 13,
    minHeight: 37,
    height: 48,
  },
  textInputContent: {
    backgroundColor: theme.colors.black,
    color: theme.colors.secondary,
    fontFamily: 'Apple SD Gothic Neo',
    // alignSelf: 'stretch',
    textAlign: 'left',
    fontSize: 13,
    paddingLeft: 0,
    margin: 0,
    paddingBottom: 0,
  },
  inputContainer: {
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    marginBottom: 7,
  },
}));
export default SecondScene;
