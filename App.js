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
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import todoStore from './store/todos';
import userStore from './store/user';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

const RenderToDoList = ({todo, editSection, deleteSection, completeTodo}) => {
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
                  <RenderIf condition={isComplete}>
                    <Icon
                      name={'check-circle-outline'}
                      size={20}
                      color="#3bb79f"
                      style={styles.checkIcon}
                    />
                  </RenderIf>
                  <RenderIf condition={!isComplete}>
                    <Icon
                      name={'checkbox-blank-circle-outline'}
                      size={20}
                      color="#3bb79f"
                      style={styles.checkIcon}
                    />
                  </RenderIf>
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
              <Item small center backgroundColor={'#3bb79f'} borderRadius={16}>
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
};

const RenderIconSync = ({isConnected, data}) => {
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

function App(props) {
  const [, forceUpdate] = useState();
  const [isInitialized, setIsInitialized] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalLogin, setVisibleModalLogin] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
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
      isComplete: false,
    });
  };

  const editToDo = () => {
    setVisibleModal(false);
    todoStore.editItem(selectedId, {
      text: valueText,
      isComplete: false,
    });
    setSelectedId('');
  };

  const completeTodo = (rowData, isComplete) => {
    todoStore.editItem(rowData._id, {
      text: rowData.text,
      isComplete: !isComplete,
    });
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

  const logoutHandler = async () => {
    setIsInitialized(false);
    setUserName('');
    await todoStore.deinitialize();
    await userStore.deleteSingle();
    AsyncStorage.setItem('userName', '');
    setVisibleModalLogin(true);
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
          <RenderIf condition={isInitialized}>
            <Item center>
              <Text>{`Hi, ${userName}`}</Text>
              <Item small>
                <Text>{`last update: ${dayjs(
                  todoStore.dataMeta.tsUpload,
                ).format('DD MMM YYYY HH:mm:ss')}`}</Text>
              </Item>
            </Item>
            <RenderIf condition={isInitialized}>
              <RenderToDoList
                todo={todoStore.data}
                editSection={editSection}
                deleteSection={deleteSection}
                completeTodo={completeTodo}
              />
            </RenderIf>
            <RenderIf condition={!isInitialized}>
              <Item center>
                <ActivityIndicator size="large" color="#3bb79f" />
              </Item>
            </RenderIf>
          </RenderIf>
          <RenderIf condition={!isInitialized && !visibleModalLogin}>
            <Item center>
              <ActivityIndicator size="large" color="#3bb79f" />
            </Item>
          </RenderIf>
        </SafeAreaView>
      </Section>
      <Item plain style={styles.btnAddPosition}>
        <TouchableOpacity onPress={() => setVisibleModal(true)}>
          <Icon name={'plus-circle'} size={44} color="#3bb79f" />
        </TouchableOpacity>
      </Item>
      <Item plain style={styles.btnLogoutPosition}>
        <TouchableOpacity onPress={() => logoutHandler()}>
          <SimpleLineIcons name={'logout'} size={20} color="#3bb79f" />
        </TouchableOpacity>
      </Item>
      <Item plain style={styles.btnUploadPosition}>
        <TouchableOpacity
          onPress={async () => {
            if (isConnected) {
              setLoadingSync(true);
              await todoStore.upload();
              setLoadingSync(false);
            } else {
              showBottomMessage('Your connection is offline');
            }
          }}>
          <RenderIf condition={!loadingSync}>
            <RenderIconSync
              isConnected={isConnected}
              data={todoStore.countUnuploadeds()}
            />
          </RenderIf>
          <RenderIf condition={loadingSync}>
            <ActivityIndicator size="small" color="#3bb79f" />
          </RenderIf>
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
    borderBottomColor: '#3bb79f',
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
  btnLogoutPosition: {
    position: 'absolute',
    top: 16,
    left: 20,
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

export default App;
