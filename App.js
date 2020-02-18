import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import todoStore from './store/todos';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Section, Item, RenderIf} from './components';
import {SwipeListView} from 'react-native-swipe-list-view';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

const RenderModal = ({visibleModal, setVisibleModal}) => {
  if (visibleModal) {
    return (
      <Modal isVisible={visibleModal} containerStyle={styles.containerModal}>
        <Item
          center
          backgroundColor={Colors.lighter}
          style={styles.containerModal}>
          <Item plain style={styles.titleModal}>
            <Text>What you gonna do?</Text>
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
                onPress={() => setVisibleModal(false)}>
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

function App(props) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [, forceUpdate] = useState();

  useEffect(() => {
    async function initFirst() {
      if (!todoStore.isInitialized) {
        todoStore.setName('test');
        await todoStore.initialize();
        setIsInitialized(true);
        todoStore.subscribe(forceUpdate);
      }
    }
    initFirst();
  }, []);

  const editSection = (rowMap, id) => {
    setVisibleModal(true);
    closeRow(rowMap, id);
  };

  const deleteSection = (rowMap, id) => {
    todoStore.deleteItem(id, todoStore.deleteItem);
    closeRow(rowMap, id);
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  return (
    <>
      <Section>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <Item center>
            <View style={styles.body}>
              <Text>todos_test</Text>
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
        </SafeAreaView>
      </Section>
      <Item plain style={styles.btnAddPosition}>
        <TouchableOpacity onPress={() => setVisibleModal(true)}>
          <Icon name={'plus-circle'} size={44} color="#0000ff" />
        </TouchableOpacity>
      </Item>
      <Item plain style={styles.btnUploadPosition}>
        <TouchableOpacity onPress={() => todoStore.upload()}>
          <Icon name={'upload'} size={28} color="#0000ff" />
        </TouchableOpacity>
      </Item>
      <RenderModal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
    height: 200,
    borderRadius: 12,
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
});

export default App;
