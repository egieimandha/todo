import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Item, RenderIf} from './';
import {SwipeListView} from 'react-native-swipe-list-view';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

export const RenderToDoList = ({
  todo,
  editSection,
  deleteSection,
  completeTodo,
}) => {
  if (todo && todo.length > 0) {
    return (
      <SwipeListView
        useFlatList={true}
        data={todo}
        keyExtractor={(rowData, index) => {
          return rowData._id;
        }}
        renderItem={(rowData, rowMap) => {
          const {text, isComplete} = rowData.item;
          return (
            <View style={styles.rowFront}>
              <TouchableOpacity
                onPress={() => completeTodo(rowData.item, isComplete)}>
                <Item row plain>
                  <RenderCheckIcon isComplete={isComplete} />
                  <Text>{text}</Text>
                </Item>
              </TouchableOpacity>
            </View>
          );
        }}
        renderHiddenItem={(rowData, rowMap) => (
          <View style={styles.rowBack}>
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnLeft]}
              onPress={() => editSection(rowMap, rowData.item._id)}>
              <Text style={styles.backTextWhite}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={() => deleteSection(rowMap, rowData.item._id)}>
              <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        disableRightSwipe={true}
        rightOpenValue={-150}
      />
    );
  } else {
    return null;
  }
};

export const RenderCheckIcon = ({isComplete}) => {
  const iconName = isComplete
    ? 'check-circle-outline'
    : 'checkbox-blank-circle-outline';
  return (
    <Icon name={iconName} size={20} color="#3bb79f" style={styles.checkIcon} />
  );
};

export const RenderModal = ({
  visibleModal,
  setVisibleModal,
  valueText,
  setValueText,
  addToDo,
  editToDo,
  selectedId,
}) => {
  if (visibleModal) {
    return (
      <Modal
        animationIn="slideInDown"
        animationOut="slideOutUp"
        useNativeDriver={true}
        isVisible={visibleModal}
        containerStyle={styles.containerModal}>
        <Item
          center
          backgroundColor={Colors.lighter}
          style={styles.containerModal}>
          <Item plain style={styles.titleModal}>
            <Text>What you gonna do?</Text>
          </Item>
          <Item center width={'95%'}>
            <TextInput
              style={styles.textInputContainer}
              onChangeText={text => setValueText(text)}
              value={valueText}
              placeholder={'Type here'}
            />
          </Item>
          <Item plain style={styles.containerBtnModal}>
            <Item small row spaceBetween>
              <TouchableOpacity
                style={styles.btnModal}
                onPress={() => setVisibleModal(false)}>
                <Item small center backgroundColor={'red'} borderRadius={16}>
                  <Text style={styles.backTextWhite}>Cancel</Text>
                </Item>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnModal}
                onPress={() => {
                  if (selectedId) {
                    editToDo();
                  } else {
                    addToDo();
                  }
                }}>
                <Item
                  small
                  center
                  backgroundColor={'#3bb79f'}
                  borderRadius={16}>
                  <Text style={styles.backTextWhite}>Ok</Text>
                </Item>
              </TouchableOpacity>
            </Item>
          </Item>
        </Item>
      </Modal>
    );
  } else {
    return null;
  }
};

export const RenderModalLogin = ({
  visibleModalLogin,
  userName,
  setUserName,
  loadingLogin,
  loginHandler,
  errorMessage,
}) => {
  if (visibleModalLogin) {
    return (
      <Modal
        animationIn="slideInDown"
        animationOut="slideOutUp"
        useNativeDriver={true}
        isVisible={visibleModalLogin}
        containerStyle={styles.containerModal}>
        <Item
          center
          backgroundColor={Colors.lighter}
          style={styles.containerModal}>
          <Item plain style={styles.titleModal}>
            <Text>Who are you?</Text>
          </Item>
          <Item center width={'95%'}>
            <TextInput
              style={styles.textInputContainer}
              onChangeText={text => setUserName(text)}
              value={userName}
              placeholder={'Type username here'}
            />
            <Item small>
              <RenderIf condition={errorMessage}>
                <Text style={styles.errorMessageText}>{errorMessage}</Text>
              </RenderIf>
            </Item>
          </Item>
          <Item plain style={styles.containerBtnModalLogin}>
            <RenderIf condition={!loadingLogin}>
              <TouchableOpacity onPress={() => loginHandler()}>
                <Item
                  small
                  center
                  backgroundColor={'#3bb79f'}
                  borderRadius={16}>
                  <Text style={styles.backTextWhite}>Ok</Text>
                </Item>
              </TouchableOpacity>
            </RenderIf>
            <RenderIf condition={loadingLogin}>
              <Item small center backgroundColor={'#3bb79f'} borderRadius={16}>
                <ActivityIndicator size="small" color="#FFF" />
              </Item>
            </RenderIf>
          </Item>
        </Item>
      </Modal>
    );
  } else {
    return null;
  }
};

export const RenderIconSync = ({isConnected, data}) => {
  if (isConnected) {
    if (data) {
      return <Icon name={'sync-alert'} size={26} color="#3bb79f" />;
    } else {
      return <Icon name={'sync'} size={26} color="#3bb79f" />;
    }
  } else {
    return <Icon name={'sync-off'} size={26} color="red" />;
  }
};

const styles = StyleSheet.create({
  textInputContainer: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#3bb79f',
    paddingBottom: 0,
  },
  containerModal: {
    height: 172,
    borderRadius: 12,
  },
  containerBtnModalLogin: {
    position: 'absolute',
    bottom: 20,
    width: '32%',
  },
  containerBtnModal: {
    position: 'absolute',
    bottom: 20,
  },
  btnModal: {
    width: '40%',
  },
  rowFront: {
    paddingHorizontal: 8,
    backgroundColor: '#F3F3F3',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 32,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    height: 32,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
  errorMessageText: {
    color: 'red',
    fontSize: 12,
  },
  checkIcon: {
    marginRight: 4,
  },
});
