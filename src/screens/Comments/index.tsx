import {
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {Icon, Input, makeStyles, Text} from '@rneui/themed';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
  useScrollHandlers,
} from 'react-native-actions-sheet';
import React, {useEffect, useRef, useState} from 'react';
import Orientation from 'react-native-orientation-locker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Separator from '@components/Seperator';
import Avatar from '@components/Avatar';
import Comment from '@components/Comment';
import SendIcon from '@assets/icon/send.svg';

const Comments: React.FC = props => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      {/*<View style={styles.header}>*/}
      {/*  <Text style={styles.headerText}>댓글</Text>*/}
      {/*</View>*/}
      <View style={{flex: 1, paddingHorizontal: 25}}>
        <FlatList scrollEnabled={true} data={Array(50)} renderItem={Comment} />
      </View>
      <View
        style={{
          // flex: 0,
          width: '100%',
          // position: 'absolute',
          // top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          // width: 300,
          // height: 300,
        }}>
        <View style={{flexDirection: 'row', paddingBottom: insets.bottom}}>
          <Input
            style={styles.textInput}
            placeholder={'댓글 입력'}
            placeholderTextColor={'#606060'}
            inputContainerStyle={{borderBottomWidth: 0}}
            renderErrorMessage={false}
            containerStyle={{paddingLeft: 10, flex: 1}}
            inputStyle={{margin: 0}}
          />
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            <SendIcon width={36} height={36} fill={'#99c729'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const useStyles = makeStyles(theme => ({
  submitButton: {
    borderRadius: 20,
  },
  container: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 25,
    // justifyContent: 'center',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
  header: {
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderColor: '#fff',
  },
  textInput: {
    // flex: 0.5,
    marginVertical: 7,
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
export default Comments;
