import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StatusBar, View, TextInput as BaseInput} from 'react-native';
import {Button, makeStyles, Text} from '@rneui/themed';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {TextInput} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import BackButton from '@components/BackButton';
import {SheetManager} from 'react-native-actions-sheet';

export enum EnumSelectedIndex {
  'checkVerificationCode',
  'resetPassword',
}

type ResetPasswordConfirmProps = StackScreenProps<
  RootStackParamList,
  'ResetPasswordConfirm'
>;
const ResetPasswordConfirm: React.FC<ResetPasswordConfirmProps> = ({
  navigation,
  route,
}) => {
  const styles = useStyles();
  const [csrfToken, setCsrfToken] = useState<string>();
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const passwordConfirmRef = useRef<BaseInput>(null);
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
  }, []);

  const submit = useCallback(() => {
    apiInstance
      .post('/api/auth/resetPassword', {
        email: route.params.email,
        verificationCode: route.params.verificationCode,
        password: password,
        passwordConfirm: passwordConfirm,
        _csrf: csrfToken,
      })
      .then(response => {
        switch (response.data.code) {
          case 200:
            navigation.pop(2);
            SheetManager.show('loginSheet').then();
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
          case 500:
            Toast.show({
              type: 'error',
              text1: 'Unknown Error Occurred!',
              position: 'bottom',
            });
            break;
          case 410:
            Toast.show({
              type: 'error',
              text1: '만료된 인증번호 입니다.',
              position: 'bottom',
            });
            break;
          case 404:
            Toast.show({
              type: 'error',
              text1: '계정을 찾을 수 없습니다.',
              position: 'bottom',
            });
            break;
          case 429:
            Toast.show({
              type: 'error',
              text1: '인증 시도가 너무 많습니다.',
              position: 'bottom',
            });
            break;
          case 400:
            Toast.show({
              type: 'error',
              text1: '잘못된 인증번호입니다.',
              position: 'bottom',
            });
            break;
        }
      });
  }, [password, passwordConfirm, csrfToken, navigation]);
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
          <Text style={styles.headerLabel}>비밀번호 찾기</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View>
            <View>
              <TextInput
                onChangeText={setPassword}
                label="새 비밀번호"
                dense={true}
                style={styles.textInput}
                contentStyle={styles.textInputContent}
                activeUnderlineColor={'#60B630'}
                autoCapitalize={'none'}
                multiline={false}
                textColor={'#fff'}
                underlineColor={'#60B630'}
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
                activeUnderlineColor={'#60B630'}
                multiline={false}
                textColor={'#fff'}
                underlineColor={'#60B630'}
                onSubmitEditing={submit}
                secureTextEntry={true}
                autoCorrect={false}
                value={passwordConfirm}
              />
            </View>
          </View>
        </View>
        <Button
          containerStyle={styles.submitButton}
          onPress={submit}
          // onPress={submitVerificationCode}
          titleStyle={styles.buttonLabel}>
          확인
        </Button>
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    marginHorizontal: 35,
    backgroundColor: theme.colors.primary,
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
    color: theme.colors.secondary,
    textAlignVertical: 'bottom',
    fontFamily: 'Apple SD Gothic Neo',
    textAlign: 'left',
    fontSize: 13,
    paddingLeft: 0,
    margin: 0,
    paddingBottom: 0,
  },
  submitButton: {
    borderRadius: 50,
    marginVertical: 12,
  },
  buttonLabel: {
    fontSize: 15,
  },
}));
export default ResetPasswordConfirm;
