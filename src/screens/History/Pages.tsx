import React, {useEffect, useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import {SheetManager} from 'react-native-actions-sheet';
import Book from '@components/Book';

interface PagesProps {
  selectedIndex: number;
}

const Pages: React.FC<PagesProps> = ({selectedIndex}) => {
  const styles = useStyles();
  const pagerRef = useRef<PagerView>(null);
  useEffect(() => {
    console.log(selectedIndex);
    pagerRef.current?.setPage(selectedIndex);
  }, [selectedIndex]);

  return (
    <PagerView ref={pagerRef} style={styles.pagerView} initialPage={0}>
      <View key="1">
        <ThrottleFlatList<IPost>
          data={[1, 2, 3, 4]}
          contentContainerStyle={{width: '100%'}}
          renderItem={({item, index}) => (
            <Pressable
              onPress={() => navigation.navigate('Viewer')}
              style={{
                aspectRatio: 16 / 9,
                backgroundColor: index % 2 === 0 ? '#1a3692' : '#e73f90',
                width: '100%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 24,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{flex: 1, margin: 8, justifyContent: 'space-between'}}>
                  <Text
                    style={{fontSize: 22, fontWeight: 'bold'}}
                    numberOfLines={2}>
                    크리스마스어쩌고 저쩌고
                  </Text>
                  <View>
                    <Text style={{fontSize: 12}} numberOfLines={3}>
                      올린이는 크리스마스 에세이에 대한 정보를 피드에 간단히
                      보여줄 수 있 습니다.
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        fontSize: 12,
                        alignSelf: 'flex-end',
                      }}>
                      작가가 누구
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    // flex: 1,
                    marginLeft: 32,
                    aspectRatio: 3 / 4,
                    // backgroundColor: 'white',
                    height: '100%',
                  }}>
                  <View
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.22,
                      shadowRadius: 2.22,
                      elevation: 3,
                      position: 'absolute',
                      top: 12,
                      // right: 50,
                      left: 10,
                      backgroundColor: 'white',
                      // flex: 1,
                      height: '70%',
                      // width: '100%',
                      aspectRatio: 1 / Math.sqrt(2),
                    }}>
                    {/*<View*/}
                    {/*  style={{*/}
                    {/*    width: '100%',*/}
                    {/*    height: '100%',*/}
                    {/*    backgroundColor: 'yellow',*/}
                    {/*  }}></View>*/}
                  </View>
                  <View
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.22,
                      shadowRadius: 2.22,
                      elevation: 3,
                      position: 'absolute',
                      right: 10,
                      bottom: 12,
                      // backgroundColor: 'brown',
                      height: '70%',
                      aspectRatio: 1 / Math.sqrt(2),
                    }}>
                    <Book />
                  </View>
                </View>
                {/*<Text>{item._id}</Text>*/}
              </View>
            </Pressable>
          )}
        />
      </View>
      <View key="2">
        <ThrottleFlatList<IPost>
          data={new Array(10)}
          // style={{width: '100%'}}
          renderItem={({item, index}) => (
            <Pressable
              onPress={() => {
                SheetManager.show('collectionSheet').then(r => console.log(r));
              }}
              style={{
                backgroundColor: index % 2 === 0 ? '#1a3692' : '#e73f90',
                paddingHorizontal: 42,
                paddingVertical: 54,
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 14}}>크리스마스어쩌고 저쩌고</Text>
            </Pressable>
          )}
        />
      </View>
    </PagerView>
  );
};

const useStyles = makeStyles(theme => ({
  pagerView: {
    flex: 1,
    // backgroundColor: 'red',
  },
}));

export default Pages;
