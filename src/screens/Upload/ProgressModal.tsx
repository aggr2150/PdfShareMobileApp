import React, {Dispatch} from 'react';
import {Modal, ProgressBar} from 'react-native-paper';
import {View} from 'react-native';
import {Text} from '@rneui/themed';

interface ProgressModalProps {
  progressModalVisible: boolean;
  setProgressModalVisible: Dispatch<boolean>;
}
const ProgressModal: React.FC<ProgressModalProps> = ({
  progressModalVisible,
  setProgressModalVisible,
}) => {
  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    margin: 50,
    marginHorizontal: '20%',
  };

  return (
    <Modal
      visible={progressModalVisible}
      onDismiss={() => setProgressModalVisible(false)}
      contentContainerStyle={containerStyle}>
      <View>
        <View style={{marginTop: 20, marginBottom: 30, alignItems: 'center'}}>
          <Text style={{color: 'black', fontSize: 16}}>업로드 진행중</Text>
        </View>
        <ProgressBar progress={0.5} color={'#99c729'} indeterminate={true} />
      </View>
    </Modal>
  );
};

export default ProgressModal;
