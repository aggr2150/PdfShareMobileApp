import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StatusBar, TextInput as BaseInput, View} from 'react-native';
import {Button, makeStyles, Text} from '@rneui/themed';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {TextInput} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import BackButton from '@components/BackButton';
import Keychain from 'react-native-keychain';
import {getSession} from '@redux/reducer/authReducer';
import {useAppSelector} from '@redux/store/RootStore';

type ChangePasswordProps = StackScreenProps<
  RootStackParamList,
  'ChangePassword'
>;
const ChangePassword: React.FC<ChangePasswordProps> = ({navigation}) => {
  const styles = useStyles();
  const [csrfToken, setCsrfToken] = useState<string>();
  const [oldPassword, setOldPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const passwordConfirmRef = useRef<BaseInput>(null);
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
  }, []);
  const session = useAppSelector(state => getSession(state));

  const changePassword = useCallback(() => {
    apiInstance
      .post('/api/account/changePassword', {
        oldPassword,
        password,
        passwordConfirm,
        _csrf: csrfToken,
      })
      .then(response => {
        switch (response.data.code) {
          case 200:
            Keychain.getGenericPassword().then(result => {
              if (result) {
                Keychain.setGenericPassword(result.username, password).then(r =>
                  console.log(r),
                );
              }
            });
            Toast.show({
              type: 'success',
              text1: '비밀번호가 변경되었습니다.',
              position: 'bottom',
            });
            navigation.goBack();
            break;
          case 400:
            Toast.show({
              type: 'error',
              text1: '비밀번호가 일치하지 않습니다.',
              position: 'bottom',
            });
            break;
          case 422:
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
              case 'oldPassword':
                Toast.show({
                  type: 'error',
                  text1: '잘못된 비밀번호 입력입니다.',
                  position: 'bottom',
                });
                break;
            }
            break;
          case 500:
            Toast.show({
              type: 'error',
              text1: 'Unknown Error Occurred!',
              position: 'bottom',
            });
            break;
          default:
            Toast.show({
              type: 'error',
              text1: 'Unknown Error Occurred!',
              position: 'bottom',
            });
        }
      })
      .catch(() =>
        Toast.show({
          type: 'error',
          text1: 'Unknown Error Occurred!',
          position: 'bottom',
        }),
      );
  }, [oldPassword, password, passwordConfirm, csrfToken]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
      <View style={styles.header}>
        <View
          style={{
            marginHorizontal: 11,
            position: 'absolute',
            alignSelf: 'flex-start',
          }}>
          <BackButton onPress={() => navigation.goBack()} color={'white'} />
        </View>
        <View>
          <Text style={styles.headerLabel}>비밀번호 변경</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View>
            <View>
              <TextInput
                onChangeText={setOldPassword}
                label="현재 비밀번호"
                dense={true}
                style={styles.textInput}
                contentStyle={styles.textInputContent}
                activeUnderlineColor={'#4c4c4c'}
                autoCapitalize={'none'}
                multiline={false}
                textColor={'#fff'}
                underlineColor={'#4c4c4c'}
                onSubmitEditing={() => passwordConfirmRef.current?.focus()}
                secureTextEntry={true}
                autoCorrect={false}
                value={oldPassword}
              />
              <TextInput
                onChangeText={setPassword}
                label="새 비밀번호"
                dense={true}
                style={styles.textInput}
                contentStyle={styles.textInputContent}
                activeUnderlineColor={'#4c4c4c'}
                autoCapitalize={'none'}
                multiline={false}
                textColor={'#fff'}
                underlineColor={'#4c4c4c'}
                onSubmitEditing={() => passwordConfirmRef.current?.focus()}
                secureTextEntry={true}
                autoCorrect={false}
                value={password}
              />
              <TextInput
                ref={passwordConfirmRef}
                onChangeText={setPasswordConfirm}
                label="비밀번호 확인"
                dense={true}
                style={styles.textInput}
                contentStyle={styles.textInputContent}
                activeUnderlineColor={'#4c4c4c'}
                multiline={false}
                textColor={'#fff'}
                underlineColor={'#4c4c4c'}
                onSubmitEditing={changePassword}
                secureTextEntry={true}
                autoCorrect={false}
                value={passwordConfirm}
              />
            </View>
          </View>
        </View>
        <Button
          containerStyle={styles.submitButton}
          onPress={changePassword}
          color={'grey0'}
          // onPress={() => {
          //   navigation.navigate('ResetPasswordConfirm', {
          //     email: email,
          //     verificationCode: verificationCode,
          //   });
          // }}
          titleStyle={styles.buttonLabel}>
          변경
        </Button>
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    marginHorizontal: 35,
    // backgroundColor: theme.colors.background,
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  header: {
    justifyContent: 'center',
    marginVertical: 18,
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 17,
    alignItems: 'center',
  },
  inputHeaderLabel: {
    color: theme.colors.primary,
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
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
  },
  textInputContent: {
    backgroundColor: theme.colors.black,
    color: theme.colors.grey0,
    textAlignVertical: 'bottom',
    fontFamily: 'Apple SD Gothic Neo',
    textAlign: 'left',
    fontSize: 13,
    paddingLeft: 0,
    margin: 0,
    paddingBottom: 0,
  },
  submitButton: {
    backgroundColor: theme.colors.grey0,
    borderRadius: 50,
    marginVertical: 12,
  },
  buttonLabel: {
    fontSize: 15,
  },
}));
export default ChangePassword;
