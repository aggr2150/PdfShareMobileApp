import React from 'react';
import {ScrollView, TextInput, View} from 'react-native';
import {Button, Input, makeStyles, Text} from '@rneui/themed';
import {StackScreenProps} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/elements';
import Avatar from '@components/Avatar';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Book from '@components/Book';

type UploadProps = StackScreenProps<RootStackParamList, 'Upload'>;

const Upload: React.FC<UploadProps> = ({navigation, route}) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      {/*<View*/}
      {/*  style={{*/}
      {/*    zIndex: 0,*/}
      {/*    position: 'absolute',*/}
      {/*    top: 0,*/}
      {/*    bottom: 0,*/}
      {/*    left: 0,*/}
      {/*    right: 0,*/}
      {/*  }}>*/}
      {/*  <View style={{backgroundColor: '#99c729', aspectRatio: 16 / 9}} />*/}
      {/*  /!*<View style={{backgroundColor: 'red', height: '100%'}} />*!/*/}
      {/*</View>*/}
      <ScrollView>
        <View
          style={{
            zIndex: 0,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <View style={{backgroundColor: '#99c729', aspectRatio: 16 / 9}} />
        </View>
        <View>
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
            <View style={{width: '50%', marginBottom: 20}}>
              <Book />
            </View>
            <Button
              buttonStyle={{
                borderRadius: 24,
                paddingVertical: 5,
                paddingHorizontal: 45,
                marginBottom: 24,
                backgroundColor: '#99c729',
              }}
              title={
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{fontSize: 8}} />
                  <Text style={{fontSize: 13}}>내 PDF 업로드</Text>
                  <Text style={{fontSize: 8}}>(최대 20MB)</Text>
                </View>
              }
            />
            <View style={styles.inputField}>
              <TextInput
                style={styles.titleInput}
                keyboardType={'url'}
                multiline={true}
                placeholderTextColor={'#1ba639'}
                placeholder={'컨텐츠의 제목을 넣어주세요'}
              />
              <TextInput
                style={styles.contentInput}
                placeholderTextColor={'white'}
                multiline={true}
                placeholder={
                  '자신의 아이디어, 문서, 프로젝트들을 이곳에 간단\n' +
                  '히 설명해 주세요. 해시 태그를 달아도 좋아요.'
                }
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
    // flex: 1,
    // backgroundColor: theme.colors.primary,
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
    backgroundColor: 'black',
    borderRadius: 20,
  },
  contentInput: {
    // backgroundColor: '#fff',
    color: 'white',
    paddingHorizontal: 0,
    fontSize: 13,
    fontFamily: 'Apple SD Gothic Neo',
  },
  titleInput: {
    color: '#1ba639',
    textAlign: 'center',
    paddingHorizontal: 0,
    fontSize: 22,
    fontFamily: 'Apple SD Gothic Neo',
  },
  label: {
    marginTop: 3,
    fontSize: 12,
  },
}));
export default Upload;
