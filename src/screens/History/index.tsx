import React, {useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import ToggleBtn from '@components/ToggleBtn';
import Pages from '@components/Pages';
import FirstScene from '@screens/History/FirstScene';
import SecondScene from '@screens/History/SecondScene';
import Separator from '@components/Seperator';
import {SheetManager} from 'react-native-actions-sheet';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import PlusIcon from '@assets/icon/plus2.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

enum EnumSelectedIndex {
  '히스토리',
  '콜렉션',
}

const History = () => {
  const styles = useStyles();
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState<EnumSelectedIndex>(
    EnumSelectedIndex.히스토리,
  );
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <ThrottleFlatList<TPlace>
        data={new Array(10)}
        // style={{width: '100%'}}
        ListHeaderComponent={() => (
          <View style={{paddingTop: insets.top || 30}}>
            <FirstScene />
            <View
              style={{
                marginVertical: 30,
                marginHorizontal: 30,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 17}}>콜렉션</Text>
              <Pressable
                onPress={() =>
                  SheetManager.show('collectionSheet').then(r => console.log(r))
                }>
                <PlusIcon fill={'#fff'} width={32} height={32} />
              </Pressable>
            </View>
          </View>
        )}
        // ItemSeparatorComponent={Separator}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 3,
            }}
          />
        )}
        renderItem={({item, index}) => (
          <Pressable
            onPress={() => {
              navigation.navigate('CollectionList');
            }}
            style={{
              backgroundColor: '#282828',
              paddingHorizontal: 42,
              paddingVertical: 54,
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 14}}>크리스마스어쩌고 저쩌고</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
}));

export default History;
