import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar, View} from 'react-native';
import {Button, makeStyles, Text} from '@rneui/themed';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {TextInput} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import BackButton from '@components/BackButton';

export enum EnumSelectedIndex {
  'checkVerificationCode',
  'resetPassword',
}

type ResetPasswordProps = StackScreenProps<RootStackParamList, 'ResetPassword'>;
const ResetPassword: React.FC<ResetPasswordProps> = ({navigation}) => {
  const styles = useStyles();
  const [csrfToken, setCsrfToken] = useState<string>();
  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
  }, []);

  const sendVerificationCode = useCallback(() => {
    apiInstance
      .post('/api/auth/resetPassword/sendVerificationCode', {
        email: email,
        _csrf: csrfToken,
      })
      .then(response => {
        switch (response.data.code) {
          case 200:
            Toast.show({
              type: 'success',
              text1: '인증번호가 전송되었습니다.',
              position: 'bottom',
            });
            break;
          case 422:
            Toast.show({
              type: 'error',
              text1: '잘못된 이메일 형식입니다.',
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
          case 500:
            Toast.show({
              type: 'error',
              text1: 'Unknown Error Occurred!',
              position: 'bottom',
            });
            break;
        }
      });
  }, [email, csrfToken]);

  const submitVerificationCode = useCallback(() => {
    apiInstance
      .post('/api/auth/resetPassword/submitVerificationCode', {
        email: email,
        verificationCode: verificationCode,
        _csrf: csrfToken,
      })
      .then(response => {
        console.log('email', response.data);
        switch (response.data.code) {
          case 200:
            navigation.navigate('ResetPasswordConfirm', {
              email: email,
              verificationCode: verificationCode,
            });
            // setSelectedIndex(EnumSelectedIndex.resetPassword);
            break;
          case 422:
            Toast.show({
              type: 'error',
              text1: '잘못된 이메일 형식입니다.',
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
          case 500:
            Toast.show({
              type: 'error',
              text1: 'Unknown Error Occurred!',
              position: 'bottom',
            });
            break;
        }
      });
  }, [email, verificationCode, csrfToken, navigation]);
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
            <Text style={styles.inputHeaderLabel}>
              {'이메일을 먼저 확인하신 후\n비밀번호를 변경하실 수 있습니다.'}
            </Text>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <View style={{flex: 1}}>
                  <TextInput
                    onChangeText={setEmail}
                    label="이메일"
                    dense={true}
                    style={styles.textInput}
                    contentStyle={styles.textInputContent}
                    activeUnderlineColor={'#99c729'}
                    keyboardType={'email-address'}
                    spellCheck={false}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    textColor={'#fff'}
                    underlineColor={'#99c729'}
                    onSubmitEditing={sendVerificationCode}
                  />
                </View>
                <Button
                  titleStyle={styles.buttonLabel}
                  onPress={sendVerificationCode}>
                  전송
                </Button>
              </View>
              <TextInput
                onChangeText={setVerificationCode}
                label="인증번호"
                dense={true}
                style={styles.textInput}
                contentStyle={styles.textInputContent}
                activeUnderlineColor={'#99c729'}
                keyboardType={'numeric'}
                spellCheck={false}
                autoCorrect={false}
                multiline={true}
                textColor={'#fff'}
                underlineColor={'#99c729'}
                onSubmitEditing={submitVerificationCode}
              />
            </View>
          </View>
        </View>
        <Button
          containerStyle={styles.submitButton}
          onPress={submitVerificationCode}
          // onPress={() => {
          //   navigation.navigate('ResetPasswordConfirm', {
          //     email: email,
          //     verificationCode: verificationCode,
          //   });
          // }}
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
export default ResetPassword;
