import React from 'react';
import 'react-native';
import {
  RenderIconSync,
  RenderModalLogin,
  RenderModal,
  RenderToDoList,
  RenderCheckIcon,
} from '../../components/main';
import renderer from 'react-test-renderer';

describe('Components Main', () => {
  let isConnectedMock;
  const userNameMock = 'test';
  const setUserNameMock = jest.fn();
  const valueTextMock = 'todo what';
  const setValueTextMock = jest.fn();
  describe('Render Icon Sync', () => {
    it('should be rendered icon sync when have connection internet', () => {
      isConnectedMock = true;
      const testRenderIconSync = renderer.create(
        <RenderIconSync isConnected={isConnectedMock} />,
      );
      expect(testRenderIconSync.toJSON()).toMatchSnapshot();
    });
    it('should be rendered icon sync with some new when new data changed', () => {
      isConnectedMock = true;
      const testRenderIconSync = renderer.create(
        <RenderIconSync isConnected={isConnectedMock} data />,
      );
      expect(testRenderIconSync.toJSON()).toMatchSnapshot();
    });
    it('should be rendered icon cannot sync when do not have connection internet', () => {
      isConnectedMock = false;
      const testRenderIconSync = renderer.create(
        <RenderIconSync isConnected={isConnectedMock} />,
      );
      expect(testRenderIconSync.toJSON()).toMatchSnapshot();
    });
  });
  describe('Render Modal Login', () => {
    let visibleModalLoginMock;
    const loadingLoginMock = true;
    const loginHandlerMock = jest.fn();
    const errorMessageMock = '';
    it('should be rendered when visible true', () => {
      visibleModalLoginMock = true;
      const testRenderModalLogin = renderer.create(
        <RenderModalLogin
          visibleModalLogin={visibleModalLoginMock}
          userName={userNameMock}
          setUserName={setUserNameMock}
          loadingLogin={loadingLoginMock}
          loginHandler={loginHandlerMock}
          errorMessage={errorMessageMock}
        />,
      );
      expect(testRenderModalLogin.toJSON()).toMatchSnapshot();
    });
    it('should be not rendered when visible false', () => {
      visibleModalLoginMock = false;
      const testRenderModalLogin = renderer.create(
        <RenderModalLogin
          visibleModalLogin={visibleModalLoginMock}
          userName={userNameMock}
          setUserName={setUserNameMock}
          loadingLogin={loadingLoginMock}
          loginHandler={loginHandlerMock}
          errorMessage={errorMessageMock}
        />,
      );
      expect(testRenderModalLogin.toJSON()).toMatchSnapshot();
    });
  });
  describe('Render Modal', () => {
    let visibleModalMock = true;
    let selectedIdMock = '1234567890';
    const setVisibleModalMock = jest.fn();
    const addToDoMock = jest.fn();
    const editToDoMock = jest.fn();
    it('should be rendered when visible true', () => {
      visibleModalMock = true;
      const testRenderModal = renderer.create(
        <RenderModal
          visibleModal={visibleModalMock}
          setVisibleModal={setVisibleModalMock}
          valueText={valueTextMock}
          setValueText={setValueTextMock}
          addToDo={addToDoMock}
          editToDo={editToDoMock}
          selectedId={selectedIdMock}
        />,
      );
      expect(testRenderModal.toJSON()).toMatchSnapshot();
    });
    it('should be not rendered when visible true', () => {
      visibleModalMock = false;
      const testRenderModal = renderer.create(
        <RenderModal
          visibleModal={visibleModalMock}
          setVisibleModal={setVisibleModalMock}
          valueText={valueTextMock}
          setValueText={setValueTextMock}
          addToDo={addToDoMock}
          editToDo={editToDoMock}
          selectedId={selectedIdMock}
        />,
      );
      expect(testRenderModal.toJSON()).toMatchSnapshot();
    });
  });
  describe('Render Icon Check', () => {
    let isCompleteMock;
    it('should be rendered icon check when complete', () => {
      isCompleteMock = true;
      const testRenderCheckIcon = renderer.create(
        <RenderCheckIcon isComplete={isCompleteMock} />,
      );
      expect(testRenderCheckIcon.toJSON()).toMatchSnapshot();
    });
    it('should be rendered icon not check when complete', () => {
      isCompleteMock = false;
      const testRenderCheckIcon = renderer.create(
        <RenderCheckIcon isComplete={isCompleteMock} />,
      );
      expect(testRenderCheckIcon.toJSON()).toMatchSnapshot();
    });
  });
  describe('RenderToDoList', () => {
    let todoStoreDataMock = [];
    const deleteSectionMock = jest.fn();
    const editSectionMock = jest.fn();
    const completeTodoMock = jest.fn();
    it('should be rendered when have todo and todo length > 0', () => {
      todoStoreDataMock = [
        {
          _id: '123-456',
          text: 'todo 1',
          isComplete: false,
        },
        {
          _id: '456-789',
          text: 'todo 2',
          isComplete: true,
        },
      ];
      const testRenderModal = renderer.create(
        <RenderToDoList
          todo={todoStoreDataMock}
          editSection={editSectionMock}
          deleteSection={deleteSectionMock}
          completeTodo={completeTodoMock}
        />,
      );
      expect(testRenderModal.toJSON()).toMatchSnapshot();
    });
    it('should be not rendered when todo length < 0', () => {
      todoStoreDataMock = [];
      const testRenderModal = renderer.create(
        <RenderToDoList
          todo={todoStoreDataMock}
          editSection={editSectionMock}
          deleteSection={deleteSectionMock}
          completeTodo={completeTodoMock}
        />,
      );
      expect(testRenderModal.toJSON()).toMatchSnapshot();
    });
  });
});
