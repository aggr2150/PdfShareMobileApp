import {FlatList, Pressable, TouchableOpacity, View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import React, {useCallback, useEffect, useState} from 'react';
import Separator from '@components/Seperator';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import Toast from 'react-native-toast-message';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {
  collectionAddedMany,
  selectAll,
} from '@redux/reducer/collectionsReducer';
import {Checkbox} from 'react-native-paper';

interface AppendToCollectionSheetProps {
  postId: string;
}

const AppendToCollectionSheet: React.FC<
  SheetProps<AppendToCollectionSheetProps>
> = props => {
  const styles = useStyles(props);
  const [csrfToken, setCsrfToken] = useState<string>();
  const dispatch = useAppDispatch();
  // const [checked, setChecked] = useState<boolean[]>([]);
  // const [checked, setChecked] = useState<boolean>(false);
  const [checked, setChecked] = useState<any[]>([]);
  const collections = useAppSelector(state => {
    // setChecked(new Array(pulledCollections.length).fill(false));
    return selectAll(state.collections);
  });
  useEffect(() => {
    setChecked(
      collections.map(value => ({
        _id: value._id,
        checked: false,
        title: value.title,
      })),
    );
  }, [collections]);

  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
    apiInstance
      .post<response<ICollection[]>>('/api/collection/list')
      .then(response => {
        if (response.data.data.length !== 0) {
          // setData(response.data.data);
          dispatch(collectionAddedMany(response.data.data));
        }
      });
  }, [dispatch]);
  const submit = useCallback(() => {
    apiInstance
      .post('/api/collection/append', {
        _csrf: csrfToken,
        postId: props.payload?.postId,
        collectionIds: checked.reduce((previousValue, currentValue) => {
          currentValue.checked && previousValue.push(currentValue._id);
          return previousValue;
        }, []),
      })
      .then(response => {
        if (response.data.code === 200) {
          console.log(response.data);
          SheetManager.hide('appendToCollectionSheet').then();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Unknown Error Occurred!',
            position: 'bottom',
          });
        }
      });
  }, [checked, csrfToken, props.payload?.postId]);
  const renderItem = ({item, index}) => {
    //id가 selectedId라면 배경색상 변경

    return (
      <TouchableOpacity
        onPress={() => {
          setChecked(prev => {
            prev[index].checked = !prev[index].checked;
            return [...prev];
          });
          // setChecked([...checked])
        }}
        style={{
          flexDirection: 'row',
          paddingHorizontal: 13,
          marginVertical: 10,
          // backgroundColor: 'white',
        }}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{fontSize: 13}}>{item.title}</Text>
        </View>
        {/*<View style={{width: 50, height: 50}}>*/}
        <Checkbox.Android
          status={item.checked ? 'checked' : 'unchecked'}
          color={'#99C729'}
        />
        {/*<Text style={{fontSize: 13}}>{item.title}</Text>*/}
        {/*</View>*/}
      </TouchableOpacity>
    );
  };
  return (
    <ActionSheet
      id={props.sheetId}
      // headerAlwaysVisible={false}
      // gestureEnabled={true}
      CustomHeaderComponent={<></>}
      statusBarTranslucent
      overdrawSize={0}
      isModal={true}
      // style={{
      //   height: '30%',
      //   maxHeight: '30%',
      // }}
      // indicatorStyle={{height: 100}}
      // drawUnderStatusBar={true}
      useBottomSafeAreaPadding={true}
      containerStyle={styles.container}>
      <View>
        <View style={styles.header}>
          <Text style={styles.headerText}>콜렉션 생성</Text>
        </View>
        <Separator />
        <FlatList<ICollection>
          data={checked}
          style={{height: '60%'}}
          ItemSeparatorComponent={Separator}
          renderItem={renderItem}
        />
        <View
          style={{
            alignItems: 'center',
            borderRadius: 100,
            overflow: 'hidden',
            marginVertical: 18,
          }}>
          <Pressable
            onPress={submit}
            style={{
              borderRadius: 100,
              paddingHorizontal: 28,
              backgroundColor: '#3a3a3a',
              paddingVertical: 13,
            }}>
            <Text style={{fontSize: 13}}>완료</Text>
          </Pressable>
        </View>
      </View>
    </ActionSheet>
  );
};
const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.background,
    // justifyContent: 'center',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
    height: '60%',
    maxHeight: '60%',
  },
  submitButton: {
    borderRadius: 20,
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
export default AppendToCollectionSheet;
