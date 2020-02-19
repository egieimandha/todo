import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import {Section, Item, RenderIf} from './components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import todoStore from './store/todos';
import userStore from './store/user';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');
import {
  RenderToDoList,
  RenderModal,
  RenderModalLogin,
  RenderIconSync,
} from './components/main';

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
      setErrorMessage('');
    }
  }, [visibleModal]);

  const addToDo = () => {
    if (validateTextInput(valueText)) {
      setVisibleModal(false);
      todoStore.addItem({
        text: valueText,
        isComplete: false,
      });
    }
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

  const validateTextInput = textInput => {
    if (!isConnected) {
      setErrorMessage('Please check your connection');
      return false;
    } else if (!textInput) {
      setErrorMessage('Please insert');
      return false;
    } else if (textInput.length < 3) {
      setErrorMessage('Must be 3 or more characters');
      return false;
    } else {
      return true;
    }
  };

  const loginHandler = async () => {
    setErrorMessage('');
    setLoadingLogin(true);
    if (validateTextInput(userName)) {
      await userStore.editSingle({
        id: userName,
      });
      await todoStore.setName(userName);
      await todoStore.initialize();
      await todoStore.upload();
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
    <Item plain backgroundColor={'#fafafa'} height={'100%'}>
      <FlashMessage position="bottom" />
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <RenderIf condition={isInitialized}>
          <Item header backgroundColor={'#fff'}>
            <Text style={styles.headerText}>{`Hi, ${userName}`}</Text>
          </Item>
          <Item plain>
            <RenderIf condition={isInitialized}>
              <Section>
                <Item small>
                  <Text style={styles.lastUpdateText}>{`last update: ${dayjs(
                    todoStore.dataMeta.tsUpload,
                  ).format('DD MMM YYYY HH:mm:ss')}`}</Text>
                </Item>
                <RenderToDoList
                  todo={todoStore.data}
                  editSection={editSection}
                  deleteSection={deleteSection}
                  completeTodo={completeTodo}
                />
              </Section>
            </RenderIf>
            <RenderIf condition={!isInitialized}>
              <Item center>
                <ActivityIndicator size="large" color="#3bb79f" />
              </Item>
            </RenderIf>
          </Item>
        </RenderIf>
        <RenderIf condition={!isInitialized && !visibleModalLogin}>
          <Item center>
            <ActivityIndicator size="large" color="#3bb79f" />
          </Item>
        </RenderIf>
      </SafeAreaView>
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
          style={styles.containerBtnUpload}
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
        errorMessage={errorMessage}
      />
      <RenderModalLogin
        visibleModalLogin={visibleModalLogin}
        userName={userName}
        setUserName={setUserName}
        loadingLogin={loadingLogin}
        loginHandler={loginHandler}
        errorMessage={errorMessage}
      />
    </Item>
  );
}

const styles = StyleSheet.create({
  btnAddPosition: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  btnUploadPosition: {
    borderWidth: 1,
    borderColor: '#3bb79f',
    borderRadius: 8,
    position: 'absolute',
    top: 14,
    right: 20,
  },
  btnLogoutPosition: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  lastUpdateText: {
    fontSize: 10,
    color: '#606266',
  },
  containerBtnUpload: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});

export default App;
