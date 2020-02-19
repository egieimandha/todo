import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Section, Item, RenderIf} from './components';
import {SwipeListView} from 'react-native-swipe-list-view';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import todoStore from './store/todos';
import userStore from './store/user';

const RenderToDoList = ({todo, editSection, deleteSection}) => {
  if (todo && todo.length > 0) {
    return (
      <SwipeListView
        useFlatList={true}
        data={todo}
        keyExtractor={(rowData, index) => {
          return rowData._id;
        }}
        renderItem={(rowData, rowMap) => {
          return (
            <View style={styles.rowFront}>
              <Text>{rowData.item.text}</Text>
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

const RenderModal = ({
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
                  backgroundColor={'#0000ff'}
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

const RenderModalLogin = ({
  visibleModalLogin,
  userName,
  setUserName,
  loadingLogin,
  loginHandler,
  errorMessage,
}) => {
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
              <Item small center backgroundColor={'#0000ff'} borderRadius={16}>
                <Text style={styles.backTextWhite}>Ok</Text>
              </Item>
            </TouchableOpacity>
          </RenderIf>
          <RenderIf condition={loadingLogin}>
            <Item small center backgroundColor={'#0000ff'} borderRadius={16}>
              <ActivityIndicator size="small" color="#FFF" />
            </Item>
          </RenderIf>
        </Item>
      </Item>
    </Modal>
  );
};

function App(props) {
  const [, forceUpdate] = useState();
  const [isInitialized, setIsInitialized] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalLogin, setVisibleModalLogin] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState('');
  const [valueText, setValueText] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function initFirst() {
      NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected);
      });
      if (!userStore.isInitialized) {
        const userNameStorage = await AsyncStorage.getItem('userName');
        if (userNameStorage) {
          setVisibleModalLogin(false);
          setUserName(userNameStorage);
          await todoStore.setName(userNameStorage);
          await todoStore.initialize();
          setIsInitialized(true);
          todoStore.subscribe(forceUpdate);
        } else {
          setVisibleModalLogin(true);
          await userStore.initialize();
          userStore.subscribe(forceUpdate);
        }
      } else {
        setUserName(userStore.data.id);
        await todoStore.setName(userStore.data.id);
        await todoStore.initialize();
        setIsInitialized(true);
        todoStore.subscribe(forceUpdate);
      }
    }
    initFirst();
  }, []);

  useEffect(() => {
    if (!visibleModal) {
      setValueText('');
    }
  }, [visibleModal]);

  const addToDo = () => {
    setVisibleModal(false);
    todoStore.addItem({
      text: valueText,
    });
  };

  const editToDo = () => {
    setVisibleModal(false);
    todoStore.editItem(selectedId, {
      text: valueText,
    });
    setSelectedId('');
  };

  const editSection = (rowMap, id) => {
    setSelectedId(id);
    setValueText(rowMap[id].props.item.text);
    setVisibleModal(true);
    closeRow(rowMap, id);
  };

  const deleteSection = (rowMap, id) => {
    todoStore.deleteItem(id);
    closeRow(rowMap, id);
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const validateUserName = () => {
    if (!userName) {
      setErrorMessage('Please insert username');
      return false;
    } else if (userName.length < 3) {
      setErrorMessage('Username must be 3 or more characters');
      return false;
    } else {
      return true;
    }
  };

  const loginHandler = async () => {
    setErrorMessage('');
    setLoadingLogin(true);
    if (validateUserName()) {
      await userStore.editSingle({
        id: userName,
      });
      await todoStore.setName(userName);
      await todoStore.initialize();
      await AsyncStorage.setItem('userName', userName);
      setIsInitialized(true);
      todoStore.subscribe(forceUpdate);
      setVisibleModalLogin(false);
      setLoadingLogin(false);
    } else {
      setLoadingLogin(false);
    }
  };

  const showBottomMessage = message => {
    showMessage({
      message: message,
      duration: 10000,
      type: 'default',
      backgroundColor: 'rgba(51, 51, 51, 0.75)',
      color: '#FFF',
    });
  };

  return (
    <>
      <FlashMessage position="bottom" />
      <Section>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <RenderIf condition={todoStore.isInitialized}>
            <Item center>
              <View style={styles.body}>
                <Text>{`Hi, ${userName}`}</Text>
              </View>
            </Item>
            <RenderIf condition={isInitialized}>
              <RenderToDoList
                todo={todoStore.data}
                editSection={editSection}
                deleteSection={deleteSection}
              />
            </RenderIf>
            <RenderIf condition={!isInitialized}>
              <Item center>
                <ActivityIndicator size="large" color="#0000ff" />
              </Item>
            </RenderIf>
          </RenderIf>
          <RenderIf condition={!isInitialized && !visibleModalLogin}>
            <Item center>
              <ActivityIndicator size="large" color="#0000ff" />
            </Item>
          </RenderIf>
        </SafeAreaView>
      </Section>
      <Item plain style={styles.btnAddPosition}>
        <TouchableOpacity onPress={() => setVisibleModal(true)}>
          <Icon name={'plus-circle'} size={44} color="#0000ff" />
        </TouchableOpacity>
      </Item>
      <Item plain style={styles.btnUploadPosition}>
        <TouchableOpacity
          onPress={() => {
            if (isConnected) {
              todoStore.upload();
            } else {
              showBottomMessage('Your connection is offline');
            }
          }}>
          <Icon
            name={'upload'}
            size={28}
            color={isConnected ? '#0000ff' : 'grey'}
          />
        </TouchableOpacity>
      </Item>
      <RenderModal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        valueText={valueText}
        setValueText={setValueText}
        addToDo={addToDo}
        editToDo={editToDo}
        selectedId={selectedId}
      />
      <RenderModalLogin
        visibleModalLogin={visibleModalLogin}
        userName={userName}
        setUserName={setUserName}
        loadingLogin={loadingLogin}
        loginHandler={loginHandler}
        errorMessage={errorMessage}
      />
    </>
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#0000ff',
    paddingBottom: 0,
  },
  btnAddPosition: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  btnUploadPosition: {
    position: 'absolute',
    top: 16,
    right: 20,
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
});

export default App;
