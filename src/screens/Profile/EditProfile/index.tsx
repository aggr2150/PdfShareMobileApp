import React from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Input, makeStyles, Text} from '@rneui/themed';
import {StackScreenProps} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/elements';
import Avatar from '@components/Avatar';
import {TextInput} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

type EditProfileProps = StackScreenProps<RootStackParamList, 'EditProfile'>;

const EditProfile: React.FC<EditProfileProps> = ({navigation, route}) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <ScrollView>
        <View
          style={[
            styles.backButton,
            {
              paddingTop: insets.top || 11,
              paddingBottom: 11,
            },
          ]}>
          <HeaderBackButton
            tintColor={'white'}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.inputContainer}>
          {/*<View style={styles.backButton}>*/}
          {/*  <HeaderBackButton*/}
          {/*    tintColor={'white'}*/}
          {/*    onPress={() => navigation.goBack()}*/}
          {/*  />*/}
          {/*</View>*/}
          <View
            style={{
              marginBottom: 12,
            }}>
            <Avatar />
          </View>
          <View style={{marginBottom: 4}}>
            <Text style={styles.nicknameText}>닉네임명</Text>
          </View>
          <View style={{flexDirection: 'row', marginBottom: 14}}>
            <View style={{marginHorizontal: 20}}>
              <Text style={styles.counterText}>구독자 102명</Text>
            </View>
            <View style={{marginHorizontal: 20}}>
              <Text style={styles.counterText}>내 PDF 20개</Text>
            </View>
          </View>
          <Button
            buttonStyle={{
              borderRadius: 24,
              paddingVertical: 14,
              paddingHorizontal: 40,
              marginBottom: 24,
            }}
            title={'프로필 수정'}
          />
          <View style={styles.inputField}>
            <TextInput
              label="아이디"
              // dense={true}
              style={styles.textInput}
              contentStyle={styles.textInputContent}
              activeUnderlineColor={'#99c729'}
              autoCorrect={false}
              returnKeyType={'next'}
              underlineColor={'#99c729'}
            />
            <TextInput
              label="채널명"
              // dense={true}
              style={styles.textInput}
              contentStyle={styles.textInputContent}
              activeUnderlineColor={'#99c729'}
              keyboardType={'email-address'}
              autoCorrect={false}
              returnKeyType={'next'}
              underlineColor={'#99c729'}
            />
            <TextInput
              label="채널 링크"
              dense={true}
              style={styles.textInput}
              contentStyle={styles.textInputContent}
              activeUnderlineColor={'#99c729'}
              keyboardType={'url'}
              multiline={true}
              textColor={'#fff'}
              underlineColor={'#99c729'}
            />
            <TextInput
              label="내 소개"
              dense={true}
              style={styles.textInput}
              contentStyle={styles.textInputContent}
              activeUnderlineColor={'#99c729'}
              keyboardType={'email-address'}
              multiline={true}
              textColor={'#fff'}
              underlineColor={'#99c729'}
            />
          </View>
        </View>
        {/*<Input />*/}
        {/*<Input />*/}
        {/*<Input />*/}
        {/*<Input />*/}
      </ScrollView>
    </View>
  );
};
const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.primary,
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 35,
    alignItems: 'center',
  },
  nicknameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  counterText: {
    fontSize: 12,
    color: theme.colors.black,
  },
  submitButton: {
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    // paddingVertical: 11,
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
  },
  textInputContent: {
    // flex: 1,
    // width: '100%',
    // paddingHorizontal: 0,
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
  label: {
    marginTop: 3,
    fontSize: 12,
  },
}));
export default EditProfile;
