import React from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Input, makeStyles, Text} from '@rneui/themed';
import {StackScreenProps} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/elements';
import Avatar from '@components/Avatar';
import {TextInput} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

type UploadProps = StackScreenProps<RootStackParamList, 'Upload'>;

const Upload: React.FC<UploadProps> = ({navigation, route}) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <View style={{backgroundColor: '#99c729', aspectRatio: 16 / 9}} />
          <View style={{backgroundColor: 'red', height: '100%'}} />
        </View>
        <View style={{position: 'absolute'}}>
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
                dense={true}
                style={styles.textInput}
                contentStyle={styles.textInputContent}
                activeUnderlineColor={'#99c729'}
                keyboardType={'url'}
                multiline={true}
                textColor={'#fff'}
                placeholder={'컨텐츠의 제목을 넣어주세요'}
                underlineColor={'#99c729'}
              />
              <TextInput
                dense={true}
                style={styles.textInput}
                contentStyle={styles.textInputContent}
                activeUnderlineColor={'#99c729'}
                keyboardType={'url'}
                multiline={true}
                textColor={'#fff'}
                placeholder={
                  '자신의 아이디어, 문서, 프로젝트들을 이곳에 간단\n' +
                  '히 설명해 주세요. 해시 태그를 달아도 좋아요.'
                }
                underlineColor={'#99c729'}
              />
            </View>
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
export default Upload;
