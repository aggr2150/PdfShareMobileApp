import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import {SheetManager} from 'react-native-actions-sheet';
import Separator from '@components/Seperator';
import ToggleBtn from '@components/ToggleBtn';
import PlusButton from '@components/buttons/PlusButton';

const SecondScene: React.FC = () => {
  const styles = useStyles();

  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <View>
      <ThrottleFlatList<IPost>
        data={new Array(10)}
        // style={{width: '100%'}}
        ItemSeparatorComponent={Separator}
        renderItem={({item, index}) => (
          <Pressable
            onPress={() => {
              SheetManager.show('collectionSheet').then(r => console.log(r));
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

      <View style={styles.container}>
        <View style={{position: 'absolute', bottom: 20, zIndex: 1}}>
          <PlusButton
            onPress={() =>
              SheetManager.show('collectionSheet').then(r => console.log(r))
            }
            color={'white'}
          />
        </View>
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // backgroundColor: 'red',
  },
}));

export default SecondScene;
