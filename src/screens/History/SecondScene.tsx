import React from 'react';
import {Pressable} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import {SheetManager} from 'react-native-actions-sheet';
import Separator from '@components/Seperator';

const SecondScene: React.FC = () => {
  const styles = useStyles();

  return (
    <ThrottleFlatList<TPlace>
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
  );
};

const useStyles = makeStyles(theme => ({
  pagerView: {
    flex: 1,
    // backgroundColor: 'red',
  },
}));

export default SecondScene;
