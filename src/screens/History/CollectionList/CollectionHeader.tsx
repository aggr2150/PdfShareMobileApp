import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import BackButton from '@components/BackButton';
import {Menu} from 'react-native-paper';

import DotIcon from '@assets/icon/horizontalDots.svg';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch} from '@redux/store/RootStore';
import {removeCollection} from '@redux/reducer/collectionsReducer';
import {apiInstance} from '@utils/Networking';

interface CollectionHeaderProps {
  collection?: ICollection;
  openSheet: () => void;
}
const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  collection,
  openSheet,
}) => {
  const [visible, setVisible] = React.useState(false);
  const closeMenu = () => setVisible(false);
  const openMenu = () => setVisible(true);
  const styles = useStyles();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          marginRight: 30,
          marginVertical: 30,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View
            style={{
              // flexDirection: 'row',
              padding: 12,
            }}>
            <BackButton onPress={() => navigation.goBack()} color={'white'} />
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{fontSize: 17}}>{collection?.title}</Text>
          </View>
        </View>
        <View>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            contentStyle={{backgroundColor: 'black'}}
            anchor={
              <TouchableOpacity
                onPress={openMenu}
                style={{
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <DotIcon fill={'white'} width={24} height={24} />
              </TouchableOpacity>
            }>
            <Menu.Item
              dense={true}
              onPress={() => {
                openSheet();
                closeMenu();
              }}
              title={<Text style={styles.menuText}>콜렉션 수정</Text>}
            />
            <Menu.Item
              dense={true}
              onPress={() => {
                apiInstance
                  .post<response>('/api/collection/delete', {
                    collectionId: collection?._id,
                  })
                  .then(response => {
                    if (response.data.code === 200) {
                      dispatch(removeCollection(collection?._id as string));
                      closeMenu();
                      navigation.goBack();
                    }
                  });
              }}
              title={<Text style={styles.menuText}>콜렉션 삭제</Text>}
            />
          </Menu>
          {/*<Pressable onPress={() => renameSheetRef.current?.show()}>*/}
          {/*  <PencilIcon fill={'#fff'} width={32} height={32} />*/}
          {/*</Pressable>*/}
        </View>
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: theme.colors.background,
  },

  sheetContainer: {
    backgroundColor: theme.colors.background,
    // justifyContent: 'center',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
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
  menuText: {
    fontSize: 12,
    color: theme.colors.black,
  },
}));

export default CollectionHeader;
