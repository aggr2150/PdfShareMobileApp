import React, {Dispatch} from 'react';
import {Modal, ProgressBar} from 'react-native-paper';
import {View, ViewStyle} from 'react-native';
import {Text} from '@rneui/themed';

interface ProgressModalProps {
  progressModalVisible: boolean;
  setProgressModalVisible: Dispatch<boolean>;
}
const ProgressModal: React.FC<ProgressModalProps> = ({
  progressModalVisible,
  setProgressModalVisible,
}) => {
  const containerStyle: ViewStyle = {
    backgroundColor: 'white',
    // padding: 20,
    top: '30%',
    position: 'absolute',
    // margin: 50,
    // marginHorizontal: '20%',
    alignSelf: 'center',
    borderRadius: 42,
    opacity: 0.9,
    // alignItems: 'center',
    // justifyContent: 'center',
    // alignContent: 'center',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  };

  return (
    <Modal
      visible={progressModalVisible}
      contentContainerStyle={containerStyle}
      onDismiss={() => setProgressModalVisible(false)}>
      <View
        style={{
          marginHorizontal: 32,
          marginVertical: 42,
          justifyContent: 'center',
        }}>
        <View style={{marginBottom: 24, alignItems: 'center'}}>
          <Text style={{color: 'black', fontSize: 13}}>
            업로드가 진행 중 입니다.
          </Text>
        </View>
        <ProgressBar
          style={{
            minWidth: 230,
            height: 7,
            borderRadius: 3,
            backgroundColor: '#99c729',
          }}
          progress={0.5}
          color={'#fcfc22'}
          indeterminate={true}
        />
      </View>
    </Modal>
  );
};

export default ProgressModal;
