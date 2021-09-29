import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import fontFamily from '../styles/fontFamily';
import {
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';

export default function BottomViewModal({show, mainContainView, closeModal}) {
  return (
    <Modal isVisible={show} style={styles.modal} animationInTiming={600}>
      <View style={styles.modalContainer}>
        <View
          style={{
            height: moderateScaleVertical(30),
            width: width - 40,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: textScale(14)}}>
            {strings.PLEASESELECTONECATEGORY}
          </Text>
          <TouchableOpacity onPress={() => closeModal()}>
            <Image source={imagePath.cross} />
          </TouchableOpacity>
        </View>
        {mainContainView()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  modalText: {
    fontSize: 18,
    color: '#555',
    marginTop: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
});
