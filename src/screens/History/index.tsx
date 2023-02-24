import React, {useState} from 'react';
import {View} from 'react-native';
import {makeStyles} from '@rneui/themed';
import ToggleBtn from '@components/ToggleBtn';
import Pages from '@components/Pages';
import FirstScene from '@screens/History/FirstScene';
import SecondScene from '@screens/History/SecondScene';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

enum EnumSelectedIndex {
  'History',
  'Collection',
}

const History = () => {
  const styles = useStyles();
  // const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState<EnumSelectedIndex>(
    EnumSelectedIndex.History,
  );
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={{position: 'absolute', top: insets.top || 24, zIndex: 1}}>
        <ToggleBtn
          labelText={['히스토리', '콜렉션']}
          textStyle={{fontSize: 10}}
          switchStyle={{borderRadius: 23, backgroundColor: '#262626'}}
          containerStyle={{
            height: 46,
            minWidth: 200,
            borderRadius: 23,
            backgroundColor: '#000',
          }}
          onPress={setSelectedIndex}
          splitCenter={true}
          selectedIndex={selectedIndex}
        />
      </View>
      <View
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
        }}>
        <Pages
          setSelectedIndex={setSelectedIndex}
          selectedIndex={selectedIndex}
          SceneMap={[FirstScene, SecondScene]}
        />
      </View>
      {/*<ThrottleFlatList<IPost>*/}
      {/*  data={new Array(10)}*/}
      {/*  // style={{width: '100%'}}*/}
      {/*  ListHeaderComponent={() => (*/}
      {/*    <View style={{paddingTop: insets.top || 30}}>*/}
      {/*      <FirstSceneBk />*/}
      {/*      <View*/}
      {/*        style={{*/}
      {/*          marginVertical: 30,*/}
      {/*          marginHorizontal: 30,*/}
      {/*          flexDirection: 'row',*/}
      {/*          justifyContent: 'space-between',*/}
      {/*        }}>*/}
      {/*        <Text style={{fontSize: 17}}>콜렉션</Text>*/}
      {/*        <Pressable*/}
      {/*          onPress={() =>*/}
      {/*            SheetManager.show('collectionSheet').then(r => console.log(r))*/}
      {/*          }>*/}
      {/*          <PlusIcon fill={'#fff'} width={32} height={32} />*/}
      {/*        </Pressable>*/}
      {/*      </View>*/}
      {/*    </View>*/}
      {/*  )}*/}
      {/*  // ItemSeparatorComponent={Separator}*/}
      {/*  ItemSeparatorComponent={() => (*/}
      {/*    <View*/}
      {/*      style={{*/}
      {/*        height: 3,*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  )}*/}
      {/*  renderItem={({item, index}) => (*/}
      {/*    <Pressable*/}
      {/*      onPress={() => {*/}
      {/*        navigation.navigate('CollectionList');*/}
      {/*      }}*/}
      {/*      style={{*/}
      {/*        backgroundColor: '#282828',*/}
      {/*        paddingHorizontal: 42,*/}
      {/*        paddingVertical: 54,*/}
      {/*        justifyContent: 'center',*/}
      {/*      }}>*/}
      {/*      <Text style={{fontSize: 14}}>크리스마스어쩌고 저쩌고</Text>*/}
      {/*    </Pressable>*/}
      {/*  )}*/}
      {/*/>*/}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
}));

export default History;
